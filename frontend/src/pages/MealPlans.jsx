import { useState, useEffect } from 'react';
import { mealPlanService } from '../services/mealPlanService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MealPlans = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [filterGoalType, setFilterGoalType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goalType: 'Weight Loss',
    days: []
  });

  // Professional nutrition background image
  const backgroundImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1920&q=80';

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const params = filterGoalType ? { goalType: filterGoalType } : {};
      const response = await mealPlanService.getMealPlans(params);
      setMealPlans(response.data || []);
    } catch (error) {
      console.error('Failed to fetch meal plans:', error);
      setMealPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMealPlans();
    }
  }, [user, filterGoalType]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await mealPlanService.createCustomPlan(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', goalType: 'Weight Loss', days: [] });
      fetchMealPlans();
      setSuccess('Meal plan created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.msg || e.message).join(', ')
        : error.response?.data?.message || 'Failed to create meal plan';
      setError(errorMessage);
      console.error(error);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      goalType: plan.goalType || 'Weight Loss',
      days: plan.days || []
    });
    setShowCreateForm(true);
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await mealPlanService.updateMealPlan(editingPlan._id || editingPlan.id, formData);
      setShowCreateForm(false);
      setEditingPlan(null);
      setFormData({ name: '', description: '', goalType: 'Weight Loss', days: [] });
      fetchMealPlans();
      setSuccess('Meal plan updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.msg || e.message).join(', ')
        : error.response?.data?.message || 'Failed to update meal plan';
      setError(errorMessage);
      console.error(error);
    }
  };

  const handleDeleteClick = (planId) => {
    setPlanToDelete(planId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    
    setError('');
    setSuccess('');
    
    try {
      await mealPlanService.deleteMealPlan(planToDelete);
      fetchMealPlans();
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
      setSuccess('Meal plan deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete meal plan';
      setError(errorMessage);
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
      console.error(error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setPlanToDelete(null);
  };

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-800/70 to-blue-900/80"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('mealPlans.signInToView')}
            </h2>
            <p className="text-gray-600">
              {t('mealPlans.signInDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-blue-900/85"></div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-blue-900/85"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 pt-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-3xl">📋</span>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {t('mealPlans.title')}
                  </h1>
                  <p className="text-xl text-emerald-100 drop-shadow-md">
                    {t('mealPlans.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              {showCreateForm ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('common.cancel')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('mealPlans.createPlan')}
                </>
              )}
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {t('mealPlans.filterByGoal')}
              </label>
              <select
                value={filterGoalType}
                onChange={(e) => setFilterGoalType(e.target.value)}
                className="input-field w-full sm:w-64 border-2 border-emerald-200 dark:border-gray-600 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('mealPlans.allGoalTypes')}</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Athletic Performance">Athletic Performance</option>
                <option value="General Health">General Health</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Student Focus">Student Focus</option>
              </select>
              {filterGoalType && (
                <button
                  onClick={() => setFilterGoalType('')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  {t('mealPlans.clearFilter')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative animate-fadeIn">
            <span className="block sm:inline">{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-fadeIn">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Form Section */}
        {showCreateForm && (
          <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 animate-fadeIn">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPlan ? t('mealPlans.editPlan') : t('mealPlans.createFirstPlan')}
              </h2>
            </div>
            <form onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('mealPlans.planName')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field border-2 border-emerald-200 focus:border-emerald-500"
                  required
                  placeholder="e.g., Weekly Weight Loss Plan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('mealPlans.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field border-2 border-emerald-200 focus:border-emerald-500"
                  rows="3"
                  placeholder="Describe your meal plan..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('mealPlans.goalType')} *
                </label>
                <select
                  value={formData.goalType}
                  onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                  className="input-field border-2 border-emerald-200 focus:border-emerald-500"
                  required
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                  <option value="General Health">General Health</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex-1"
                >
                  {editingPlan ? t('mealPlans.updatePlan') : t('common.create')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingPlan(null);
                    setFormData({ name: '', description: '', goalType: 'Weight Loss', days: [] });
                    setError('');
                    setSuccess('');
                  }}
                  className="bg-white text-emerald-600 border-2 border-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg flex-1"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Meal Plans Grid */}
        {mealPlans.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center border border-white/20 animate-fadeIn">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-700 text-xl font-semibold mb-2">
              {t('mealPlans.noPlans')}
            </p>
            <p className="text-gray-600 mb-6">
              {t('mealPlans.createFirst')}
            </p>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('mealPlans.createFirstPlan')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {mealPlans.map((plan) => (
              <div 
                key={plan._id || plan.id} 
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                {plan.description && (
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.isCustom && (
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold rounded-full shadow-md">
                      {t('mealPlans.customPlan')}
                    </span>
                  )}
                  {plan.goalType && (
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      {plan.goalType}
                    </span>
                  )}
                  {plan.days && plan.days.length > 0 && (
                    <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                      {plan.days.length} {t('mealPlans.days')}
                    </span>
                  )}
                </div>
                {plan.isCustom && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(plan._id || plan.id)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this meal plan? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex-1"
                >
                  Delete
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlans;

