import { useState } from 'react';
import { goalService } from '../../services/goalService';

const GoalCard = ({ goal, onUpdate, onDelete, onActivate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await goalService.deleteGoal(goal.id);
      onDelete(goal.id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete goal');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      await goalService.updateGoal(goal.id, { isActive: true });
      onActivate(goal.id);
    } catch (error) {
      alert('Failed to activate goal');
      console.error(error);
    } finally {
      setIsActivating(false);
    }
  };

  const macroSplit = goal.targetMacroSplit || { protein: 0, carbs: 0, fat: 0 };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
      goal.isActive ? 'border-emerald-400 ring-4 ring-emerald-200/50' : 'border-white/20'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{goal.goalType}</h3>
            {goal.isActive && (
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold rounded-full shadow-md">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(goal.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
          <p className="text-sm text-gray-600 mb-1">Target Calories</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
            {goal.targetCalories || 'Not set'} <span className="text-lg text-gray-600">kcal</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
          <p className="text-sm text-gray-600 mb-3 font-semibold">Macro Split</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Protein:</span>
              <span className="font-bold text-emerald-700">{macroSplit.protein}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Carbs:</span>
              <span className="font-bold text-emerald-700">{macroSplit.carbs}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Fat:</span>
              <span className="font-bold text-emerald-700">{macroSplit.fat}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {!goal.isActive && (
          <button
            onClick={handleActivate}
            disabled={isActivating}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {isActivating ? 'Activating...' : 'Activate'}
          </button>
        )}
        <button
          onClick={() => onUpdate(goal)}
          className="flex-1 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 text-sm"
        >
          Edit
        </button>
        {!goal.isActive && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCard;

