const FoodCard = ({ food, onViewDetails }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails && onViewDetails(food)}>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{food.name}</h3>
      {food.localName && (
        <p className="text-sm text-gray-600 mb-3">{food.localName}</p>
      )}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Category:</span>
          <span className="font-medium">{food.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Calories:</span>
          <span className="font-medium">{food.calories} kcal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Protein:</span>
          <span className="font-medium">{food.protein}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Carbs:</span>
          <span className="font-medium">{food.carbs}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fat:</span>
          <span className="font-medium">{food.fat}g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Glycemic Load:</span>
          <span className={`font-medium ${
            food.glycemicLoad > 15 ? 'text-red-600' : 
            food.glycemicLoad > 10 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {food.glycemicLoad}
          </span>
        </div>
        {food.tags && food.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {food.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {onViewDetails && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(food);
          }}
          className="mt-3 w-full btn-primary text-sm"
        >
          View Details
        </button>
      )}
    </div>
  );
};

export default FoodCard;

