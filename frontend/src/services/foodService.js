import api from './api';

/**
 * Enhanced Food Service
 * Get detailed food information and integrate with meal logging
 */
export const foodService = {
  /**
   * Search foods
   * @param {string} searchTerm - Search query
   * @param {number} limit - Maximum results (default: 20)
   * @returns {Promise} API response with foods
   */
  searchFoods: async (searchTerm, limit = 20) => {
    const response = await api.get('/foods', {
      params: { search: searchTerm, limit }
    });
    return response.data;
  },

  /**
   * Get a single food by ID
   * @param {string} foodId - Food ID
   * @returns {Promise} API response with food details
   */
  getFoodById: async (foodId) => {
    const response = await api.get(`/foods/${foodId}`);
    return response.data;
  }
};

