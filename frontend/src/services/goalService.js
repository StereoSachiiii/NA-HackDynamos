import api from './api';

/**
 * Exclusive Goals Management Service
 * Set and track your personalized nutrition goals
 */
export const goalService = {
  /**
   * Create a new nutrition goal
   * @param {Object} goalData - Goal data
   * @param {string} goalData.goalType - Type of goal (e.g., 'Weight Loss', 'Muscle Gain')
   * @param {number} goalData.targetCalories - Target daily calories (optional)
   * @param {Object} goalData.targetMacroSplit - Macro split {protein, carbs, fat} (optional)
   * @returns {Promise} API response with created goal
   */
  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  /**
   * Get all goals for the user
   * @returns {Promise} API response with goals list
   */
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  /**
   * Get the active goal
   * @returns {Promise} API response with active goal
   */
  getActiveGoal: async () => {
    const response = await api.get('/goals/active');
    return response.data;
  },

  /**
   * Get a single goal by ID
   * @param {string} goalId - Goal ID
   * @returns {Promise} API response with goal
   */
  getGoal: async (goalId) => {
    const response = await api.get(`/goals/${goalId}`);
    return response.data;
  },

  /**
   * Update a goal
   * @param {string} goalId - Goal ID
   * @param {Object} goalData - Updated goal data
   * @returns {Promise} API response
   */
  updateGoal: async (goalId, goalData) => {
    const response = await api.put(`/goals/${goalId}`, goalData);
    return response.data;
  },

  /**
   * Delete a goal
   * @param {string} goalId - Goal ID
   * @returns {Promise} API response
   */
  deleteGoal: async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  }
};

