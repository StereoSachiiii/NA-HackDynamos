import { Router } from 'express';
import {
  listMealPlans,
  getMealPlan,
  createCustomMealPlan,
  updateMealPlan,
  deleteMealPlan,
  customPlanValidationRules,
  authorizeCustomPlanOwner
} from '../controllers/mealPlanController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assumes 'protect' middleware exists for authentication

const router = Router();

// GET /api/mealplans
router.get('/', listMealPlans); 
// GET /api/mealplans/:id
router.get('/:id', getMealPlan); 

// POST /api/mealplans/custom
router.post(
  '/custom',
  protect, // 1. User must be logged in
  customPlanValidationRules, // 2. Validate request body
  createCustomMealPlan
);

// PUT /api/mealplans/:id
router.put(
  '/:id',
  protect, // 1. User must be logged in
  authorizeCustomPlanOwner, // 2. User must own the custom plan
  customPlanValidationRules, // 3. Validate request body
  updateMealPlan
);

// DELETE /api/mealplans/:id
router.delete(
  '/:id',
  protect, // 1. User must be logged in
  authorizeCustomPlanOwner, // 2. User must own the custom plan
  deleteMealPlan
);

export default router;