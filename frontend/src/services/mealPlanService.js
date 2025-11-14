import api from './api';

/**
 * Exclusive Meal Plan Service
 * Create and manage personalized meal plans
 */
export const mealPlanService = {
  /**
   * Get all meal plans (public and user's custom plans)
   * @returns {Promise} API response with meal plans
   */
  getMealPlans: async () => {
    const response = await api.get('/meal-plans');
    return response.data;
  },

  /**
   * Get a single meal plan by ID
   * @param {string} planId - Meal plan ID
   * @returns {Promise} API response with meal plan
   */
  getMealPlan: async (planId) => {
    const response = await api.get(`/meal-plans/${planId}`);
    return response.data;
  },

  /**
   * Create a custom meal plan
   * @param {Object} planData - Meal plan data
   * @param {string} planData.name - Plan name
   * @param {string} planData.description - Plan description
   * @param {Array} planData.meals - Array of meals
   * @returns {Promise} API response with created plan
   */
  createCustomPlan: async (planData) => {
    const response = await api.post('/meal-plans/custom', planData);
    return response.data;
  },

  /**
   * Update a custom meal plan
   * @param {string} planId - Meal plan ID
   * @param {Object} planData - Updated plan data
   * @returns {Promise} API response
   */
  updateMealPlan: async (planId, planData) => {
    const response = await api.put(`/meal-plans/${planId}`, planData);
    return response.data;
  },

  /**
   * Delete a custom meal plan
   * @param {string} planId - Meal plan ID
   * @returns {Promise} API response
   */
  deleteMealPlan: async (planId) => {
    const response = await api.delete(`/meal-plans/${planId}`);
    return response.data;
  }
};

