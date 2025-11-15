import asyncHandler from '../utils/asyncHandler.js';
import FoodItem from '../models/FoodItem.js';
import GoalProfile from '../models/GoalProfile.js';
import Tip from '../models/Tip.js';
import User from '../models/User.js';
import MealLog from '../models/MealLog.js';
import MealPlanTemplate from '../models/MealPlanTemplate.js';
import NutritionGoal from '../models/NutritionGoal.js';
import createHttpError from '../utils/createHttpError.js';

const listCollections = asyncHandler(async (_req, res) => {
  const [foods, goals, tips, users, mealLogs, mealPlans, nutritionGoals] = await Promise.all([
    FoodItem.countDocuments(),
    GoalProfile.countDocuments(),
    Tip.countDocuments(),
    User.countDocuments(),
    MealLog.countDocuments(),
    MealPlanTemplate.countDocuments(),
    NutritionGoal.countDocuments()
  ]);

  res.json({
    success: true,
    data: { foods, goals, tips, users, mealLogs, mealPlans, nutritionGoals }
  });
});

// Generic list factory for GET all
const listFactory = (Model, populate = '') =>
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};
    if (search && Model.schema.paths.name) {
      query.name = { $regex: search, $options: 'i' };
    }

    let queryBuilder = Model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    
    if (populate) {
      queryBuilder = queryBuilder.populate(populate);
    }

    const [data, total] = await Promise.all([
      queryBuilder.exec(),
      Model.countDocuments(query)
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

// Generic get by ID factory
const getByIdFactory = (Model, populate = '') =>
  asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) {
      query = query.populate(populate);
    }
    const doc = await query;
    if (!doc) {
      throw createHttpError(404, 'Document not found');
    }
    res.json({ success: true, data: doc });
  });

// Generic upsert factory
const upsertFactory = Model =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const doc = id
      ? await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      : await Model.create(data);

    res.json({
      success: true,
      data: doc
    });
  });

// User-specific upsert (handle password separately)
const upsertUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  
  // Don't allow password updates through this route (use dedicated password reset)
  delete data.password;

  const doc = id
    ? await User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    : await User.create(data);

  res.json({
    success: true,
    data: doc
  });
});

// Generic delete factory
const removeDocument = (Model, label) =>
  asyncHandler(async (req, res) => {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) {
      throw createHttpError(404, `${label} not found`);
    }
    res.json({ success: true, message: `${label} deleted successfully` });
  });

// Create specific functions from factories
const upsertFoodItem = upsertFactory(FoodItem);
const upsertGoalProfile = upsertFactory(GoalProfile);
const upsertTip = upsertFactory(Tip);
const listFoods = listFactory(FoodItem);
const listGoals = listFactory(GoalProfile);
const listTips = listFactory(Tip);
const listUsers = listFactory(User);
const listMealLogs = listFactory(MealLog, 'user foodEntries.foodItem');
const listMealPlans = listFactory(MealPlanTemplate);
const listNutritionGoals = listFactory(NutritionGoal, 'user');
const getFood = getByIdFactory(FoodItem);
const getGoal = getByIdFactory(GoalProfile);
const getTip = getByIdFactory(Tip);
const getUser = getByIdFactory(User);
const getMealLog = getByIdFactory(MealLog, 'user foodEntries.foodItem');
const getMealPlan = getByIdFactory(MealPlanTemplate);
const getNutritionGoal = getByIdFactory(NutritionGoal, 'user');

// Export all functions
export {
  listCollections,
  listFactory,
  getByIdFactory,
  upsertFactory,
  upsertFoodItem,
  upsertGoalProfile,
  upsertTip,
  upsertUser,
  removeDocument,
  listFoods,
  listGoals,
  listTips,
  listUsers,
  listMealLogs,
  listMealPlans,
  listNutritionGoals,
  getFood,
  getGoal,
  getTip,
  getUser,
  getMealLog,
  getMealPlan,
  getNutritionGoal
};

