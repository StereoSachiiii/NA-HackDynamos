import { useState, useEffect } from 'react';
import { goalService } from '../../services/goalService';

const GoalForm = ({ goal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    goalType: 'Weight Loss',
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

  useEffect(() => {
    // Common goal types - in production, fetch from API
    setGoalProfiles([
      'Weight Loss',
      'Muscle Gain',
      'Maintenance',
      'Athletic Performance',
      'General Health'
    ]);

    if (goal) {
      setFormData({
        goalType: goal.goalType || 'Weight Loss',
        targetCalories: goal.targetCalories || '',
        targetMacroSplit: goal.targetMacroSplit || {
          protein: 25,
          carbs: 50,
          fat: 25
        }
      });
    }
  }, [goal]);

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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Goal Type *
        </label>
        <select
          value={formData.goalType}
          onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
          className="input-field"
          required
        >
          {goalProfiles.map((profile) => (
            <option key={profile} value={profile}>
              {profile}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Calories (Optional)
        </label>
        <input
          type="number"
          value={formData.targetCalories}
          onChange={(e) => setFormData({ ...formData, targetCalories: e.target.value })}
          className="input-field"
          placeholder="e.g., 2000"
          min="100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to use default for goal type
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Macro Split (Optional)
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Protein (%)</label>
            <input
              type="number"
              value={formData.targetMacroSplit.protein}
              onChange={(e) => handleMacroChange('protein', e.target.value)}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Carbs (%)</label>
            <input
              type="number"
              value={formData.targetMacroSplit.carbs}
              onChange={(e) => handleMacroChange('carbs', e.target.value)}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Fat (%)</label>
            <input
              type="number"
              value={formData.targetMacroSplit.fat}
              onChange={(e) => handleMacroChange('fat', e.target.value)}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Total: {Object.values(formData.targetMacroSplit).reduce((sum, val) => sum + (parseInt(val) || 0), 0)}%
        </p>
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

