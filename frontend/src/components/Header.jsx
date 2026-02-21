import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Header({ activeTab, onTabChange }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-md border-b sticky top-0 z-50"
      style={{
        background: theme === 'dark' 
          ? 'rgba(30, 41, 59, 0.5)' 
          : 'rgba(255, 255, 255, 0.8)',
        borderColor: theme === 'dark'
          ? 'rgba(34, 211, 238, 0.2)'
          : 'rgba(8, 145, 178, 0.2)'
      }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient flex items-center gap-3">
              <span className="text-4xl md:text-5xl">🔓</span>
              Cipher Tool
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
              Encode and decode messages with smart analysis
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg transition-all hover:scale-110 flex items-center justify-center"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(30, 41, 59, 0.8)' 
                  : 'rgba(241, 245, 249, 0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(8, 145, 178, 0.3)'}`
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--accent)' }}>
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--accent)' }}>
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 rounded-lg" style={{
              background: theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.5)' 
                : 'rgba(241, 245, 249, 0.8)',
              border: `1px solid ${theme === 'dark' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(8, 145, 178, 0.2)'}`
            }}>
              <button
                onClick={() => onTabChange('decoder')}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  activeTab === 'decoder'
                    ? 'btn-primary'
                    : ''
                }`}
                style={activeTab !== 'decoder' ? {
                  color: 'var(--text-secondary)'
                } : {}}
              >
                🔍 Decoder
              </button>
              <button
                onClick={() => onTabChange('encoder')}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  activeTab === 'encoder'
                    ? 'btn-primary'
                    : ''
                }`}
                style={activeTab !== 'encoder' ? {
                  color: 'var(--text-secondary)'
                } : {}}
              >
                🔒 Encoder
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
