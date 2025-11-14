import api from './api';
import { setTokens, clearTokens } from '../utils/token';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data.tokens) {
      setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.tokens) {
      setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.post('/users/logout', { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearTokens();
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  },
};

