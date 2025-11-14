import { useState } from 'react';
import { foodService } from '../../services/foodService';

const FoodDetailModal = ({ food, onClose, onAddToMeal }) => {
  const [quantity, setQuantity] = useState('100');
  const [loading, setLoading] = useState(false);
  const [fullDetails, setFullDetails] = useState(food);

  const handleAddToMeal = () => {
    if (onAddToMeal) {
      onAddToMeal({
        foodItem: food._id,
        quantity: parseFloat(quantity) || 100,
        unit: 'g'
      });
    }
    onClose();
  };

  if (!food) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{food.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {food.localName && (
            <p className="text-gray-600 mb-4">{food.localName}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Calories</p>
              <p className="text-2xl font-bold text-primary-600">{food.calories} kcal</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-2xl font-bold text-blue-600">{food.protein}g</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-2xl font-bold text-green-600">{food.carbs}g</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Fat</p>
              <p className="text-2xl font-bold text-yellow-600">{food.fat}g</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{food.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Glycemic Load:</span>
              <span className={`font-medium ${
                food.glycemicLoad > 15 ? 'text-red-600' : 
                food.glycemicLoad > 10 ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {food.glycemicLoad}
              </span>
            </div>
            {food.fiber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Fiber:</span>
                <span className="font-medium">{food.fiber}g</span>
              </div>
            )}
          </div>

          {food.tags && food.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {food.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Add to Meal Log:</p>
            <div className="flex gap-3">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field flex-1"
                placeholder="Quantity (g)"
                min="1"
              />
              <button
                onClick={handleAddToMeal}
                className="btn-primary"
              >
                Add to Meal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;

