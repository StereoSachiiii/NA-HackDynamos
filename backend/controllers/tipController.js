import { body, validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import createHttpError from '../utils/createHttpError.js';
import Tip from '../models/Tip.js';
import NutritionGoal from '../models/NutritionGoal.js';
import GoalProfile from '../models/GoalProfile.js';

// --- Validation Rules for CREATE/UPDATE ---
const tipValidationRules = [
  body('key').trim().notEmpty().withMessage('Tip key is required'),
  body('defaultMessage').trim().notEmpty().withMessage('Default message is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

// Middleware to check if the tip exists and attach it to the request (for GET/PUT/DELETE)
const getTipById = asyncHandler(async (req, res, next) => {
  const tip = await Tip.findById(req.params.id);

  if (!tip) {
    throw createHttpError(404, 'Tip not found');
  }
  req.tip = tip;
  next();
});

// Helper to get localized message from Tip model structure
const getLocalizedMessage = (tip, language) => {
  if (!tip || !tip.localizedMessages || tip.localizedMessages.length === 0) {
    return tip?.defaultMessage || '';
  }

  const normalizedLang = language?.toUpperCase() || 'EN';
  
  // Find message for requested language
  const localizedMsg = tip.localizedMessages.find(
    msg => msg.language?.toUpperCase() === normalizedLang
  );
  
  if (localizedMsg) {
    return localizedMsg.message;
  }
  
  // Fallback to EN if available
  const enMsg = tip.localizedMessages.find(
    msg => msg.language?.toUpperCase() === 'EN'
  );
  
  if (enMsg) {
    return enMsg.message;
  }
  
  // Fallback to first available message
  return tip.localizedMessages[0]?.message || tip.defaultMessage || '';
};

// Helper to format the response (including localization)
const formatTipResponse = (tip, language) => ({
  id: tip.id,
  key: tip.key,
  message: getLocalizedMessage(tip, language), // Localized message
  triggerEvent: tip.triggerEvent,
  seasonTag: tip.seasonTag,
  isActive: tip.isActive,
  uiHints: tip.uiHints,
  createdAt: tip.createdAt,
  // Note: Only expose localization details to admin/management views, not general user views
  allMessages: tip.localizedMessages || [], 
});

// @desc    Create a new Tip
// @route   POST /api/v1/tips
// @access  Private (Admin/Manager role assumed for CRUD)
const createTip = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const tip = await Tip.create(req.body);

  res.status(201).json({
    success: true,
    data: formatTipResponse(tip, req.context?.language),
  });
});

// @desc    Get all Tips (can filter by status/tag)
// @route   GET /api/v1/tips
// @access  Private (Admin/Manager)
const listTips = asyncHandler(async (req, res) => {
  const { isActive, seasonTag, triggerEvent } = req.query;
  const query = {};

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  if (seasonTag) {
    query.seasonTag = seasonTag;
  }
  if (triggerEvent) {
    query.triggerEvent = triggerEvent;
  }

  const tips = await Tip.find(query).sort({ key: 1 });

  res.json({
    success: true,
    count: tips.length,
    data: tips.map(tip => formatTipResponse(tip, req.context?.language)),
  });
});

// @desc    Get a single Tip
// @route   GET /api/v1/tips/:id
// @access  Private (Admin/Manager)
const getTip = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: formatTipResponse(req.tip, req.context?.language),
  });
});

// @desc    Update a Tip
// @route   PUT /api/v1/tips/:id
// @access  Private (Admin/Manager)
const updateTip = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const updatedTip = await Tip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: formatTipResponse(updatedTip, req.context?.language),
  });
});

// @desc    Delete a Tip
// @route   DELETE /api/v1/tips/:id
// @access  Private (Admin/Manager)
const deleteTip = asyncHandler(async (req, res) => {
  await req.tip.deleteOne();

  res.status(204).json({
    success: true,
    data: {},
  });
});

// @desc    Get personalized tips for the authenticated user
// @route   GET /api/v1/tips/personalized
// @access  Private
const getPersonalizedTips = asyncHandler(async (req, res) => {
  const userLanguage = req.user?.preferredLanguage || req.context?.language || 'EN';
  
  // Get user's active goals
  const activeGoals = await NutritionGoal.find({ 
    user: req.user.id, 
    isActive: true 
  }).sort({ createdAt: -1 });

  let personalizedTips = [];
  let generalTips = [];
  
  if (activeGoals.length > 0) {
    // Get goal types and season tags from active goals
    const goalTypes = activeGoals.map(goal => goal.goalType.toLowerCase());
    const goalProfiles = await GoalProfile.find({ name: { $in: activeGoals.map(g => g.goalType) } });
    const seasonTags = goalProfiles.map(profile => profile.seasonTag).filter(Boolean);
    
    // Build query for personalized tips
    const personalizedQuery = {
      isActive: true,
      $or: [
        { triggerEvent: { $in: goalTypes } },
        { seasonTag: { $in: seasonTags } }
      ]
    };
    
    personalizedTips = await Tip.find(personalizedQuery)
      .sort({ createdAt: -1 })
      .limit(20);
  }
  
  // Get general tips (all active tips not in personalized)
  const personalizedTipIds = personalizedTips.map(t => t._id);
  const generalQuery = {
    isActive: true,
    ...(personalizedTipIds.length > 0 ? { _id: { $nin: personalizedTipIds } } : {})
  };
  
  generalTips = await Tip.find(generalQuery)
    .sort({ createdAt: -1 })
    .limit(20);
  
  // Format all tips with localization
  const formatTips = (tips) => tips.map(tip => formatTipResponse(tip, userLanguage));
  
  res.json({
    success: true,
    data: {
      personalized: formatTips(personalizedTips),
      general: formatTips(generalTips),
      all: formatTips([...personalizedTips, ...generalTips])
    },
    meta: {
      personalizedCount: personalizedTips.length,
      generalCount: generalTips.length,
      totalCount: personalizedTips.length + generalTips.length,
      hasActiveGoals: activeGoals.length > 0
    }
  });
});

export {
  tipValidationRules,
  createTip,
  listTips,
  getTip,
  updateTip,
  deleteTip,
  getTipById,
  getPersonalizedTips,
};