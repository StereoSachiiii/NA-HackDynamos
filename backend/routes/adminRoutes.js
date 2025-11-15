import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/adminMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  listCollections,
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
  getNutritionGoal,
  upsertFactory,
  upsertFoodItem,
  upsertGoalProfile,
  upsertTip,
  upsertUser,
  removeDocument
} from '../controllers/adminController.js';
import FoodItem from '../models/FoodItem.js';
import GoalProfile from '../models/GoalProfile.js';
import Tip from '../models/Tip.js';
import User from '../models/User.js';
import MealLog from '../models/MealLog.js';
import MealPlanTemplate from '../models/MealPlanTemplate.js';
import NutritionGoal from '../models/NutritionGoal.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, requireAdmin);

// Stats endpoint
router.get('/stats', listCollections);

// Foods routes
router.get('/foods', listFoods);
router.get('/foods/:id', getFood);
router.post('/foods', upsertFoodItem);
router.put('/foods/:id', upsertFoodItem);
router.delete('/foods/:id', removeDocument(FoodItem, 'Food item'));

// Goals routes
router.get('/goals', listGoals);
router.get('/goals/:id', getGoal);
router.post('/goals', upsertGoalProfile);
router.put('/goals/:id', upsertGoalProfile);
router.delete('/goals/:id', removeDocument(GoalProfile, 'Goal profile'));

// Tips routes
router.get('/tips', listTips);
router.get('/tips/:id', getTip);
router.post('/tips', upsertTip);
router.put('/tips/:id', upsertTip);
router.delete('/tips/:id', removeDocument(Tip, 'Tip'));

// Users routes
router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.post('/users', upsertUser);
router.put('/users/:id', upsertUser);
router.delete('/users/:id', removeDocument(User, 'User'));

// Meal Logs routes
router.get('/meal-logs', listMealLogs);
router.get('/meal-logs/:id', getMealLog);
router.post('/meal-logs', asyncHandler(async (req, res) => {
  const data = req.body;
  
  // Validate FoodItem references if foodEntries exist
  if (data.foodEntries && data.foodEntries.length > 0) {
    const FoodItem = (await import('../models/FoodItem.js')).default;
    const foodItemIds = data.foodEntries.map(entry => entry.foodItem);
    const existingFoodItems = await FoodItem.find({ _id: { $in: foodItemIds } });
    const existingIds = new Set(existingFoodItems.map(item => item._id.toString()));
    
    const missingIds = foodItemIds.filter(id => !existingIds.has(id.toString()));
    if (missingIds.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid food item references: ${missingIds.join(', ')}` 
      });
    }
  }
  
  // Sanitize notes
  if (data.notes) {
    data.notes = data.notes.trim().substring(0, 1000);
  }
  
  const doc = await MealLog.create(data);
  // Recompute summary if foodEntries exist
  if (doc.foodEntries && doc.foodEntries.length > 0) {
    const { computeSummary } = await import('../services/nutritionSummaryService.js');
    doc.summaryCache = await computeSummary(doc);
    await doc.save();
  }
  res.json({ success: true, data: doc });
}));
router.put('/meal-logs/:id', asyncHandler(async (req, res) => {
  // Validate FoodItem references if foodEntries are being updated
  if (req.body.foodEntries && req.body.foodEntries.length > 0) {
    const FoodItem = (await import('../models/FoodItem.js')).default;
    const foodItemIds = req.body.foodEntries.map(entry => entry.foodItem);
    const existingFoodItems = await FoodItem.find({ _id: { $in: foodItemIds } });
    const existingIds = new Set(existingFoodItems.map(item => item._id.toString()));
    
    const missingIds = foodItemIds.filter(id => !existingIds.has(id.toString()));
    if (missingIds.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid food item references: ${missingIds.join(', ')}` 
      });
    }
  }
  
  // Sanitize notes if being updated
  if (req.body.notes !== undefined) {
    req.body.notes = req.body.notes ? req.body.notes.trim().substring(0, 1000) : null;
  }
  
  const doc = await MealLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Meal log not found' });
  }
  // Recompute summary if foodEntries exist
  if (doc.foodEntries && doc.foodEntries.length > 0) {
    const { computeSummary } = await import('../services/nutritionSummaryService.js');
    doc.summaryCache = await computeSummary(doc);
    await doc.save();
  }
  res.json({ success: true, data: doc });
}));
router.delete('/meal-logs/:id', removeDocument(MealLog, 'Meal log'));

// Meal Plans routes
router.get('/meal-plans', listMealPlans);
router.get('/meal-plans/:id', getMealPlan);
router.post('/meal-plans', asyncHandler(async (req, res) => {
  const data = req.body;
  const doc = await MealPlanTemplate.create(data);
  res.json({ success: true, data: doc });
}));
router.put('/meal-plans/:id', asyncHandler(async (req, res) => {
  const doc = await MealPlanTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: doc });
}));
router.delete('/meal-plans/:id', removeDocument(MealPlanTemplate, 'Meal plan'));

// Nutrition Goals routes
router.get('/nutrition-goals', listNutritionGoals);
router.get('/nutrition-goals/:id', getNutritionGoal);
router.post('/nutrition-goals', asyncHandler(async (req, res) => {
  const data = req.body;
  const doc = await NutritionGoal.create(data);
  res.json({ success: true, data: doc });
}));
router.put('/nutrition-goals/:id', asyncHandler(async (req, res) => {
  const doc = await NutritionGoal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Nutrition goal not found' });
  }
  res.json({ success: true, data: doc });
}));
router.delete('/nutrition-goals/:id', removeDocument(NutritionGoal, 'Nutrition goal'));

export default router;

