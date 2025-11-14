import { useState, useEffect } from 'react';
import { mealLogService } from '../../services/mealLogService';
import { foodService } from '../../services/foodService';
import { uploadImage } from '../../services/imageUpload';
import FoodSearch from '../Food/FoodSearch';

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
  const [quantity, setQuantity] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (mealLog) {
      const date = new Date(mealLog.date);
      setFormData({
        mealType: mealLog.mealType || 'Breakfast',
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        foodEntries: mealLog.foodEntries || [],
        notes: mealLog.notes || ''
      });
    }
  }, [mealLog]);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await foodService.searchFoods(term, 10);
      setSearchResults(response.data || []);
    } catch (err) {
      console.error('Food search error:', err);
    }
  };

  const handleAddFood = () => {
    if (!selectedFood) {
      setError('Please select a food item');
      return;
    }

    const qty = parseFloat(quantity) || 100;
    const newEntry = {
      foodItem: selectedFood._id,
      quantity: qty,
      unit: 'g'
    };

    setFormData({
      ...formData,
      foodEntries: [...formData.foodEntries, newEntry]
    });

    setSelectedFood(null);
    setQuantity('100');
    setSearchTerm('');
    setSearchResults([]);
    setError('');
  };

  const handleRemoveFood = (index) => {
    setFormData({
      ...formData,
      foodEntries: formData.foodEntries.filter((_, i) => i !== index)
    });
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
      setError(err.response?.data?.message || 'Failed to save meal log');
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type *
          </label>
          <select
            value={formData.mealType}
            onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
            className="input-field"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time *
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Photo (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            setUploadingPhoto(true);
            try {
              const result = await uploadImage(file);
              if (result.success && result.data?.photoUrl) {
                setPhotoUrl(result.data.photoUrl);
                alert('Photo uploaded successfully!');
              }
            } catch (err) {
              alert('Failed to upload photo');
              console.error(err);
            } finally {
              setUploadingPhoto(false);
            }
          }}
          disabled={uploadingPhoto}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {uploadingPhoto && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
        {photoUrl && (
          <p className="text-sm text-green-600 mt-2">✓ Photo uploaded</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Food Items *
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field flex-1"
            />
            <input
              type="number"
              placeholder="Quantity (g)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-field w-32"
              min="1"
            />
            <button
              type="button"
              onClick={handleAddFood}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Add
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="border rounded-lg p-2 max-h-48 overflow-y-auto">
              {searchResults.map((food) => (
                <div
                  key={food._id}
                  onClick={() => {
                    setSelectedFood(food);
                    setSearchTerm(food.name);
                    setSearchResults([]);
                  }}
                  className={`p-2 cursor-pointer hover:bg-emerald-50 rounded ${
                    selectedFood?._id === food._id ? 'bg-emerald-100' : ''
                  }`}
                >
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-600">
                    {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.foodEntries.length > 0 && (
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-semibold mb-2">Selected Foods:</h4>
              <ul className="space-y-2">
                {formData.foodEntries.map((entry, idx) => {
                  const food = searchResults.find(f => f._id === entry.foodItem) || 
                               (mealLog?.foodEntries?.[idx]?.foodItem);
                  return (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <span>
                        {food?.name || entry.foodItem} - {entry.quantity}{entry.unit || 'g'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFood(idx)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-sm hover:shadow-md text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field"
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

