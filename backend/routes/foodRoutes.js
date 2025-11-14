import { Router } from 'express';
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  bulkCreateFoods
} from '../controllers/foodController.js';

const router = Router();

// GET all foods (with filtering and search)
router.get('/', getFoods);

// GET single food by ID
router.get('/:id', getFoodById);

// POST create new food
router.post('/', createFood);

// POST bulk create foods from an array
router.post('/bulk', bulkCreateFoods);

// PUT update food (full update)
router.put('/:id', updateFood);

// PATCH update food (partial update)
router.patch('/:id', updateFood);

// DELETE food
router.delete('/:id', deleteFood);

export default router;