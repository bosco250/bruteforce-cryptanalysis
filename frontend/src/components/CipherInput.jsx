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
      onAnalyze(ciphertext, 'auto'); // Always use auto-detect
    }
  };

  const handleClear = () => {
    setCiphertext('');
    setCharCount(0);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="card p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <span>✍️</span>
          Paste Your Secret Message
        </h2>
        <span className={`text-sm ${charCount > 10000 ? 'text-error' : ''}`} style={{ color: charCount > 10000 ? '#ef4444' : 'var(--text-secondary)' }}>
          {charCount.toLocaleString()} characters
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={ciphertext}
            onChange={handleChange}
            placeholder="Type or paste your encrypted message here... We'll help you decode it! 😊"
            className="input-field h-40 resize-none scrollbar-thin font-mono text-sm"
            disabled={loading}
            maxLength={10000}
          />
          {ciphertext && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.target.style.color = '#ef4444'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              title="Clear text"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || !ciphertext.trim() || charCount > 10000}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Decoding your message...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Decode Message</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 p-4 rounded-lg bg-primary-light/50 border border-gray-700">
        <p className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
          <span className="text-lg" style={{ color: 'var(--accent)' }}>💡</span>
          <span>
            <strong style={{ color: 'var(--accent)' }}>Tip:</strong> Paste your encrypted message above and click decode. 
            The system will automatically detect the language and find the best decryption key.
          </span>
        </p>
      </div>
    </motion.div>
  );
}
