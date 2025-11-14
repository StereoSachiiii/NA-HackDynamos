/* eslint-disable no-console */
const levelToConsoleMethod = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  http: 'log',
  debug: 'log'
};

const levels = Object.keys(levelToConsoleMethod);

const createLogger = () => {
  const logger = {};

  levels.forEach(level => {
    logger[level] = (...args) => {
      const timestamp = new Date().toISOString();
      const method = levelToConsoleMethod[level] || 'log';
      console[method](`[${timestamp}] [${level.toUpperCase()}]`, ...args);
    };
  });

  return logger;
};

const logger = createLogger();

export default logger;

