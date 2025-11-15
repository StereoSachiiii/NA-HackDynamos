import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you use this
import {
  tipValidationRules,
  createTip,
  listTips,
  getTip,
  updateTip,
  deleteTip,
  getTipById,
  getPersonalizedTips,
} from '../controllers/tipController.js';

const router = Router();

// Apply protection middleware to all routes (assuming admin/manager access is required)
router.use(protect);

// Personalized tips route (must be before /:id route)
router.get('/personalized', getPersonalizedTips); // GET /api/v1/tips/personalized

// Base route for listing and creating tips
router
  .route('/')
  .get(listTips) // GET /api/v1/tips (List all tips)
  .post(tipValidationRules, createTip); // POST /api/v1/tips (Create new tip)

// Routes for individual tip entries (using the ID middleware)
router
  .route('/:id')
  .get(getTipById, getTip) // GET /api/v1/tips/:id (Get single tip)
  .put(getTipById, tipValidationRules, updateTip) // PUT /api/v1/tips/:id (Update single tip)
  .delete(getTipById, deleteTip); // DELETE /api/v1/tips/:id (Delete single tip)

export default router;