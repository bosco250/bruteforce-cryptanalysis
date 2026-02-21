import { useState } from 'react';
import { motion } from 'framer-motion';
import { copyToClipboard, downloadAsFile } from '../utils/formatText';

export default function CipherEncoder() {
  const [plaintext, setPlaintext] = useState('');
  const [shift, setShift] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const text = e.target.value;
    setPlaintext(text);
    setCharCount(text.length);
    setError('');
  };

  const handleShiftChange = (e) => {
    const value = e.target.value;
    setShift(value);
    setError('');
  };

  const handleEncode = () => {
    if (!plaintext.trim()) {
      setError('Please enter a message to encrypt');
      return;
    }
    
    if (!shift || shift === '') {
      setError('Please enter a shift key (1-25)');
      return;
    }

    const shiftValue = parseInt(shift);
    if (isNaN(shiftValue) || shiftValue < 1 || shiftValue > 25) {
      setError('Shift key must be a number between 1 and 25');
      return;
    }

    setError('');
    encryptText(plaintext, shiftValue);
  };

  const encryptText = (text, shiftValue) => {
    const result = text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const isUpperCase = char === char.toUpperCase();
          const base = isUpperCase ? 65 : 97;
          const charCode = char.charCodeAt(0) - base;
          const encrypted = (charCode + shiftValue) % 26;
          return String.fromCharCode(encrypted + base);
        }
        return char;
      })
      .join('');
    
    setEncrypted(result);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(encrypted);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadAsFile(encrypted, `encrypted-shift-${shift}.txt`);
  };

  const handleClear = () => {
    setPlaintext('');
    setEncrypted('');
    setCharCount(0);
    setShift('');
    setError('');
  };



  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Input Section */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="card p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-accent flex items-center gap-2">
            <span>✍️</span>
            Enter Your Message
          </h2>
          <span className={`text-sm ${charCount > 10000 ? 'text-error' : 'text-gray-400'}`}>
            {charCount.toLocaleString()} characters
          </span>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={plaintext}
              onChange={handleChange}
              placeholder="Type your message here... We'll encrypt it for you! 😊"
              className="input-field h-40 resize-none scrollbar-thin font-mono text-sm"
              maxLength={10000}
            />
            {plaintext && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 text-gray-500 hover:text-error transition-colors"
                title="Clear text"
              >
                ✕
              </button>
            )}
          </div>

          {/* Key Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <label className="text-gray-400 text-sm font-semibold whitespace-nowrap">
                Shift Key (1-25):
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={shift}
                onChange={handleShiftChange}
                placeholder="Enter key"
                className="flex-1 px-4 py-2 bg-primary-light border border-gray-700 rounded-lg text-accent font-bold focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <button
              type="button"
              onClick={handleEncode}
              className="btn-primary"
            >
              <span className="flex items-center gap-2">
                <span>🔒</span>
                <span>Encode</span>
              </span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-error/10 border border-error/30 rounded-lg p-3 flex items-center gap-2">
              <span className="text-error text-lg">⚠️</span>
              <p className="text-error text-sm font-semibold">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-primary-light/50 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-sm flex items-start gap-2">
            <span className="text-accent text-lg">💡</span>
            <span>
              <strong className="text-accent">How it works:</strong> Each letter in your message 
              is shifted by the amount you choose. For example, with shift 3, 'A' becomes 'D', 
              'B' becomes 'E', and so on. Numbers and symbols stay the same!
            </span>
          </p>
        </div>
      </motion.div>

      {/* Output Section */}
      {encrypted && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="card p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-accent flex items-center gap-2">
              <span>🔒</span>
              Encrypted Message
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="btn-secondary text-sm py-2 px-4"
                title="Copy to clipboard"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary text-sm py-2 px-4"
                title="Download as file"
              >
                💾 Download
              </button>
            </div>
          </div>

          <div className="bg-primary-light/50 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-200 font-mono text-sm md:text-base break-words leading-relaxed">
              {encrypted}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-light/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Shift Used</p>
              <p className="text-2xl font-bold text-accent">{shift}</p>
            </div>
            
            <div className="bg-primary-light/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Original Length</p>
              <p className="text-2xl font-bold text-highlight">{plaintext.length}</p>
            </div>
            
            <div className="bg-primary-light/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Encrypted Length</p>
              <p className="text-2xl font-bold text-success">{encrypted.length}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-highlight/10 border border-highlight/30 rounded-lg">
            <p className="text-highlight text-sm flex items-start gap-2">
              <span className="text-xl">🔑</span>
              <span>
                <strong>Remember your shift value ({shift})!</strong> You'll need it to decrypt 
                this message later. Share it securely with the person you want to read your message.
              </span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!encrypted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <div className="max-w-md mx-auto">
            <p className="text-6xl mb-4">🔐</p>
            <p className="text-gray-300 text-lg mb-2">Ready to Encrypt</p>
            <p className="text-gray-500 text-sm">
              Type your message above and adjust the shift amount. 
              Your encrypted message will appear here instantly!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
