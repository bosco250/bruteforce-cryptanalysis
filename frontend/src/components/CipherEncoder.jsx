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
      setError('Shift key must be between 1 and 25');
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
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Input Card */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}
            >
              ✍️
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Your Message
            </h2>
          </div>
          <span className={`text-xs font-medium ${charCount > 10000 ? 'text-red-500' : ''}`} 
            style={{ color: charCount > 10000 ? 'var(--error)' : 'var(--text-secondary)' }}
          >
            {charCount.toLocaleString()} / 10,000
          </span>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={plaintext}
              onChange={handleChange}
              placeholder="Type your message here..."
              className="input-field h-32 resize-none scrollbar-thin font-mono text-sm"
              maxLength={10000}
            />
            {plaintext && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center transition-all hover:scale-110"
                style={{ 
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Shift Key (1-25)
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={shift}
                onChange={handleShiftChange}
                placeholder="Enter key"
                className="input-field text-center font-bold"
                style={{ color: 'var(--accent)' }}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleEncode}
                className="btn-primary px-8"
              >
                Encode
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg"
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--error)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium" style={{ color: 'var(--error)' }}>
                {error}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Output Card */}
      {encrypted && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}
              >
                🔒
              </div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Encrypted Result
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="btn-secondary text-xs px-3 py-1.5"
                title="Copy"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary text-xs px-3 py-1.5"
                title="Download"
              >
                💾 Save
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg font-mono text-sm break-words"
            style={{ 
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            {encrypted}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="stat-card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Shift Key</p>
              <p className="text-xl font-bold mt-1" style={{ color: 'var(--accent)' }}>{shift}</p>
            </div>
            <div className="stat-card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Characters</p>
              <p className="text-xl font-bold mt-1" style={{ color: 'var(--highlight)' }}>{encrypted.length}</p>
            </div>
            <div className="stat-card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Status</p>
              <p className="text-xl mt-1">✓</p>
            </div>
          </div>

          <div className="info-box mt-4">
            <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Remember your shift key ({shift}) to decrypt this message later.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
