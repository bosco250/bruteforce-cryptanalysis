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
  const [showTeamModal, setShowTeamModal] = useState(false);

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
      
      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'decoder' ? (
            <motion.div
              key="decoder"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
                <CipherInput onAnalyze={handleAnalyze} loading={loading} />
                
                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg text-xs sm:text-sm"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: 'var(--error)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: 'var(--error)' }}>{error}</p>
                      </div>
                      <button
                        onClick={() => setError(null)}
                        className="text-xs sm:text-sm transition-colors"
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
                    className="card p-8 sm:p-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                      />
                      <p className="text-sm sm:text-base font-medium" style={{ color: 'var(--accent)' }}>Analyzing...</p>
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
                        className="card p-3 sm:p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 sm:gap-6">
                            <div>
                              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Time</p>
                              <p className="text-sm sm:text-base font-bold" style={{ color: 'var(--accent)' }}>{analysisTime}s</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Options</p>
                              <p className="text-sm sm:text-base font-bold" style={{ color: 'var(--accent)' }}>{results.length}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Best</p>
                              <p className="text-sm sm:text-base font-bold" style={{ color: 'var(--success)' }}>
                                {(results[0].score * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleExportJSON}
                            className="btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
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
      <footer className="border-t py-3 sm:py-4 mt-auto" style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)'
      }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <p style={{ color: 'var(--text-secondary)' }}>
              Developed by{' '}
              <button
                onClick={() => setShowTeamModal(true)}
                className="font-semibold hover:underline transition-all"
                style={{ color: 'var(--accent)' }}
              >
                Group 6
              </button>
            </p>
            <div className="flex items-center gap-1 sm:gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span className="hidden xs:inline">Level 4 CS</span>
              <span className="xs:hidden">L4 CS</span>
              <span>•</span>
              <span className="hidden xs:inline">University of Rwanda</span>
              <span className="xs:hidden">UR</span>
              <span>•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Team Modal */}
      <AnimatePresence>
        {showTeamModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setShowTeamModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Group 6 Team Members
                  </h2>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Level 4 Computer Science - University of Rwanda
                  </p>
                </div>
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="text-2xl sm:text-3xl leading-none transition-colors hover:opacity-70"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ×
                </button>
              </div>

              {/* Team Members List */}
              <div className="p-4 sm:p-6 space-y-3">
                {[
                  { name: 'Rushimisha Dieudonne', regNumber: '222013223' },
                  { name: 'Dusengimana Jean Bosco', regNumber: '222004798' },
                  { name: 'Usanase Emeline', regNumber: '222008798' },
                  { name: 'Muneza Joseph', regNumber: '222006232' },
                  { name: 'Ndizeye Beza Yvan', regNumber: '222002355' },
                  { name: 'Uwababyeyi Mbabazi Aline', regNumber: '222009293' }
                ].map((member, index) => (
                  <motion.div
                    key={member.regNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold"
                        style={{
                          background: 'var(--accent)',
                          color: 'white'
                        }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                          {member.name}
                        </p>
                        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Reg: {member.regNumber}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--success-bg)' }}
                    >
                      <svg
                        className="w-4 h-4"
                        style={{ color: 'var(--success)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
