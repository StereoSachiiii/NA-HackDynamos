import { useState, useEffect } from 'react';
import { goalService } from '../../services/goalService';
import api from '../../services/api';

const GoalForm = ({ goal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    goalType: '',
    targetCalories: '',
    targetMacroSplit: {
      protein: 25,
      carbs: 50,
      fat: 25
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [goalProfiles, setGoalProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    // Fetch goal profiles from admin API
    const fetchGoalProfiles = async () => {
      try {
        setLoadingProfiles(true);
        const response = await api.get('/admin/goals');
        const profiles = response.data.data || [];
        setGoalProfiles(profiles);
        // Set default if no goal selected
        if (!goal && profiles.length > 0) {
          setFormData(prev => ({
            ...prev,
            goalType: profiles[0].name || 'Weight Loss'
          }));
          setSelectedProfile(profiles[0]);
        }
      } catch (err) {
        console.error('Failed to fetch goal profiles:', err);
        // Fallback to hardcoded list if API fails (non-admin users)
        setGoalProfiles([
          { name: 'Weight Loss', calorieBand: { min: 1200, max: 1800 }, macroSplit: { protein: 30, carbs: 40, fat: 30 } },
          { name: 'Muscle Gain', calorieBand: { min: 2500, max: 3500 }, macroSplit: { protein: 30, carbs: 50, fat: 20 } },
          { name: 'Maintenance', calorieBand: { min: 2000, max: 2500 }, macroSplit: { protein: 25, carbs: 50, fat: 25 } },
          { name: 'Athletic Performance', calorieBand: { min: 2500, max: 4000 }, macroSplit: { protein: 25, carbs: 55, fat: 20 } },
          { name: 'General Health', calorieBand: { min: 1800, max: 2200 }, macroSplit: { protein: 25, carbs: 50, fat: 25 } }
        ]);
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchGoalProfiles();

    if (goal) {
      setFormData({
        goalType: goal.goalType || '',
        targetCalories: goal.targetCalories || '',
        targetMacroSplit: goal.targetMacroSplit || {
          protein: 25,
          carbs: 50,
          fat: 25
        }
      });
    }
  }, [goal]);

  const handleGoalTypeChange = (goalType) => {
    const profile = goalProfiles.find(p => p.name === goalType);
    setSelectedProfile(profile);
    
    // Auto-fill macros and calories from profile if available
    if (profile) {
      setFormData(prev => ({
        ...prev,
        goalType,
        targetMacroSplit: profile.macroSplit || prev.targetMacroSplit,
        targetCalories: prev.targetCalories || (profile.calorieBand ? 
          Math.round((profile.calorieBand.min + profile.calorieBand.max) / 2) : 
          prev.targetCalories)
      }));
    } else {
      setFormData(prev => ({ ...prev, goalType }));
    }
    setError('');
  };

  const handleMacroChange = (field, value) => {
    const newMacros = { ...formData.targetMacroSplit };
    newMacros[field] = parseInt(value) || 0;
    
    // Ensure total doesn't exceed 100
    const total = Object.values(newMacros).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    if (total > 100) {
      setError('Macro split percentages must total 100% or less');
      return;
    }
    
    setFormData({ ...formData, targetMacroSplit: newMacros });
    setError('');
  };

  const adjustMacrosToTotal = (targetTotal = 100) => {
    const currentTotal = Object.values(formData.targetMacroSplit).reduce(
      (sum, val) => sum + (parseInt(val) || 0), 0
    );
    
    if (currentTotal === 0) return;
    
    const ratio = targetTotal / currentTotal;
    const adjusted = {
      protein: Math.round(formData.targetMacroSplit.protein * ratio),
      carbs: Math.round(formData.targetMacroSplit.carbs * ratio),
      fat: Math.round(formData.targetMacroSplit.fat * ratio)
    };
    
    // Ensure it totals exactly to target
    const newTotal = Object.values(adjusted).reduce((sum, val) => sum + val, 0);
    const diff = targetTotal - newTotal;
    if (diff !== 0) {
      adjusted.protein += diff; // Add difference to protein
    }
    
    setFormData({ ...formData, targetMacroSplit: adjusted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const totalMacros = Object.values(formData.targetMacroSplit).reduce(
      (sum, val) => sum + (parseInt(val) || 0), 0
    );

    if (totalMacros > 100) {
      setError('Macro split percentages must total 100% or less');
      setLoading(false);
      return;
    }

    try {
      const goalData = {
        goalType: formData.goalType,
        ...(formData.targetCalories && { targetCalories: parseInt(formData.targetCalories) }),
        ...(totalMacros > 0 && { targetMacroSplit: formData.targetMacroSplit })
      };

      if (goal) {
        await goalService.updateGoal(goal.id, goalData);
      } else {
        await goalService.createGoal(goalData);
      }

      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Goal Type *
        </label>
        {loadingProfiles ? (
          <div className="input-field text-center py-2">Loading goal types...</div>
        ) : (
          <select
            value={formData.goalType}
            onChange={(e) => handleGoalTypeChange(e.target.value)}
            className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          >
            <option value="">Select a goal type...</option>
            {goalProfiles.map((profile) => (
              <option key={profile.name || profile} value={profile.name || profile}>
                {profile.name || profile}
                {profile.calorieBand ? ` (${profile.calorieBand.min}-${profile.calorieBand.max} kcal)` : ''}
              </option>
            ))}
          </select>
        )}
        {selectedProfile && selectedProfile.calorieBand && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recommended: {selectedProfile.calorieBand.min}-{selectedProfile.calorieBand.max} calories
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Target Calories {selectedProfile?.calorieBand ? '(Recommended)' : '(Optional)'}
        </label>
        <input
          type="number"
          value={formData.targetCalories}
          onChange={(e) => setFormData({ ...formData, targetCalories: e.target.value })}
          className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder={selectedProfile?.calorieBand ? 
            `e.g., ${Math.round((selectedProfile.calorieBand.min + selectedProfile.calorieBand.max) / 2)}` : 
            "e.g., 2000"}
          min="100"
          max="5000"
        />
        {selectedProfile?.calorieBand ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Recommended range: {selectedProfile.calorieBand.min}-{selectedProfile.calorieBand.max} calories
          </p>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Leave empty to use default for goal type
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Macro Split {selectedProfile?.macroSplit ? '(From Profile)' : '(Optional)'}
          </label>
          <button
            type="button"
            onClick={() => adjustMacrosToTotal(100)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
          >
            Normalize to 100%
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Protein (%)</label>
            <input
              type="number"
              value={formData.targetMacroSplit.protein}
              onChange={(e) => handleMacroChange('protein', e.target.value)}
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Carbs (%)</label>
            <input
              type="number"
              value={formData.targetMacroSplit.carbs}
              onChange={(e) => handleMacroChange('carbs', e.target.value)}
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Fat (%)</label>
            <input
              type="number"
              value={formData.targetMacroSplit.fat}
              onChange={(e) => handleMacroChange('fat', e.target.value)}
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              min="0"
              max="100"
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total: <span className={`font-semibold ${
              Object.values(formData.targetMacroSplit).reduce((sum, val) => sum + (parseInt(val) || 0), 0) === 100 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {Object.values(formData.targetMacroSplit).reduce((sum, val) => sum + (parseInt(val) || 0), 0)}%
            </span>
          </p>
          {Object.values(formData.targetMacroSplit).reduce((sum, val) => sum + (parseInt(val) || 0), 0) !== 100 && (
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Should total 100%
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            goal ? 'Update Goal' : 'Create Goal'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GoalForm;

