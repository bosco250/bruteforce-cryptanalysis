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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'decoder' ? (
            <motion.div
              key="decoder"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-4xl mx-auto space-y-4">
                <CipherInput onAnalyze={handleAnalyze} loading={loading} />
                
                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 p-4 rounded-lg"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--error)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--error)' }}>{error}</p>
                      </div>
                      <button
                        onClick={() => setError(null)}
                        className="text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
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
                    className="card p-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                      />
                      <p className="font-medium" style={{ color: 'var(--accent)' }}>Analyzing...</p>
                    </div>
                  </motion.div>
                )}

                {/* Results */}
                <AnimatePresence>
                  {results && !loading && (
                    <>
                      {/* Stats Bar */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Time</p>
                              <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{analysisTime}s</p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Options</p>
                              <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{results.length}</p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Best Match</p>
                              <p className="text-sm font-bold" style={{ color: 'var(--success)' }}>
                                {(results[0].score * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleExportJSON}
                            className="btn-secondary text-xs px-4 py-2"
                          >
                            💾 Export
                          </button>
                        </div>
                      </motion.div>

                      {/* Results Table */}
                      <ResultTable results={results} />
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="encoder"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CipherEncoder />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-4 mt-auto" style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <p style={{ color: 'var(--text-secondary)' }}>
              Powered by <span style={{ color: 'var(--accent)', fontWeight: '600' }}>Bosco Dev</span>
            </p>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span>Level 4 CS</span>
              <span>•</span>
              <span>University of Rwanda</span>
              <span>•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
