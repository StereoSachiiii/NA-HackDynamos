import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  mealLogValidationRules,
  createMealLog,
  listMealLogs,
  getMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogById, // Import the middleware
  getDailySummary,
  uploadMealPhoto,
  listInsights,
  listReminders
} from '../controllers/logController.js';

const router = Router();

// Apply protection middleware to all routes in this router
router.use(protect);

// Routes for listing all and creating a new log (base route: /)
router
  .route('/')
  .get(listMealLogs) // GET /api/v1/logs
  .post(mealLogValidationRules, createMealLog); // POST /api/v1/logs

// Routes for individual log entries (route: /:id)
router
  .route('/:id')
  .get(getMealLogById, getMealLog) // GET /api/v1/logs/:id
  .put(getMealLogById, mealLogValidationRules, updateMealLog) // PUT /api/v1/logs/:id
  .delete(getMealLogById, deleteMealLog); // DELETE /api/v1/logs/:id

// Specialized routes
router.get('/daily-summary', getDailySummary); // GET /api/v1/logs/daily-summary
router.post('/photo', uploadMealPhoto); // POST /api/v1/logs/photo
router.get('/insights', listInsights); // GET /api/v1/logs/insights
router.get('/reminders', listReminders); // GET /api/v1/logs/reminders

export default router;