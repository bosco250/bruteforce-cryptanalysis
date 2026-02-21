import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Network error';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export const bruteForceAPI = {
  /**
   * Analyze ciphertext using brute force
   * @param {string} ciphertext - The encrypted text to analyze
   * @param {string} language - Target language ('auto', 'english', 'kinyarwanda', 'french')
   * @returns {Promise} API response with analysis results
   */
  analyze: async (ciphertext, language = 'auto') => {
    try {
      const response = await api.post('/brute', { ciphertext, language });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to analyze ciphertext' };
    }
  },

  /**
   * Get supported languages
   * @returns {Promise} List of supported languages
   */
  getLanguages: async () => {
    try {
      const response = await api.get('/languages');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch languages' };
    }
  },

  /**
   * Health check endpoint
   * @returns {Promise} Server health status
   */
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
