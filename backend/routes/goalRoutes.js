import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  goalValidationRules,
  createGoal,
  listGoals,
  getActiveGoal,
  getGoal,
  updateGoal,
  deleteGoal,
  getGoalById
} from '../controllers/goalController.js';

const router = Router();

// Routes protected by authentication
router.use(protect);

// Routes for listing all and creating a new goal (base route: /)
router
  .route('/')
  .get(listGoals) // GET /api/v1/goals (List all goals)
  .post(goalValidationRules, createGoal); // POST /api/v1/goals (Create new goal)

// Specialized route for the current goal
router.get('/active', getActiveGoal); // GET /api/v1/goals/active

// Routes for individual goal entries (route: /:id)
router
  .route('/:id')
  .get(getGoalById, getGoal) // GET /api/v1/goals/:id (Get single goal)
  .put(getGoalById, goalValidationRules, updateGoal) // PUT /api/v1/goals/:id (Update single goal)
  .delete(getGoalById, deleteGoal); // DELETE /api/v1/goals/:id (Delete single goal)

export default router;