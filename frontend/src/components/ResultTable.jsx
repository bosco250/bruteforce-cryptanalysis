import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard, formatScore, truncateText, downloadAsFile } from '../utils/formatText';

export default function ResultTable({ results }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleDownload = (text, shift) => {
    downloadAsFile(text, `decoded-message-${shift}.txt`);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const displayResults = showAll ? results : results.slice(0, 5);

  const getScoreColor = (score) => {
    if (score > 0.7) return 'text-success';
    if (score > 0.4) return 'text-warning';
    return 'text-gray-400';
  };

  const getScoreGradient = (score) => {
    if (score > 0.7) return 'from-success to-accent';
    if (score > 0.4) return 'from-warning to-accent';
    return 'from-gray-500 to-gray-600';
  };

  const getConfidenceLabel = (score) => {
    if (score > 0.7) return 'Very Likely';
    if (score > 0.4) return 'Possible';
    return 'Unlikely';
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card p-6 md:p-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-accent flex items-center gap-2">
            <span>🎯</span>
            Your Decoded Messages
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Found {results.length} possible messages • Sorted by confidence
          </p>
        </div>
      </div>

      {/* Best Match Highlight */}
      {results[0] && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-highlight/20 to-accent/20 border border-highlight/40 rounded-lg p-5 mb-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-highlight font-semibold mb-2 flex items-center gap-2">
                <span className="text-xl">✨</span>
                Most Likely Message
              </p>
              <p className="text-gray-100 font-mono text-sm md:text-base break-words leading-relaxed">
                {results[0].text}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className={`text-sm font-semibold ${getScoreColor(results[0].score)}`}>
                  {getConfidenceLabel(results[0].score)} ({formatScore(results[0].score)}% match)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(results[0].text, -1)}
                className="text-accent hover:text-highlight transition-colors p-2"
                title="Copy to clipboard"
              >
                {copiedIndex === -1 ? '✅' : '📋'}
              </button>
              <button
                onClick={() => handleDownload(results[0].text, results[0].shift)}
                className="text-accent hover:text-highlight transition-colors p-2"
                title="Download as file"
              >
                💾
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alternative Results */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Other Possibilities</h3>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent/20">
              <th className="table-header">#</th>
              <th className="table-header">Decoded Text</th>
              <th className="table-header">Match</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {displayResults.map((result, index) => (
                <motion.tr
                  key={result.shift}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className="table-row"
                >
                  <td className="py-3 px-4">
                    <span className={`font-bold ${index === 0 ? 'text-highlight' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-gray-200 font-mono text-xs md:text-sm break-words">
                        {expandedIndex === index ? result.text : truncateText(result.text, 80)}
                      </p>
                      {result.text.length > 80 && (
                        <button
                          onClick={() => toggleExpand(index)}
                          className="text-accent hover:text-highlight text-xs mt-1 transition-colors"
                        >
                          {expandedIndex === index ? '▲ Show less' : '▼ Show more'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 md:w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${getScoreGradient(result.score)} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${result.score * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs md:text-sm font-semibold ${getScoreColor(result.score)}`}>
                          {formatScore(result.score)}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {getConfidenceLabel(result.score)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(result.text, index)}
                        className="text-accent hover:text-highlight transition-colors text-xs md:text-sm p-1"
                        title="Copy"
                      >
                        {copiedIndex === index ? '✅' : '📋'}
                      </button>
                      <button
                        onClick={() => handleDownload(result.text, result.shift)}
                        className="text-accent hover:text-highlight transition-colors text-xs md:text-sm p-1"
                        title="Download"
                      >
                        💾
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Show More/Less Button */}
      {results.length > 5 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAll(!showAll)}
          className="mt-6 w-full btn-secondary"
        >
          {showAll ? (
            <span className="flex items-center justify-center gap-2">
              <span>▲</span>
              <span>Show Top Results Only</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>▼</span>
              <span>See All {results.length} Possibilities</span>
            </span>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
