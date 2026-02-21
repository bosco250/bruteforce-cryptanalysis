import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard, formatScore, truncateText, downloadAsFile } from '../utils/formatText';

export default function ResultTable({ results }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleCopy = async (text, index) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleDownload = (text, shift) => {
    downloadAsFile(text, `decoded-shift-${shift}.txt`);
  };

  const displayResults = showAll ? results : results.slice(0, 8);

  const getConfidenceBadge = (score) => {
    if (score > 0.7) return { class: 'badge-success', label: 'High' };
    if (score > 0.4) return { class: 'badge-warning', label: 'Medium' };
    return { class: 'badge-info', label: 'Low' };
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="card p-3 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-lg sm:text-xl"
            style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}
          >
            🎯
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Results
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {results.length} found
            </p>
          </div>
        </div>
      </div>

      {/* Best Match Card */}
      {results[0] && (
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-3 sm:p-4 rounded-lg mb-3 sm:mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}
        >
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
            <span className="badge badge-success text-xs sm:text-sm">Best</span>
            <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--success)' }}>
              {formatScore(results[0].score)}%
            </span>
          </div>
          <p className="font-mono text-sm sm:text-base break-words mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
            {results[0].text}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Shift: {results[0].shift}</span>
              <span>•</span>
              <span className="hidden xs:inline">{results[0].detectedLanguage || 'Auto'}</span>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => handleCopy(results[0].text, -1)}
                className="btn-secondary text-xs sm:text-sm px-2 py-1 sm:px-3"
              >
                {copiedIndex === -1 ? '✓' : '📋'}
              </button>
              <button
                onClick={() => handleDownload(results[0].text, results[0].shift)}
                className="btn-secondary text-xs sm:text-sm px-2 py-1 sm:px-3"
              >
                💾
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Other Results */}
      <div className="space-y-2">
        <AnimatePresence>
          {displayResults.slice(1).map((result, index) => {
            const actualIndex = index + 1;
            const badge = getConfidenceBadge(result.score);
            
            return (
              <motion.div
                key={result.shift}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.02 }}
                className="p-2 sm:p-3 rounded-lg transition-all hover:scale-[1.01]"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-bold w-6 sm:w-7 text-center flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                    #{actualIndex + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs sm:text-sm break-words mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>
                      {truncateText(result.text, 80)}
                    </p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className={`badge ${badge.class} text-xs px-2 py-0.5`}>{badge.label}</span>
                        <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {formatScore(result.score)}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopy(result.text, actualIndex)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-all hover:scale-110 text-sm"
                          style={{ 
                            background: 'var(--bg-card)',
                            color: 'var(--accent)'
                          }}
                          title="Copy"
                        >
                          {copiedIndex === actualIndex ? '✓' : '📋'}
                        </button>
                        <button
                          onClick={() => handleDownload(result.text, result.shift)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-all hover:scale-110 text-sm"
                          style={{ 
                            background: 'var(--bg-card)',
                            color: 'var(--accent)'
                          }}
                          title="Download"
                        >
                          💾
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show More Button */}
      {results.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="btn-secondary w-full mt-3 sm:mt-4 text-sm sm:text-base py-2"
        >
          {showAll ? '▲ Show Less' : `▼ Show All ${results.length}`}
        </button>
      )}
    </motion.div>
  );
}
