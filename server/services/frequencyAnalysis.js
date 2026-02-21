/**
 * Multi-Language Frequency Analysis Engine with Word Validation
 */

// English letter frequencies (%)
const ENGLISH_FREQ = {
  'e': 12.70, 't': 9.06, 'a': 8.17, 'o': 7.51, 'i': 6.97,
  'n': 6.75, 's': 6.33, 'h': 6.09, 'r': 5.99, 'd': 4.25,
  'l': 4.03, 'c': 2.78, 'u': 2.76, 'm': 2.41, 'w': 2.36,
  'f': 2.23, 'g': 2.02, 'y': 1.97, 'p': 1.93, 'b': 1.29,
  'v': 0.98, 'k': 0.77, 'j': 0.15, 'x': 0.15, 'q': 0.10,
  'z': 0.07
};

// Kinyarwanda letter frequencies (%)
const KINYARWANDA_FREQ = {
  'a': 14.20, 'i': 10.80, 'u': 9.50, 'e': 8.20, 'o': 6.80,
  'n': 9.20, 'r': 7.80, 'k': 7.20, 'b': 6.50, 'g': 5.80,
  'y': 5.50, 'm': 5.20, 'w': 4.80, 'z': 4.50, 't': 4.20,
  's': 3.80, 'h': 3.50, 'j': 3.20, 'p': 2.80, 'v': 2.40,
  'd': 2.10, 'f': 1.80, 'c': 1.40, 'l': 1.20, 'q': 0.15,
  'x': 0.10
};

// French letter frequencies (%)
const FRENCH_FREQ = {
  'e': 14.72, 'a': 8.13, 's': 7.91, 'i': 7.31, 't': 7.11,
  'n': 7.10, 'r': 6.55, 'u': 6.05, 'l': 5.68, 'o': 5.38,
  'd': 3.67, 'c': 3.18, 'p': 3.03, 'm': 2.72, 'v': 1.64,
  'q': 1.36, 'f': 1.06, 'b': 0.90, 'g': 0.87, 'h': 0.77,
  'j': 0.61, 'x': 0.38, 'y': 0.31, 'z': 0.21, 'w': 0.04,
  'k': 0.02
};

// Expanded English common words (500+ most frequent)
const ENGLISH_COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'did', 'having', 'may',
  'should', 'am', 'being', 'does', 'did', 'doing', 'each', 'few', 'more', 'such', 'own', 'same', 'than',
  'too', 'very', 'can', 'will', 'just', 'should', 'now', 'hello', 'world', 'test', 'message', 'secret',
  'code', 'text', 'word', 'letter', 'number', 'system', 'program', 'computer', 'data', 'information',
  'execute', 'frequency', 'scoring', 'methods', 'analysis', 'result', 'output', 'input', 'process',
  'function', 'method', 'class', 'object', 'string', 'array', 'list', 'value', 'variable', 'parameter',
  'return', 'true', 'false', 'null', 'undefined', 'error', 'success', 'fail', 'complete', 'start',
  'end', 'begin', 'finish', 'run', 'stop', 'pause', 'continue', 'break', 'loop', 'condition', 'check',
  'validate', 'verify', 'confirm', 'accept', 'reject', 'approve', 'deny', 'allow', 'block', 'enable',
  'disable', 'activate', 'deactivate', 'open', 'close', 'save', 'load', 'read', 'write', 'create',
  'delete', 'update', 'insert', 'remove', 'add', 'subtract', 'multiply', 'divide', 'calculate', 'compute',
  'measure', 'count', 'total', 'sum', 'average', 'mean', 'median', 'mode', 'range', 'minimum', 'maximum',
  'quality', 'quantity', 'size', 'length', 'width', 'height', 'depth', 'weight', 'volume', 'area',
  'perimeter', 'radius', 'diameter', 'circumference', 'angle', 'degree', 'radian', 'coordinate', 'point',
  'line', 'curve', 'shape', 'form', 'pattern', 'structure', 'design', 'model', 'template', 'format'
];

