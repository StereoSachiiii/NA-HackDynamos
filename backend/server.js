import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import responseTime from 'response-time';

import connectDB, { getConnectionStatus } from './config/db.js';
import {
  APP_NAME,
  NODE_ENV,
  PORT,
  CORS_OPTIONS,
  RATE_LIMIT_OPTIONS
} from './config/constants.js';
import logger from './utils/logger.js';
import apiRouter from './routes/api.js';
import notFoundHandler from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { registerSchedulers } from './services/schedulerService.js';

const app = express();
const metrics = {
  totalRequests: 0,
  avgResponseTime: 0
};

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(CORS_OPTIONS));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit(RATE_LIMIT_OPTIONS));
app.use(
  responseTime((_req, _res, time) => {
    metrics.totalRequests += 1;
    metrics.avgResponseTime =
      (metrics.avgResponseTime * (metrics.totalRequests - 1) + time) /
      metrics.totalRequests;
  })
);

const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: message => logger.http(message.trim())
    }
  })
);

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: APP_NAME,
    environment: NODE_ENV,
    database: getConnectionStatus() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', (_req, res) => {
  res.json({
    success: true,
    data: metrics
  });
});

app.use('/api/v1', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    registerSchedulers();
  } else {
    logger.warn('Starting server without database connection...');
  }

  const server = app.listen(PORT, () => {
    logger.info(`${APP_NAME} running on port ${PORT} in ${NODE_ENV} mode`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
    logger.info(`API endpoint: http://localhost:${PORT}/api/v1`);
    if (!dbConnected) {
      logger.warn('⚠️  Database is not connected - some endpoints may not work');
    }
  });

  server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use!`);
      logger.error('\nTo fix this, choose one of these options:');
      logger.error(`1. Find and stop the process using port ${PORT}:`);
      logger.error(`   Windows: netstat -ano | findstr :${PORT}`);
      logger.error(`   Then kill it: taskkill /PID <PID> /F`);
      logger.error(`2. Change PORT in .env file to a different port (e.g., ${PORT + 1})`);
      logger.error('3. Close any other terminal windows running the server');
      process.exit(1);
    } else {
      logger.error('Server error:', error);
      process.exit(1);
    }
  });
};

startServer().catch(error => {
  logger.error('Failed to start server', error);
  // Only exit on critical errors, not DB connection errors
  if (error.code !== 'EAUTH' && !error.message?.includes('bad auth')) {
    process.exit(1);
  }
});

