import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import CipherInput from '../components/CipherInput';
import CipherEncoder from '../components/CipherEncoder';
import ResultTable from '../components/ResultTable';
import FrequencyChart from '../components/FrequencyChart';
import { bruteForceAPI } from '../services/api';
import { exportAsJSON } from '../utils/formatText';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('decoder');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisTime, setAnalysisTime] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Reset state when switching tabs
  useEffect(() => {
    setResults(null);
    setError(null);
    setLoading(false);
  }, [activeTab]);

  const checkBackendHealth = async () => {
    try {
      await bruteForceAPI.healthCheck();
    } catch (err) {
      console.warn('Backend health check failed:', err);
    }
  };

  const handleAnalyze = async (ciphertext, language = 'auto') => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    const startTime = performance.now();
    
    try {
      const response = await bruteForceAPI.analyze(ciphertext, language);
      
      if (response.success) {
        const endTime = performance.now();
        setAnalysisTime(((endTime - startTime) / 1000).toFixed(2));
        setResults(response.data.results);
      } else {
        setError(response.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.error || 'Unable to connect to the server. Please make sure it\'s running.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    if (results) {
      exportAsJSON(results, `decoded-messages-${Date.now()}.json`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'decoder' ? (
            <motion.div
              key="decoder"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-6xl mx-auto space-y-4">
                {/* Input Section */}
                <CipherInput onAnalyze={handleAnalyze} loading={loading} />
                
                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-error/10 border border-error/30 rounded-lg p-3 flex items-start gap-2"
                    >
                      <span className="text-lg">😕</span>
                      <div className="flex-1">
                        <p className="text-error font-semibold text-sm">{error}</p>
                      </div>
                      <button
                        onClick={() => setError(null)}
                        className="text-gray-400 hover:text-error transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading State */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card p-8 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                      <p className="text-accent font-semibold">Decoding...</p>
                    </div>
                  </motion.div>
                )}

                {/* Confidence Scores */}
                <AnimatePresence>
                  {results && !loading && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap items-center justify-between gap-3 bg-secondary/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-gray-400 text-xs">Time</p>
                          <p className="text-accent font-semibold text-sm">{analysisTime}s</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Options</p>
                          <p className="text-accent font-semibold text-sm">{results.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Best Match</p>
                          <p className="text-success font-semibold text-sm">
                            {(results[0].score * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleExportJSON}
                        className="btn-secondary text-xs py-2 px-3"
                      >
                        <span className="flex items-center gap-1">
                          <span>💾</span>
                          <span>Save</span>
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results Table */}
                <AnimatePresence>
                  {results && !loading && (
                    <ResultTable results={results} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="encoder"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CipherEncoder />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 mt-12" style={{
        background: theme === 'dark' 
          ? 'rgba(30, 41, 59, 0.3)' 
          : 'rgba(255, 255, 255, 0.8)',
        borderColor: theme === 'dark'
          ? 'rgba(34, 211, 238, 0.1)'
          : 'rgba(8, 145, 178, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p style={{ color: 'var(--text-primary)' }}>
              Powered by <span style={{ color: 'var(--accent)', fontWeight: '600' }}>Bosco Dev</span>
            </p>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4" style={{ color: 'var(--text-secondary)' }}>
              <span>Level 4 Computer Science</span>
              <span className="hidden md:inline">•</span>
              <span>University of Rwanda</span>
              <span className="hidden md:inline">•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