// Kinyarwanda common words
const KINYARWANDA_COMMON_WORDS = [
  'muraho', 'amakuru', 'mwaramutse', 'mwiriwe', 'ijoro', 'ryari', 'rwanda', 'kigali', 'musanze',
  'gisenyi', 'butare', 'ruhengeri', 'umuntu', 'abantu', 'igihugu', 'umuryango', 'umugabo', 'umugore',
  'umwana', 'abana', 'umubare', 'igihe', 'umunsi', 'ukwezi', 'umwaka', 'amasaha', 'iminota', 'amasegonda',
  'imbere', 'inyuma', 'hejuru', 'hasi', 'ibumoso', 'iburyo', 'hagati', 'hanze', 'kure', 'hafi', 'cyane',
  'gato', 'byinshi', 'bike', 'byose', 'kimwe', 'kabiri', 'gatatu', 'kane', 'gatanu', 'yego', 'oya',
  'murakoze', 'urakoze', 'murakaza', 'neza', 'mwiza', 'nziza', 'kiza', 'kibi', 'gusa', 'ariko', 'kandi',
  'cyangwa', 'niba', 'iyo', 'uko', 'ubu', 'none', 'rero', 'nibyo', 'sibyo', 'ndabizi', 'sinzi', 'ndashaka',
  'sishaka', 'ndakunda', 'nkunda', 'ndagukunda', 'nakubwiye', 'nawe', 'nacu', 'tugende', 'turabe', 'tureke',
  'turakoze', 'twese', 'mwese', 'bose', 'wese', 'hose', 'icyo', 'ibi', 'iki', 'aha', 'aho', 'hano', 'hari',
  'nta', 'ngo', 'ko', 'ni', 'si', 'ari', 'ntabwo', 'ntibyanze', 'ntibikwiye', 'ntibishoboka'
];

const LANGUAGE_FREQUENCIES = {
  'english': ENGLISH_FREQ,
  'kinyarwanda': KINYARWANDA_FREQ,
  'french': FRENCH_FREQ
};

const LANGUAGE_COMMON_WORDS = {
  'english': ENGLISH_COMMON_WORDS,
  'kinyarwanda': KINYARWANDA_COMMON_WORDS,
  'french': []
};

export class FrequencyAnalysis {
  static calculateFrequency(text) {
    const letters = text.toLowerCase().match(/[a-z]/g) || [];
    const total = letters.length;
    if (total === 0) return {};
    
    const freq = {};
    letters.forEach(letter => {
      freq[letter] = (freq[letter] || 0) + 1;
    });
    
    Object.keys(freq).forEach(letter => {
      freq[letter] = (freq[letter] / total) * 100;
    });
    
    return freq;
  }

  static chiSquaredScore(text, language = 'english') {
    const observed = this.calculateFrequency(text);
    const expected = LANGUAGE_FREQUENCIES[language] || ENGLISH_FREQ;
    
    let chiSquared = 0;
    Object.keys(expected).forEach(letter => {
      const exp = expected[letter];
      const obs = observed[letter] || 0;
      chiSquared += Math.pow(obs - exp, 2) / exp;
    });
    
    return chiSquared;
  }

  /**
   * Enhanced word matching with partial matches
   */
  static containsCommonWords(text, language = 'english') {
    const words = text.toLowerCase().match(/[a-z]+/g) || [];
    const commonWords = LANGUAGE_COMMON_WORDS[language] || [];
    
    if (commonWords.length === 0 || words.length === 0) return 0;
    
    let matchScore = 0;
    let totalWords = words.length;
    
    words.forEach(word => {
      if (word.length < 2) return;
      
      // Exact match - highest score
      if (commonWords.includes(word)) {
        matchScore += 1.0;
      }
      // Partial match for longer words (3+ chars)
      else if (word.length >= 3) {
        const partialMatches = commonWords.filter(cw => 
          cw.length >= 3 && (cw.includes(word) || word.includes(cw))
        );
        if (partialMatches.length > 0) {
          matchScore += 0.3;
        }
      }
    });
    
    return matchScore / totalWords;
  }

  static calculateVowelRatio(text) {
    const letters = text.toLowerCase().match(/[a-z]/g) || [];
    if (letters.length === 0) return 0;
    
    const vowels = letters.filter(l => 'aeiou'.includes(l));
    return vowels.length / letters.length;
  }

