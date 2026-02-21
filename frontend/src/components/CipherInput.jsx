import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CipherInput({ onAnalyze, loading }) {
  const [ciphertext, setCiphertext] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const text = e.target.value;
    setCiphertext(text);
    setCharCount(text.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ciphertext.trim()) {
      onAnalyze(ciphertext, 'auto');
    }
  };

  const handleClear = () => {
    setCiphertext('');
    setCharCount(0);
  };

  return (
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
            📝
          </div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Encrypted Message
          </h2>
        </div>
        <span className={`text-xs font-medium ${charCount > 10000 ? 'text-red-500' : ''}`} 
          style={{ color: charCount > 10000 ? 'var(--error)' : 'var(--text-secondary)' }}
        >
          {charCount.toLocaleString()} / 10,000
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={ciphertext}
            onChange={handleChange}
            placeholder="Paste your encrypted message here..."
            className="input-field h-32 resize-none scrollbar-thin font-mono text-sm"
            disabled={loading}
            maxLength={10000}
          />
          {ciphertext && !loading && (
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
        
        <button
          type="submit"
          disabled={loading || !ciphertext.trim() || charCount > 10000}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Decode Message</span>
            </>
          )}
        </button>
      </form>
      
      <div className="info-box mt-4">
        <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          The system automatically detects the language and finds the best decryption key using frequency analysis.
        </p>
      </div>
    </motion.div>
  );
}
