import { useState, useEffect, useRef } from 'react';
import { mealLogService } from '../../services/mealLogService';
import { foodService } from '../../services/foodService';

const MealLogForm = ({ mealLog, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    mealType: 'Breakfast',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    foodEntries: [],
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foodDetailsMap, setFoodDetailsMap] = useState({}); // Map to store food details
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (mealLog) {
      const date = new Date(mealLog.date);
      const entries = mealLog.foodEntries || [];
      
      // Fetch food details for existing entries
      const fetchFoodDetails = async () => {
        const detailsMap = {};
        for (const entry of entries) {
          if (entry.foodItem?._id || entry.foodItem) {
            try {
              const foodId = entry.foodItem._id || entry.foodItem;
              const food = await foodService.getFoodById(foodId);
              detailsMap[foodId] = food.data || food;
            } catch (err) {
              console.error('Failed to fetch food details:', err);
            }
          }
        }
        setFoodDetailsMap(detailsMap);
      };
      
      setFormData({
        mealType: mealLog.mealType || 'Breakfast',
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        foodEntries: entries,
        notes: mealLog.notes || ''
      });
      
      if (entries.length > 0) {
        fetchFoodDetails();
      }
    }
  }, [mealLog]);

  const performSearch = async (term) => {
    if (term.length === 0) {
      // Load initial foods when input is empty
      try {
        setSearchLoading(true);
        const response = await foodService.searchFoods('', 30);
        setSearchResults(response.data || []);
      } catch (err) {
        console.error('Food search error:', err);
        setSearchResults([]);
        setError('Failed to load foods. Please try again.');
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await foodService.searchFoods(term, 20);
      setSearchResults(response.data || []);
      setError('');
    } catch (err) {
      console.error('Food search error:', err);
      setSearchResults([]);
      setError('Failed to search foods. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setShowDropdown(true);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search - wait 300ms after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(term);
    }, 300);
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleAddFood = () => {
    if (!selectedFood) {
      setError('Please select a food item from the dropdown');
      return;
    }

    const qty = parseFloat(quantity) || 1;
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity (must be greater than 0)');
      return;
    }

    const newEntry = {
      foodItem: selectedFood._id,
      quantity: qty,
      unit: 'g'
    };

    // Store food details for display
    setFoodDetailsMap(prevMap => ({
      ...prevMap,
      [selectedFood._id]: selectedFood
    }));

    // Use functional update to ensure we have the latest state
    setFormData(prevFormData => ({
      ...prevFormData,
      foodEntries: [...prevFormData.foodEntries, newEntry]
    }));

    setSelectedFood(null);
    setQuantity('1');
    setSearchTerm('');
    setSearchResults([]);
    setShowDropdown(false);
    setError('');
  };

  const handleFoodSelect = (food, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedFood(food);
    setSearchTerm(food.name);
    setShowDropdown(false);
    setError('');
  };

  const handleRemoveFood = (index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      foodEntries: prevFormData.foodEntries.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.foodEntries.length === 0) {
      setError('Please add at least one food item');
      setLoading(false);
      return;
    }

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const mealLogData = {
        mealType: formData.mealType,
        date: dateTime.toISOString(),
        foodEntries: formData.foodEntries,
        notes: formData.notes || undefined
      };

      if (mealLog) {
        await mealLogService.updateMealLog(mealLog._id, mealLogData);
      } else {
        await mealLogService.createMealLog(mealLogData);
      }

      onSave();
    } catch (err) {
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(e => e.msg || e.message).join(', ');
        setError(errorMessages || 'Validation failed');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to save meal log');
      }
      console.error('Meal log error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ color: '#000000' }}>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Meal Type *
          </label>
          <select
            value={formData.mealType}
            onChange={(e) => setFormData(prev => ({ ...prev, mealType: e.target.value }))}
            className="input-field text-black"
            style={{ color: '#000000' }}
            required
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Supper">Supper</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="input-field text-black"
            style={{ color: '#000000' }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Time *
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="input-field text-black"
            style={{ color: '#000000' }}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Add Food Items *
        </label>
        <div className="space-y-3">
          <div className="flex gap-2 relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search and select food..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  setShowDropdown(true);
                  if (searchResults.length === 0) {
                    performSearch(searchTerm);
                  }
                }}
                onBlur={(e) => {
                  // Don't close if clicking inside dropdown
                  const relatedTarget = e.relatedTarget || document.activeElement;
                  if (!relatedTarget || !e.currentTarget.parentElement?.contains(relatedTarget)) {
                    setTimeout(() => setShowDropdown(false), 200);
                  }
                }}
                className="input-field w-full text-black pr-10"
                style={{ color: '#000000' }}
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                </div>
              )}
              
              {/* Dropdown List */}
              {showDropdown && searchResults.length > 0 && (
                <div 
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  onMouseDown={(e) => {
                    // Prevent input blur when clicking inside dropdown
                    if (e.target === e.currentTarget || e.target.closest('.dropdown-item')) {
                      e.preventDefault();
                    }
                  }}
                >
                  {searchResults.map((food) => (
                    <div
                      key={food._id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFoodSelect(food, e);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFoodSelect(food, e);
                      }}
                      className={`dropdown-item p-3 cursor-pointer hover:bg-emerald-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                        selectedFood?._id === food._id ? 'bg-emerald-100' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{food.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {food.calories || 0} kcal | P: {food.protein || 0}g | C: {food.carbs || 0}g | F: {food.fat || 0}g
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showDropdown && !searchLoading && searchResults.length === 0 && searchTerm.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-center text-gray-500">
                  No foods found. Try a different search term.
                </div>
              )}
            </div>
            
            <input
              type="number"
              placeholder="Quantity (g)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-field text-black w-32"
              style={{ color: '#000000' }}
              min="1"
              step="0.1"
            />
            <button
              type="button"
              onClick={handleAddFood}
              disabled={!selectedFood}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          
          {selectedFood && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-sm font-medium text-emerald-800">
                Selected: {selectedFood.name}
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                {selectedFood.calories || 0} kcal per 100g
              </div>
            </div>
          )}

          {formData.foodEntries.length > 0 && (
            <div className="border-2 border-emerald-500 rounded-lg p-3 bg-white" style={{ backgroundColor: '#ffffff' }}>
              <h4 className="text-sm font-semibold mb-3 text-black" style={{ color: '#000000' }}>Selected Foods ({formData.foodEntries.length}):</h4>
              <ul className="space-y-3">
                {formData.foodEntries.map((entry, idx) => {
                  const foodId = entry.foodItem?._id || entry.foodItem;
                  const food = searchResults.find(f => f._id === foodId) || 
                               foodDetailsMap[foodId] ||
                               (mealLog?.foodEntries?.[idx]?.foodItem);
                  
                  // Calculate nutrition for this entry
                  const qty = entry.quantity || 100;
                  const multiplier = qty / 100;
                  const calories = food?.calories ? Math.round(food.calories * multiplier) : 0;
                  const protein = food?.protein ? (food.protein * multiplier).toFixed(1) : 0;
                  const carbs = food?.carbs ? (food.carbs * multiplier).toFixed(1) : 0;
                  const fat = food?.fat ? (food.fat * multiplier).toFixed(1) : 0;
                  
                  return (
                    <li key={idx} className="flex justify-between items-start p-2 bg-white rounded-lg border border-emerald-300" style={{ backgroundColor: '#ffffff' }}>
                      <div className="flex-1">
                        <div className="font-medium text-black" style={{ color: '#000000' }}>
                          {food?.name || 'Unknown Food'}
                        </div>
                        <div className="text-xs text-black mt-1" style={{ color: '#000000' }}>
                          {entry.quantity}{entry.unit || 'g'} • {calories} kcal • P:{protein}g C:{carbs}g F:{fat}g
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFood(idx)}
                        className="ml-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
              {/* Total Summary */}
              {formData.foodEntries.length > 0 && (
                <div className="mt-3 pt-3 border-t border-emerald-300">
                  <div className="flex justify-between text-sm font-semibold text-black" style={{ color: '#000000' }}>
                    <span>Total:</span>
                    <span>
                      {formData.foodEntries.reduce((sum, entry) => {
                        const foodId = entry.foodItem?._id || entry.foodItem;
                        const food = foodDetailsMap[foodId] || searchResults.find(f => f._id === foodId);
                        const qty = entry.quantity || 100;
                        const multiplier = qty / 100;
                        return sum + (food?.calories || 0) * multiplier;
                      }, 0).toFixed(0)} kcal
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="input-field text-black"
          style={{ color: '#000000' }}
          rows="3"
          placeholder="Add any notes about this meal..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex-1 disabled:opacity-50"
        >
          {loading ? 'Saving...' : mealLog ? 'Update Meal Log' : 'Create Meal Log'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-white text-emerald-600 border-2 border-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg flex-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MealLogForm;

