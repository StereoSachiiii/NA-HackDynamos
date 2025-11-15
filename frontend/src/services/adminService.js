import api from './api';

const ADMIN_BASE = '/admin';

export const adminService = {
  // Stats
  getStats: async () => {
    const response = await api.get(`${ADMIN_BASE}/stats`);
    return response.data;
  },

  // Foods
  getFoods: async (params = {}) => {
    const response = await api.get(`${ADMIN_BASE}/foods`, { params });
    return response.data;
  },
  getFood: async (id) => {
    const response = await api.get(`${ADMIN_BASE}/foods/${id}`);
    return response.data;
  },
  createFood: async (data) => {
    const response = await api.post(`${ADMIN_BASE}/foods`, data);
    return response.data;
  },
  updateFood: async (id, data) => {
    const response = await api.put(`${ADMIN_BASE}/foods/${id}`, data);
    return response.data;
  },
  deleteFood: async (id) => {
    const response = await api.delete(`${ADMIN_BASE}/foods/${id}`);
    return response.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await api.get(`${ADMIN_BASE}/users`, { params });
    return response.data;
  },
  getUser: async (id) => {
    const response = await api.get(`${ADMIN_BASE}/users/${id}`);
    return response.data;
  },
  createUser: async (data) => {
    const response = await api.post(`${ADMIN_BASE}/users`, data);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await api.put(`${ADMIN_BASE}/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`${ADMIN_BASE}/users/${id}`);
    return response.data;
  },

  // Goals
  getGoals: async (params = {}) => {
    const response = await api.get(`${ADMIN_BASE}/goals`, { params });
    return response.data;
  },
  getGoal: async (id) => {
    const response = await api.get(`${ADMIN_BASE}/goals/${id}`);
    return response.data;
  },
  createGoal: async (data) => {
    const response = await api.post(`${ADMIN_BASE}/goals`, data);
    return response.data;
  },
  updateGoal: async (id, data) => {
    const response = await api.put(`${ADMIN_BASE}/goals/${id}`, data);
    return response.data;
  },
  deleteGoal: async (id) => {
    const response = await api.delete(`${ADMIN_BASE}/goals/${id}`);
    return response.data;
  },

  // Tips
  getTips: async (params = {}) => {
    const response = await api.get(`${ADMIN_BASE}/tips`, { params });
    return response.data;
  },
  getTip: async (id) => {
    const response = await api.get(`${ADMIN_BASE}/tips/${id}`);
    return response.data;
  },
  createTip: async (data) => {
    const response = await api.post(`${ADMIN_BASE}/tips`, data);
    return response.data;
  },
  updateTip: async (id, data) => {
    const response = await api.put(`${ADMIN_BASE}/tips/${id}`, data);
    return response.data;
  },
  deleteTip: async (id) => {
    const response = await api.delete(`${ADMIN_BASE}/tips/${id}`);
    return response.data;
  },

  // Meal Logs
  getMealLogs: async (params = {}) => {
    const response = await api.get(`${ADMIN_BASE}/meal-logs`, { params });
    return response.data;
  },
  getMealLog: async (id) => {
    const response = await api.get(`${ADMIN_BASE}/meal-logs/${id}`);
    return response.data;
  },
  createMealLog: async (data) => {
    const response = await api.post(`${ADMIN_BASE}/meal-logs`, data);
    return response.data;
  },
  updateMealLog: async (id, data) => {
    const response = await api.put(`${ADMIN_BASE}/meal-logs/${id}`, data);
    return response.data;
  },
  deleteMealLog: async (id) => {
    const response = await api.delete(`${ADMIN_BASE}/meal-logs/${id}`);
    return response.data;
  },

  // Meal Plans
  getMealPlans: async (params = {}) => {
    const response = await api.get(`${ADMIN_BASE}/meal-plans`, { params });
    return response.data;
  },
  getMealPlan: async (id) => {
    const response = await api.get(`${ADMIN_BASE}/meal-plans/${id}`);
    return response.data;
  },
  createMealPlan: async (data) => {
    const response = await api.post(`${ADMIN_BASE}/meal-plans`, data);
    return response.data;
  },
  updateMealPlan: async (id, data) => {
    const response = await api.put(`${ADMIN_BASE}/meal-plans/${id}`, data);
    return response.data;
  },
  deleteMealPlan: async (id) => {
    const response = await api.delete(`${ADMIN_BASE}/meal-plans/${id}`);
    return response.data;
  },

  // Nutrition Goals
  getNutritionGoals: async (params = {}) => {
    const response = await api.get(`${ADMIN_BASE}/nutrition-goals`, { params });
    return response.data;
  },
  getNutritionGoal: async (id) => {
    const response = await api.get(`${ADMIN_BASE}/nutrition-goals/${id}`);
    return response.data;
  },
  createNutritionGoal: async (data) => {
    const response = await api.post(`${ADMIN_BASE}/nutrition-goals`, data);
    return response.data;
  },
  updateNutritionGoal: async (id, data) => {
    const response = await api.put(`${ADMIN_BASE}/nutrition-goals/${id}`, data);
    return response.data;
  },
  deleteNutritionGoal: async (id) => {
    const response = await api.delete(`${ADMIN_BASE}/nutrition-goals/${id}`);
    return response.data;
  }
};

