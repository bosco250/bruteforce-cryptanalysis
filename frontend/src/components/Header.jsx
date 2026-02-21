import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Header({ activeTab, onTabChange }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: theme === 'dark' 
          ? 'rgba(10, 14, 39, 0.95)' 
          : 'rgba(248, 250, 252, 0.95)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xl sm:text-2xl"
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--highlight) 100%)',
              }}
            >
              🔐
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-gradient">CipherPro</h1>
              <p className="text-[10px] sm:text-xs hidden xs:block" style={{ color: 'var(--text-secondary)' }}>
                Smart Cryptanalysis
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tab Switcher - Desktop */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-lg"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)'
              }}
            >
              <button
                onClick={() => onTabChange('decoder')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'decoder' ? 'shadow-md' : ''
                }`}
                style={activeTab === 'decoder' ? {
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--highlight) 100%)',
                  color: 'white'
                } : {
                  color: 'var(--text-secondary)'
                }}
              >
                Decoder
              </button>
              <button
                onClick={() => onTabChange('encoder')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'encoder' ? 'shadow-md' : ''
                }`}
                style={activeTab === 'encoder' ? {
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--highlight) 100%)',
                  color: 'white'
                } : {
                  color: 'var(--text-secondary)'
                }}
              >
                Encoder
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--accent)'
              }}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden pb-2 flex gap-2">
          <button
            onClick={() => onTabChange('decoder')}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'decoder' ? 'shadow-md' : ''
            }`}
            style={activeTab === 'decoder' ? {
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--highlight) 100%)',
              color: 'white'
            } : {
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}
          >
            🔍 Decoder
          </button>
          <button
            onClick={() => onTabChange('encoder')}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'encoder' ? 'shadow-md' : ''
            }`}
            style={activeTab === 'encoder' ? {
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--highlight) 100%)',
              color: 'white'
            } : {
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}
          >
            🔒 Encoder
          </button>
        </div>
      </div>
    </motion.header>
  );
}
