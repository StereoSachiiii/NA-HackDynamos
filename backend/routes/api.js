import { Router } from 'express';
import userRoutes from './userRoutes.js';
import foodRoutes from './foodRoutes.js';
import goalRoutes from './goalRoutes.js';
import mealPlanRoutes from './mealPlanRoutes.js';
import logRoutes from './logRoutes.js';
import adminRoutes from './adminRoutes.js';
import tipsRoutes from './tipsRoutes.js';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ success: true, message: 'API v1 running' });
});

apiRouter.use('/users', userRoutes);
apiRouter.use('/foods', foodRoutes);
apiRouter.use('/goals', goalRoutes);
apiRouter.use('/meal-plans', mealPlanRoutes);
apiRouter.use('/logs', logRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/tips', tipsRoutes);

export default apiRouter;

