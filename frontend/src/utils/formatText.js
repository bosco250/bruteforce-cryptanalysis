/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      console.error('Failed to copy:', fallbackErr);
      return false;
    }
  }
};

/**
 * Format score as percentage
 * @param {number} score - Score value (0-1)
 * @returns {string} Formatted percentage
 */
export const formatScore = (score) => {
  return (score * 100).toFixed(2);
};

/**
 * Format chi-squared value
 * @param {number} chiSquared - Chi-squared value
 * @returns {string} Formatted value
 */
export const formatChiSquared = (chiSquared) => {
  return chiSquared.toFixed(2);
};

/**
 * Download text as file
 * @param {string} text - Text content
 * @param {string} filename - File name
 */
export const downloadAsFile = (text, filename = 'decrypted.txt') => {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export results as JSON
 * @param {Array} results - Analysis results
 * @param {string} filename - File name
 */
export const exportAsJSON = (results, filename = 'analysis-results.json') => {
  const json = JSON.stringify(results, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