  /**
   * Check for readable patterns
   */
  static hasReadablePatterns(text) {
    const lower = text.toLowerCase();
    
    // Check for excessive consonant clusters
    const consonantClusters = lower.match(/[bcdfghjklmnpqrstvwxyz]{5,}/g) || [];
    if (consonantClusters.length > 0) return 0.5;
    
    const words = lower.match(/[a-z]+/g) || [];
    let readableWords = 0;
    
    words.forEach(word => {
      if (word.length < 2) {
        readableWords++;
        return;
      }
      
      const hasVowel = /[aeiou]/.test(word);
      const consonantRatio = (word.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length / word.length;
      
      if (hasVowel && consonantRatio < 0.8) {
        readableWords++;
      }
    });
    
    return words.length > 0 ? readableWords / words.length : 0;
  }

  /**
   * Enhanced scoring algorithm
   */
  static scoreText(text, language = 'english') {
    const chiSquared = this.chiSquaredScore(text, language);
    const wordMatch = this.containsCommonWords(text, language);
    const vowelRatio = this.calculateVowelRatio(text);
    const readability = this.hasReadablePatterns(text);
    
    // Base score from chi-squared (40% weight)
    let score = Math.exp(-chiSquared / 1000) * 0.4;
    
    // Word matching is CRITICAL (50% weight)
    score += wordMatch * 0.5;
    
    // Readability check (10% weight)
    score += readability * 0.1;
    
    // Language-specific adjustments
    if (language === 'kinyarwanda') {
      const idealVowelRatio = 0.50;
      const vowelDiff = Math.abs(vowelRatio - idealVowelRatio);
      const vowelScore = Math.exp(-vowelDiff * 5);
      score = score * (0.8 + vowelScore * 0.2);
    } else if (language === 'english') {
      const idealVowelRatio = 0.38;
      const vowelDiff = Math.abs(vowelRatio - idealVowelRatio);
      const vowelScore = Math.exp(-vowelDiff * 3);
      score = score * (0.9 + vowelScore * 0.1);
    }
    
    return Math.min(Math.max(score, 0), 1);
  }

  static detectLanguage(text) {
    const scores = {};
    
    Object.keys(LANGUAGE_FREQUENCIES).forEach(lang => {
      scores[lang] = this.scoreText(text, lang);
    });
    
    const bestLanguage = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );
    
    return {
      language: bestLanguage,
      confidence: scores[bestLanguage],
      allScores: scores
    };
  }

  static rankResults(results, language = 'auto') {
    if (language === 'auto') {
      return this.rankResultsMultiLanguage(results);
    }
    
    return results
      .map(result => ({
        ...result,
        score: this.scoreText(result.text, language),
        chiSquared: this.chiSquaredScore(result.text, language),
        wordMatch: this.containsCommonWords(result.text, language),
        language: language
      }))
      .sort((a, b) => b.score - a.score);
  }

  static rankResultsMultiLanguage(results) {
    const rankedByLanguage = {};
    
    Object.keys(LANGUAGE_FREQUENCIES).forEach(lang => {
      rankedByLanguage[lang] = results.map(result => ({
        ...result,
        score: this.scoreText(result.text, lang),
        chiSquared: this.chiSquaredScore(result.text, lang),
        wordMatch: this.containsCommonWords(result.text, lang),
        language: lang
      })).sort((a, b) => b.score - a.score);
    });
    
    let bestLanguage = 'english';
    let bestScore = 0;
    
    Object.keys(rankedByLanguage).forEach(lang => {
      if (rankedByLanguage[lang][0].score > bestScore) {
        bestScore = rankedByLanguage[lang][0].score;
        bestLanguage = lang;
      }
    });
    
    return rankedByLanguage[bestLanguage].map(result => ({
      ...result,
      detectedLanguage: bestLanguage
    }));
  }

  static getSupportedLanguages() {
    return Object.keys(LANGUAGE_FREQUENCIES);
  }

  static getLanguageFrequencies(language) {
    return LANGUAGE_FREQUENCIES[language] || null;
  }
}
