import { body, validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import createHttpError from '../utils/createHttpError.js';
import GoalProfile from '../models/GoalProfile.js';
import NutritionGoal from '../models/NutritionGoal.js';
import Tip from '../models/Tip.js';
import { pickLocalizedMessage } from '../services/localizationService.js';

// --- Validation Rules for CREATE/UPDATE ---
const goalValidationRules = [
  body('goalType').trim().notEmpty().withMessage('goalType is required').optional({ checkFalsy: true }),
  body('targetCalories').optional().isInt({ min: 100 }).withMessage('targetCalories must be a number'),
  body('targetMacroSplit').optional().isObject().withMessage('targetMacroSplit must be an object'),
  body('targetMacroSplit.protein').optional().isInt({ min: 0, max: 100 }),
  body('targetMacroSplit.carbs').optional().isInt({ min: 0, max: 100 }),
  body('targetMacroSplit.fat').optional().isInt({ min: 0, max: 100 })
];

// Helper to check if the goal exists and belongs to the user
const getGoalById = asyncHandler(async (req, res, next) => {
  const goal = await NutritionGoal.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!goal) {
    throw createHttpError(404, 'Nutrition goal not found');
  }
  req.goal = goal; // Attach the goal to the request object
  next();
});

// Helper functions (deriveCalories, deriveMacros, deriveUiHints, formatGoalResponse) remain unchanged
const deriveCalories = (requestedCalories, goalProfile) => {
  if (requestedCalories) {
    return requestedCalories;
  }

  if (!goalProfile?.calorieBand) {
    return 0;
  }

  const { min = 0, max = 0 } = goalProfile.calorieBand;
  return Math.round((min + max) / 2);
};

const deriveMacros = (targetMacroSplit, goalProfile) => {
  if (targetMacroSplit) {
    return targetMacroSplit;
  }

  return (
    goalProfile?.macroSplit || {
      protein: 25,
      carbs: 50,
      fat: 25
    }
  );
};

const deriveUiHints = (goalProfile, goalType, themeMode) => {
  if (goalProfile?.uiHints) {
    return goalProfile.uiHints;
  }

  return {
    palette: themeMode === 'dark' ? 'coconut-night' : 'sunrise',
    glyph: goalProfile?.seasonTag || 'lotus',
    messageKey: `goal.${goalType.toLowerCase()}`,
    emphasis: goalProfile?.cautionTags?.length ? 'alert' : 'default'
  };
};

const formatGoalResponse = goal => ({
  id: goal.id,
  goalType: goal.goalType,
  targetCalories: goal.targetCalories,
  targetMacroSplit: goal.targetMacroSplit,
  isActive: goal.isActive,
  uiHints: goal.uiHints,
  createdAt: goal.createdAt,
  updatedAt: goal.updatedAt
});

// @desc    Create a new nutrition goal
// @route   POST /api/v1/goals
// @access  Private
const createGoal = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { goalType, targetCalories, targetMacroSplit } = req.body;
  const goalProfile = await GoalProfile.findOne({ name: goalType });

  if (!goalProfile) {
    throw createHttpError(400, `Unknown goalType: ${goalType}`);
  }

  // Deactivate all existing goals
  await NutritionGoal.updateMany(
    { user: req.user.id, isActive: true },
    { isActive: false }
  );

  const goal = await NutritionGoal.create({
    user: req.user.id,
    goalType,
    targetCalories: deriveCalories(targetCalories, goalProfile),
    targetMacroSplit: deriveMacros(targetMacroSplit, goalProfile),
    uiHints: deriveUiHints(goalProfile, goalType, req.context?.themeMode)
  });

  const seasonalTips = await Tip.find({
    isActive: true,
    $or: [
      { triggerEvent: goalType.toLowerCase() },
      { seasonTag: goalProfile.seasonTag }
    ]
  }).limit(3);

  const localizedTips = seasonalTips.map(tip => ({
    key: tip.key,
    message: pickLocalizedMessage(tip, req.context?.language),
    uiHints: tip.uiHints
  }));

  res.status(201).json({
    success: true,
    data: formatGoalResponse(goal),
    context: {
      profile: goalProfile,
      cautionTags: goalProfile.cautionTags,
      uiHints: goal.uiHints,
      tips: localizedTips
    }
  });
});

// @desc    List all nutrition goals for the user
// @route   GET /api/v1/goals
// @access  Private
const listGoals = asyncHandler(async (req, res) => {
  const goals = await NutritionGoal.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: goals.length,
    data: goals.map(formatGoalResponse)
  });
});

// @desc    Get the active nutrition goal
// @route   GET /api/v1/goals/active
// @access  Private
const getActiveGoal = asyncHandler(async (req, res) => {
  const activeGoal = await NutritionGoal.findOne({ user: req.user.id, isActive: true });

  if (!activeGoal) {
    throw createHttpError(404, 'No active nutrition goal found');
  }

  res.json({
    success: true,
    data: formatGoalResponse(activeGoal)
  });
});


// @desc    Get a single nutrition goal entry
// @route   GET /api/v1/goals/:id
// @access  Private
const getGoal = asyncHandler(async (req, res) => {
  // Goal is retrieved and attached to req by getGoalById middleware
  res.json({
    success: true,
    data: formatGoalResponse(req.goal)
  });
});

// @desc    Update a single nutrition goal entry
// @route   PUT /api/v1/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const goal = req.goal; // Retrieved by getGoalById
  const { goalType, targetCalories, targetMacroSplit, isActive } = req.body;
  let goalProfile;

  // 1. Check if goalType is being updated and fetch new profile
  if (goalType && goalType !== goal.goalType) {
    goalProfile = await GoalProfile.findOne({ name: goalType });
    if (!goalProfile) {
      throw createHttpError(400, `Unknown goalType: ${goalType}`);
    }
    goal.goalType = goalType;
    // Re-derive UI Hints based on new GoalProfile
    goal.uiHints = deriveUiHints(goalProfile, goalType, req.context?.themeMode);
  } else {
    // Keep current profile if goalType is not changing or not provided
    goalProfile = await GoalProfile.findOne({ name: goal.goalType });
  }

  // 2. Update calories and macros, using helpers if needed
  if (targetCalories !== undefined) {
    goal.targetCalories = targetCalories;
  }
  if (targetMacroSplit !== undefined) {
    goal.targetMacroSplit = targetMacroSplit;
  }
  
  // 3. Handle isActive status
  if (isActive !== undefined) {
    if (isActive === true) {
      // Deactivate all others before setting this one active
      await NutritionGoal.updateMany(
        { user: req.user.id, isActive: true, _id: { $ne: goal._id } },
        { isActive: false }
      );
    }
    goal.isActive = isActive;
  }

  const updatedGoal = await goal.save();

  res.json({
    success: true,
    data: formatGoalResponse(updatedGoal)
  });
});

// @desc    Delete a single nutrition goal entry
// @route   DELETE /api/v1/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = req.goal; // Retrieved by getGoalById

  if (goal.isActive) {
    // Prevent deletion of the active goal to ensure continuity
    throw createHttpError(400, 'Cannot delete an active goal. Please activate another goal first.');
  }

  await goal.deleteOne();

  res.status(204).json({
    success: true,
    data: {}
  });
});

export {
  goalValidationRules,
  createGoal,
  listGoals,
  getActiveGoal,
  getGoal,
  updateGoal,
  deleteGoal,
  getGoalById
};