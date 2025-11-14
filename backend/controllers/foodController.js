import asyncHandler from '../utils/asyncHandler.js';
import FoodItem from '../models/FoodItem.js';

// Utility function to safely parse numbers from query params
const parseNumber = value => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/**
 * @desc Get all food items with filtering and search capabilities
 * @route GET /api/v1/foods
 * @access Public
 */
const getFoods = asyncHandler(async (req, res) => {
  const { search, category, maxGlycemicLoad, tags, limit = 50 } = req.query;

  const query = {};

  // 1. Search by name or localName (case-insensitive regex)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { localName: { $regex: search, $options: 'i' } }
    ];
  }

  // 2. Filter by category (case-insensitive exact match)
  if (category) {
    query.category = { $regex: `^${category}$`, $options: 'i' };
  }

  // 3. Filter by maximum Glycemic Load (for diabetic/health-conscious users)
  const glycemicCeiling = parseNumber(maxGlycemicLoad);
  if (glycemicCeiling !== undefined) {
    query.glycemicLoad = { $lte: glycemicCeiling };
  }

  // 4. Filter by tags (e.g., 'vegan', 'high-protein', 'low-carb')
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    query.tags = { $in: tagArray };
  }

  // 5. Set limit (capped at 100 for performance)
  const pageLimit = Math.min(parseInt(limit, 10) || 50, 100);

  const foods = await FoodItem.find(query).limit(pageLimit);

  res.json({
    success: true,
    count: foods.length,
    data: foods
  });
});

/**
 * @desc Get single food item by ID
 * @route GET /api/v1/foods/:id
 * @access Public
 */
const getFoodById = asyncHandler(async (req, res) => {
  const food = await FoodItem.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ success: false, error: 'Food item not found' });
  }

  res.json({ success: true, data: food });
});

/**
 * @desc Create new food item
 * @route POST /api/v1/foods
 * @access Private (e.g., Admin/Maintainer)
 */
const createFood = asyncHandler(async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);
    res.status(201).json({ success: true, data: food });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000) for 'name' unique index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: `A food item with the name '${req.body.name}' already exists.`
      });
    }
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    throw error;
  }
});

/**
 * @desc Update food item (PUT for full update, PATCH for partial update)
 * @route PUT/PATCH /api/v1/foods/:id
 * @access Private (e.g., Admin/Maintainer)
 */
const updateFood = asyncHandler(async (req, res) => {
  try {
    // Use findByIdAndUpdate with validation and return the modified document
    const food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    if (!food) {
      return res.status(404).json({ success: false, error: 'Food item not found for update' });
    }

    res.json({ success: true, data: food });
  } catch (error) {
    // Handle MongoDB duplicate key error if 'name' is being updated
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: `The name '${req.body.name}' is already taken by another food item.`
      });
    }
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    throw error;
  }
});

/**
 * @desc Delete food item
 * @route DELETE /api/v1/foods/:id
 * @access Private (e.g., Admin/Maintainer)
 */
const deleteFood = asyncHandler(async (req, res) => {
  const food = await FoodItem.findByIdAndDelete(req.params.id);

  if (!food) {
    return res.status(404).json({ success: false, error: 'Food item not found for deletion' });
  }

  // Successful deletion often returns 204 No Content, but 200 with empty body is fine too
  res.status(200).json({ success: true, data: {} });
});

/**
 * @desc Bulk create food items from an array
 * @route POST /api/v1/foods/bulk
 * @access Private (e.g., Admin/Maintainer)
 */
const bulkCreateFoods = asyncHandler(async (req, res) => {
  const foods = req.body;

  if (!Array.isArray(foods) || foods.length === 0) {
    return res.status(400).json({ success: false, error: 'Request body must be a non-empty array of food items.' });
  }

  try {
    // insertMany is highly efficient for bulk operations
    // ordered: false means it inserts valid items even if others fail
    const createdFoods = await FoodItem.insertMany(foods, { ordered: false });

    res.status(201).json({
      success: true,
      count: createdFoods.length,
      data: createdFoods
    });
  } catch (error) {
    // This error handles cases where some documents failed to validate or caused duplicate keys.
    if (error.name === 'MongoBulkWriteError' && error.result.nInserted > 0) {
      // Return 207 Multi-Status for partial success
      return res.status(207).json({
        success: false,
        error: `Bulk operation failed. ${error.result.nInserted} items were successfully inserted.`,
        details: 'Some documents failed due to validation or duplicate key errors.'
      });
    }
    // For complete failure (e.g., empty array or non-array, though handled above, or other connection issues)
    throw error;
  }
});

export { getFoods, getFoodById, createFood, updateFood, deleteFood, bulkCreateFoods };