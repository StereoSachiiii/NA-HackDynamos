import { useState } from 'react';
import { mealLogService } from '../../services/mealLogService';

const MealLogCard = ({ mealLog, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this meal log?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await mealLogService.deleteMealLog(mealLog._id);
      onDelete(mealLog._id);
    } catch (error) {
      alert('Failed to delete meal log');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const mealTypeColors = {
    Breakfast: 'bg-yellow-100 text-yellow-800',
    Lunch: 'bg-blue-100 text-blue-800',
    Dinner: 'bg-purple-100 text-purple-800',
    Snack: 'bg-green-100 text-green-800',
    Supper: 'bg-indigo-100 text-indigo-800'
  };

  const date = new Date(mealLog.date);
  const totalCalories = mealLog.summaryCache?.calories || 0;
  const totalProtein = mealLog.summaryCache?.protein || 0;
  const totalCarbs = mealLog.summaryCache?.carbs || 0;
  const totalFat = mealLog.summaryCache?.fat || 0;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            mealTypeColors[mealLog.mealType] || 'bg-gray-100 text-gray-800'
          }`}>
            {mealLog.mealType}
          </span>
          <p className="text-sm text-gray-600 mt-2">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(mealLog)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {mealLog.foodEntries && mealLog.foodEntries.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Food Items:</h4>
          <ul className="space-y-1">
            {mealLog.foodEntries.map((entry, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                • {entry.foodItem?.name || 'Unknown'} 
                {entry.quantity && ` (${entry.quantity}${entry.unit || 'g'})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 pt-3 border-t">
        <div>
          <p className="text-xs text-gray-600">Calories</p>
          <p className="text-sm font-bold">{Math.round(totalCalories)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Protein</p>
          <p className="text-sm font-bold">{Math.round(totalProtein)}g</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Carbs</p>
          <p className="text-sm font-bold">{Math.round(totalCarbs)}g</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Fat</p>
          <p className="text-sm font-bold">{Math.round(totalFat)}g</p>
        </div>
      </div>

      {mealLog.notes && (
        <p className="text-sm text-gray-600 mt-3 italic">"{mealLog.notes}"</p>
      )}
    </div>
  );
};

export default MealLogCard;

