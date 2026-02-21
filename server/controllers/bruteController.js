import { z } from 'zod';
import { ShiftCipher } from '../services/shiftCipher.js';
import { FrequencyAnalysis } from '../services/frequencyAnalysis.js';

// Input validation schema
const bruteForceSchema = z.object({
  ciphertext: z.string()
    .min(1, 'Ciphertext cannot be empty')
    .max(10000, 'Ciphertext too long (max 10,000 characters)')
    .refine(
      (text) => /[a-zA-Z]/.test(text),
      'Ciphertext must contain at least one letter'
    ),
  language: z.enum(['auto', 'english', 'kinyarwanda', 'french']).optional().default('auto')
});

export class BruteController {
  /**
   * Handle brute force analysis request
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async analyze(req, res) {
    const startTime = Date.now();
    
    try {
      // Validate input
      const validation = bruteForceSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      const { ciphertext, language } = validation.data;
      
      // Sanitize input
      const sanitized = ciphertext.trim();
      
      // Perform brute force
      const results = ShiftCipher.bruteForce(sanitized);
      
      // Rank results using frequency analysis with language support
      const ranked = FrequencyAnalysis.rankResults(results, language);
      
      // Detect language if auto mode
      let detectedLanguage = language;
      if (language === 'auto' && ranked.length > 0) {
        detectedLanguage = ranked[0].detectedLanguage || ranked[0].language || 'english';
      }
      
      // Calculate processing time
      const processingTime = Date.now() - startTime;
      
      // Return results
      res.json({
        success: true,
        data: {
          original: sanitized,
          results: ranked,
          totalShifts: ranked.length,
          bestGuess: ranked[0],
          detectedLanguage: detectedLanguage,
          statistics: {
            processingTime: `${processingTime}ms`,
            averageScore: (ranked.reduce((sum, r) => sum + r.score, 0) / ranked.length).toFixed(4),
            highestScore: ranked[0].score.toFixed(4),
            lowestScore: ranked[ranked.length - 1].score.toFixed(4)
          }
        },
        meta: {
          timestamp: req.requestTime,
          version: '1.0.0',
          supportedLanguages: FrequencyAnalysis.getSupportedLanguages()
        }
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error during analysis',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get API information
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static getInfo(req, res) {
    res.json({
      success: true,
      data: {
        name: 'Multi-Language Shift Cipher Decoder API',
        version: '1.0.0',
        description: 'Analyzes shift cipher (Caesar cipher) using brute force and frequency analysis',
        supportedLanguages: FrequencyAnalysis.getSupportedLanguages(),
        endpoints: {
          analyze: {
            method: 'POST',
            path: '/api/brute',
            description: 'Analyze ciphertext with brute force',
            body: {
              ciphertext: 'string (1-10000 characters, must contain letters)',
              language: 'string (optional: "auto", "english", "kinyarwanda", "french") - default: "auto"'
            }
          }
        },
        features: [
          'Tests all 26 possible shift values',
          'Multi-language frequency analysis (English, Kinyarwanda, French)',
          'Automatic language detection',
          'Chi-squared statistical scoring',
          'Results ranked by confidence',
          'Input validation and sanitization'
        ]
      }
    });
  }

  /**
   * Get supported languages
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static getLanguages(req, res) {
    const languages = FrequencyAnalysis.getSupportedLanguages();
    const languageData = {};
    
    languages.forEach(lang => {
      languageData[lang] = {
        name: lang.charAt(0).toUpperCase() + lang.slice(1),
        frequencies: FrequencyAnalysis.getLanguageFrequencies(lang)
      };
    });
    
    res.json({
      success: true,
      data: {
        supportedLanguages: languages,
        languageData: languageData
      }
    });
  }
}
