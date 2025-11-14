import { NODE_ENV } from '../config/constants.js';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(message, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;

