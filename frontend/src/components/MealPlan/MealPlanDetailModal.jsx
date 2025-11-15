import { useState, useEffect } from 'react';
import { mealPlanService } from '../../services/mealPlanService';
import { mealLogService } from '../../services/mealLogService';

const MealPlanDetailModal = ({ planId, onClose, onApply }) => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await mealPlanService.getMealPlan(planId);
        setPlan(response.data);
        
        // Group days by day name
        if (response.data?.days) {
          const daysMap = {};
          response.data.days.forEach(entry => {
            if (!daysMap[entry.day]) {
              daysMap[entry.day] = [];
            }
            daysMap[entry.day].push(entry);
          });
          setSelectedDay(Object.keys(daysMap)[0] || null);
        }
      } catch (err) {
        setError('Failed to load meal plan details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  const handleApplyToMealLog = async (dayEntry) => {
    if (!dayEntry || !dayEntry.foodItems || dayEntry.foodItems.length === 0) {
      alert('No food items in this meal');
      return;
    }

    try {
      const today = new Date();
      const foodEntries = dayEntry.foodItems.map(item => ({
        foodItem: item.foodItem?._id || item.foodItem,
        quantity: 100, // Default quantity
        unit: 'g'
      }));

      const mealLogData = {
        mealType: dayEntry.mealType,
        date: today.toISOString(),
        foodEntries: foodEntries,
        notes: `Applied from meal plan: ${plan?.name}`
      };

      await mealLogService.createMealLog(mealLogData);
      alert('Meal applied to your meal log successfully!');
      if (onApply) onApply();
    } catch (err) {
      alert('Failed to apply meal to log');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md">
          <p className="text-red-600 dark:text-red-400">{error || 'Meal plan not found'}</p>
          <button onClick={onClose} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    );
  }

  // Group days by day name
  const daysMap = {};
  plan.days?.forEach(entry => {
    if (!daysMap[entry.day]) {
      daysMap[entry.day] = [];
    }
    daysMap[entry.day].push(entry);
  });
  const days = Object.keys(daysMap);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
            {plan.description && (
              <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {plan.goalType && (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                  {plan.goalType}
                </span>
              )}
              {plan.calorieTarget && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  {plan.calorieTarget} kcal/day
                </span>
              )}
              {plan.macroSplit && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  P:{plan.macroSplit.protein}% C:{plan.macroSplit.carbs}% F:{plan.macroSplit.fat}%
                </span>
              )}
              {plan.days && (
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                  {plan.days.length} meals
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Day Selector */}
          {days.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Day
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedDay === day
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meals for Selected Day */}
          {selectedDay && daysMap[selectedDay] && (
            <div className="space-y-4">
              {daysMap[selectedDay].map((entry, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {entry.mealType}
                    </h3>
                    <button
                      onClick={() => handleApplyToMealLog(entry)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Apply to Meal Log
                    </button>
                  </div>
                  
                  {entry.foodItems && entry.foodItems.length > 0 ? (
                    <div className="space-y-2">
                      {entry.foodItems.map((item, itemIdx) => {
                        const food = item.foodItem;
                        return (
                          <div key={itemIdx} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {food?.name || 'Unknown Food'}
                            </div>
                            {food && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                              </div>
                            )}
                            {item.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">{item.notes}</p>
                            )}
                            {item.substituteOptions && item.substituteOptions.length > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Substitutes: {item.substituteOptions.join(', ')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No food items specified</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          {plan.tips && plan.tips.length > 0 && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tips</h3>
              <ul className="space-y-2">
                {plan.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                    <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanDetailModal;

