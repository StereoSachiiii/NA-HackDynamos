import cron from 'node-cron';
import logger from '../utils/logger.js';
import MealLog from '../models/MealLog.js';
import { createMacroInsight } from './insightService.js';

const registerInsightJob = () => {
  cron.schedule('30 20 * * *', async () => {
    logger.info('Running nightly insight job');
    const logs = await MealLog.find({
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const grouped = logs.reduce((acc, log) => {
      acc[log.user] = acc[log.user] || [];
      acc[log.user].push(log);
      return acc;
    }, {});

    await Promise.all(
      Object.entries(grouped).map(async ([userId, userLogs]) => {
        const summary = userLogs.reduce(
          (acc, log) => ({
            protein: (acc.protein || 0) + (log.summaryCache?.protein || 0),
            carbs: (acc.carbs || 0) + (log.summaryCache?.carbs || 0),
            fat: (acc.fat || 0) + (log.summaryCache?.fat || 0)
          }),
          {}
        );

        await createMacroInsight({ userId, summary });
      })
    );
  });
};

const registerSchedulers = () => {
  registerInsightJob();
  logger.info('Background schedulers registered');
};

export { registerSchedulers };


