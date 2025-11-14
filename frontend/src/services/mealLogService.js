import api from './api';

/**
 * Exclusive Meal Logging Service
 * Track your nutrition journey with comprehensive meal logging
 */
export const mealLogService = {
  /**
   * Create a new meal log entry
   * @param {Object} mealLogData - Meal log data
   * @param {string} mealLogData.mealType - Breakfast, Lunch, Dinner, Snack, Supper
   * @param {Date|string} mealLogData.date - Date of the meal
   * @param {Array} mealLogData.foodEntries - Array of food entries with foodItem and quantity
   * @param {string} mealLogData.notes - Optional notes
   * @returns {Promise} API response
   */
  createMealLog: async (mealLogData) => {
    const response = await api.post('/logs', mealLogData);
    return response.data;
  },

  /**
   * Get all meal logs for the user
   * @param {Object} filters - Optional filters
   * @param {string} filters.from - Start date (ISO string)
   * @param {string} filters.to - End date (ISO string)
   * @returns {Promise} API response with meal logs
   */
  getMealLogs: async (filters = {}) => {
    const response = await api.get('/logs', { params: filters });
    return response.data;
  },

  /**
   * Get a single meal log by ID
   * @param {string} logId - Meal log ID
   * @returns {Promise} API response with meal log
   */
  getMealLog: async (logId) => {
    const response = await api.get(`/logs/${logId}`);
    return response.data;
  },

  /**
   * Update a meal log entry
   * @param {string} logId - Meal log ID
   * @param {Object} mealLogData - Updated meal log data
   * @returns {Promise} API response
   */
  updateMealLog: async (logId, mealLogData) => {
    const response = await api.put(`/logs/${logId}`, mealLogData);
    return response.data;
  },

  /**
   * Delete a meal log entry
   * @param {string} logId - Meal log ID
   * @returns {Promise} API response
   */
  deleteMealLog: async (logId) => {
    const response = await api.delete(`/logs/${logId}`);
    return response.data;
  },

  /**
   * Get daily nutrition summary
   * @param {Date|string} date - Optional date (defaults to today)
   * @returns {Promise} API response with daily summary
   */
  getDailySummary: async (date) => {
    const params = date ? { date: date.toISOString() } : {};
    const response = await api.get('/logs/daily-summary', { params });
    return response.data;
  }
};

