import { useState, useEffect } from 'react';
import api from '../../services/api';
import FoodCard from './FoodCard';
import FoodDetailModal from './FoodDetailModal';

const FoodSearch = ({ onAddToMeal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    const searchFoods = async () => {
      if (searchTerm.trim().length < 2) {
        setFoods([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/foods', {
          params: { search: searchTerm, limit: 20 },
        });
        setFoods(response.data.data || []);
      } catch (err) {
        setError('Failed to search foods');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchFoods, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search foods by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {loading && (
        <div className="mt-4 text-center text-gray-600">Searching...</div>
      )}

      {error && (
        <div className="mt-4 text-center text-red-600">{error}</div>
      )}

      {!loading && !error && foods.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCard 
              key={food._id} 
              food={food} 
              onViewDetails={setSelectedFood}
            />
          ))}
        </div>
      )}

      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAddToMeal={onAddToMeal}
        />
      )}

      {!loading && !error && searchTerm && foods.length === 0 && (
        <div className="mt-4 text-center text-gray-600">
          No foods found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default FoodSearch;

