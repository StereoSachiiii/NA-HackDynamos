import { body, validationResult } from 'express-validator';
import MealLog from '../models/MealLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import createHttpError from '../utils/createHttpError.js';
import { computeSummary, aggregateDailySummary } from '../services/nutritionSummaryService.js';
import { createMacroInsight, getInsightsForUser } from '../services/insightService.js';
import { persistPhotoPlaceholder, processPhotoAsync } from '../services/photoService.js';
import { getReminders } from '../services/reminderService.js';

// --- Validation Rules for CREATE/UPDATE ---
const mealLogValidationRules = [
  body('mealType')
    .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Supper'])
    .withMessage('Valid mealType required'),
  body('date').optional().isISO8601().toDate(),
  body('foodEntries').isArray({ min: 1 }).withMessage('foodEntries required'),
  body('foodEntries.*.foodItem')
    .notEmpty()
    .withMessage('foodItem reference required')
];

// Middleware to check if the log entry exists and belongs to the user
const getMealLogById = asyncHandler(async (req, res, next) => {
  const log = await MealLog.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate('foodEntries.foodItem'); // Populate for a richer GET response

  if (!log) {
    throw createHttpError(404, 'Meal log entry not found');
  }
  req.log = log; // Attach the log to the request object
  next();
});

// @desc    Create a new meal log
// @route   POST /api/v1/logs
// @access  Private
const createMealLog = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { mealType, date, foodEntries, notes } = req.body;

  const log = await MealLog.create({
    user: req.user.id,
    mealType,
    date: date || new Date(),
    foodEntries,
    notes
  });

  log.summaryCache = await computeSummary(log);
  await log.save();

  await createMacroInsight({
    userId: req.user.id,
    summary: log.summaryCache,
    language: req.context?.language
  });

  res.status(201).json({
    success: true,
    data: log
  });
});

// @desc    Get a single meal log entry
// @route   GET /api/v1/logs/:id
// @access  Private
const getMealLog = asyncHandler(async (req, res) => {
  // log is retrieved and attached to req by getMealLogById middleware
  res.json({
    success: true,
    data: req.log
  });
});

// @desc    Update a single meal log entry
// @route   PUT /api/v1/logs/:id
// @access  Private
const updateMealLog = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const log = req.log; // Retrieved by getMealLogById

  // Apply updates
  log.mealType = req.body.mealType || log.mealType;
  log.date = req.body.date || log.date;
  log.foodEntries = req.body.foodEntries || log.foodEntries;
  log.notes = req.body.notes ?? log.notes; // Use ?? to allow explicit null/empty string notes

  // Recompute summary
  log.summaryCache = await computeSummary(log);
  const updatedLog = await log.save();

  res.json({
    success: true,
    data: updatedLog
  });
});

// @desc    Delete a single meal log entry
// @route   DELETE /api/v1/logs/:id
// @access  Private
const deleteMealLog = asyncHandler(async (req, res) => {
  const log = req.log; // Retrieved by getMealLogById

  await log.deleteOne();

  res.status(204).json({
    success: true,
    data: {}
  });
});

// @desc    List all meal logs for the user
// @route   GET /api/v1/logs
// @access  Private
const listMealLogs = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  const query = { user: req.user.id };

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const logs = await MealLog.find(query)
    .sort({ date: -1 })
    .populate('foodEntries.foodItem');

  res.json({
    success: true,
    count: logs.length,
    data: logs
  });
});

// @desc    Get daily nutrition summary
// @route   GET /api/v1/logs/daily-summary
// @access  Private
const getDailySummary = asyncHandler(async (req, res) => {
  const date = req.query.date ? new Date(req.query.date) : new Date();
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  const logs = await MealLog.find({
    user: req.user.id,
    date: { $gte: start, $lte: end }
  });

  const summary = aggregateDailySummary(logs);

  res.json({
    success: true,
    date: start.toISOString(),
    summary
  });
});

// @desc    Upload meal photo for processing
// @route   POST /api/v1/logs/photo
// @access  Private
const uploadMealPhoto = asyncHandler(async (req, res) => {
  const { base64 } = req.body;
  if (!base64) {
    throw createHttpError(400, 'base64 image payload required');
  }

  const storedUrl = await persistPhotoPlaceholder(base64);
  const processingResult = await processPhotoAsync(base64);

  res.status(202).json({
    success: true,
    data: {
      photoUrl: storedUrl,
      status: processingResult.status,
      detectedItems: processingResult.detectedItems
    }
  });
});

// @desc    List user insights
// @route   GET /api/v1/logs/insights
// @access  Private
const listInsights = asyncHandler(async (req, res) => {
  const insights = await getInsightsForUser({
    userId: req.user.id,
    language: req.context?.language
  });

  res.json({
    success: true,
    data: insights
  });
});

// @desc    List user reminders
// @route   GET /api/v1/logs/reminders
// @access  Private
const listReminders = asyncHandler(async (req, res) => {
  const latestLog = await MealLog.findOne({ user: req.user.id }).sort({ date: -1 });
  const reminders = getReminders({
    lastMealAt: latestLog?.date,
    hasHighGlycemicMeal: latestLog?.summaryCache?.glycemicLoad > 15
  });

  res.json({
    success: true,
    data: reminders
  });
});

export {
  mealLogValidationRules,
  createMealLog,
  listMealLogs,
  getMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogById, // Exporting the middleware for use in routes
  getDailySummary,
  uploadMealPhoto,
  listInsights,
  listReminders
};