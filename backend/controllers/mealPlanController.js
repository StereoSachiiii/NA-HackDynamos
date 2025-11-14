import { body, validationResult } from 'express-validator';
import MealPlanTemplate from '../models/MealPlanTemplate.js';
import asyncHandler from '../utils/asyncHandler.js';
import createHttpError from '../utils/createHttpError.js';

// 🔍 Validation Rules
const customPlanValidationRules = [
  // General validation for POST and PUT
  body('name').notEmpty().withMessage('Name is required'),
  body('goalType').notEmpty().withMessage('GoalType is required'),
  body('days').isArray({ min: 1 }).withMessage('At least one day entry is required'),
  // Optional field validation
  body('calorieTarget').optional().isNumeric().withMessage('Calorie target must be a number'),
  body('macroSplit.protein').optional().isFloat({ min: 0, max: 100 }).withMessage('Protein must be a percentage (0-100)'),
  body('macroSplit.carbs').optional().isFloat({ min: 0, max: 100 }).withMessage('Carbs must be a percentage (0-100)'),
  body('macroSplit.fat').optional().isFloat({ min: 0, max: 100 }).withMessage('Fat must be a percentage (0-100)')
];

// 🔒 Authorization Middleware
const authorizeCustomPlanOwner = asyncHandler(async (req, res, next) => {
  const plan = await MealPlanTemplate.findById(req.params.id).select('+createdBy'); // Explicitly select createdBy if excluded in schema

  if (!plan) {
    throw createHttpError(404, 'Meal plan not found');
  }
  
  // Authorization Check:
  // 1. Only community plans can be modified by users.
  // 2. The logged-in user (req.user.id) must be the plan's creator.
  if (plan.metadata.sourceType === 'community' && plan.createdBy.toString() === req.user.id.toString()) {
      req.plan = plan; // Attach plan to request for use in controller
      return next();
  }
  
  throw createHttpError(403, 'Not authorized to modify this meal plan');
});

// --- Read Operations ---

const listMealPlans = asyncHandler(async (req, res) => {
  const { goalType, seasonTag } = req.query;

  const query = { isPublished: true };
  if (goalType) query.goalType = goalType;
  if (seasonTag) query['metadata.seasonTag'] = seasonTag;

  // Efficiency: Use .select('-days.foodItems') to retrieve all plans quickly without deep food data
  const plans = await MealPlanTemplate.find(query).select('-days.foodItems');

  res.json({
    success: true,
    count: plans.length,
    data: plans
  });
});

const getMealPlan = asyncHandler(async (req, res) => {
  // Use .populate to get full food item details for a single plan view
  const plan = await MealPlanTemplate.findById(req.params.id).populate(
    'days.foodItems.foodItem'
  );

  if (!plan) {
    throw createHttpError(404, 'Meal plan not found');
  }

  res.json({
    success: true,
    data: plan
  });
});

// --- Create Operation ---

const createCustomMealPlan = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { name, description, goalType, days, tips, calorieTarget, macroSplit } = req.body;

  const plan = await MealPlanTemplate.create({
    name,
    description,
    goalType,
    days,
    tips,
    calorieTarget,
    macroSplit,
    // Model pre-save hook handles setting isPublished: false and metadata.sourceType: 'community'
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Custom meal plan created successfully',
    data: plan
  });
});

// --- Update Operation ---

const updateMealPlan = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  // req.plan is attached by authorizeCustomPlanOwner middleware
  const plan = req.plan; 
  
  // 🚫 Security: Prevent users from manipulating sensitive fields
  delete req.body.isPublished;
  delete req.body.metadata; 
  delete req.body.createdBy;

  // Use findByIdAndUpdate to apply changes
  const updatedPlan = await MealPlanTemplate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true } // Return new doc and run schema validators
  ).populate('days.foodItems.foodItem');

  res.json({
    success: true,
    message: 'Meal plan updated successfully',
    data: updatedPlan
  });
});

// --- Delete Operation ---

const deleteMealPlan = asyncHandler(async (req, res) => {
  // req.plan is attached by authorizeCustomPlanOwner middleware
  const plan = req.plan; 
  
  await plan.deleteOne(); // Use deleteOne() on the fetched document

  res.json({
    success: true,
    message: 'Meal plan deleted successfully'
  });
});

export { 
  listMealPlans, 
  getMealPlan, 
  createCustomMealPlan, 
  updateMealPlan, 
  deleteMealPlan, 
  customPlanValidationRules,
  authorizeCustomPlanOwner 
};