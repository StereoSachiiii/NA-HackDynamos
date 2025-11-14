import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/adminMiddleware.js';
import {
  listCollections,
  upsertFoodItem,
  upsertGoalProfile,
  upsertTip,
  removeDocument
} from '../controllers/adminController.js';
import FoodItem from '../models/FoodItem.js';
import GoalProfile from '../models/GoalProfile.js';
import Tip from '../models/Tip.js';

const router = Router();

router.use(protect, requireAdmin);

router.get('/stats', listCollections);

router
  .route('/foods/:id?')
  .post(upsertFoodItem)
  .put(upsertFoodItem)
  .delete(removeDocument(FoodItem, 'Food item'));

router
  .route('/goals/:id?')
  .post(upsertGoalProfile)
  .put(upsertGoalProfile)
  .delete(removeDocument(GoalProfile, 'Goal profile'));

router
  .route('/tips/:id?')
  .post(upsertTip)
  .put(upsertTip)
  .delete(removeDocument(Tip, 'Tip'));

export default router;

