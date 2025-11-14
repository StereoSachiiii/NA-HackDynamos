import api from './api';
import { setTokens } from '../utils/token';

/**
 * Exclusive Password Reset Service
 * Secure password recovery with token-based reset
 */
export const passwordService = {
  /**
   * Request password reset (sends reset token to email)
   * @param {string} email - User email
   * @returns {Promise} API response
   */
  requestReset: async (email) => {
    const response = await api.post('/users/password/forgot', { email });
    return response.data;
  },

  /**
   * Reset password using token
   * @param {string} token - Reset token from email
   * @param {string} password - New password
   * @returns {Promise} API response with new tokens
   */
  resetPassword: async (token, password) => {
    const response = await api.post('/users/password/reset', { token, password });
    
    // If successful, tokens are returned - store them
    if (response.data.tokens) {
      setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }
    
    return response.data;
  }
};

