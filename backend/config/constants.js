import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App
const APP_NAME = 'Nutrition Advisor API';
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URLS = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim());

// MongoDB
const MONGO_URI = process.env.MONGO_URI;

// JWT - ALL variations
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

// Admin
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim())
  .filter(email => email.length > 0);

// File Upload
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg')
  .split(',')
  .map(type => type.trim());

// Reminders
const REMINDER_CUTOFF_HOURS = Number(process.env.REMINDER_CUTOFF_HOURS) || 24;

// Language and Theme settings
const DEFAULT_LANGUAGE = (process.env.DEFAULT_LANGUAGE || 'EN').toLowerCase();
const SUPPORTED_LANGUAGES = (process.env.SUPPORTED_LANGUAGES || 'EN,SI,TA')
  .split(',')
  .map(lang => lang.trim().toLowerCase());
const DEFAULT_THEME_MODE = process.env.DEFAULT_THEME_MODE || 'system';

// Cookies
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'localhost';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true' || NODE_ENV === 'production';
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || (NODE_ENV === 'production' ? 'Strict' : 'Lax');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAME_SITE,
  domain: COOKIE_DOMAIN
};

// Rate Limiting
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
// Increase limit for development, reduce for production
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || (NODE_ENV === 'production' ? 100 : 5000);

const RATE_LIMIT_OPTIONS = {
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    // Skip rate limiting for health checks and metrics
    return req.path === '/health' || req.path === '/metrics';
  }
};

// More lenient rate limit for auth routes (login/register)
// In development, allow many attempts; in production, be more strict
const AUTH_RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 20 : 500, // 20 attempts per 15 min in prod, 500 in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful logins
  // In development, use a separate store that resets on server restart
  store: NODE_ENV === 'development' ? undefined : undefined // Use default in-memory store
};

// CORS
const CORS_OPTIONS = {
  origin: CLIENT_URLS,
  credentials: true
};

// Logging
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// API URLs
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// Export EVERYTHING
export {
  // App
  APP_NAME,
  NODE_ENV,
  PORT,
  CLIENT_URLS,
  API_BASE_URL,
  
  // MongoDB
  MONGO_URI,
  
  // JWT - all variants
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  
  // Admin
  ADMIN_EMAILS,
  
  // File Upload
  UPLOAD_DIR,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  
  // Reminders
  REMINDER_CUTOFF_HOURS,
  
  // Language & Theme
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  DEFAULT_THEME_MODE,
  
  // Cookies
  COOKIE_DOMAIN,
  COOKIE_SECURE,
  COOKIE_SAME_SITE,
  COOKIE_OPTIONS,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_OPTIONS,
  AUTH_RATE_LIMIT_OPTIONS,
  
  // CORS
  CORS_OPTIONS,
  
  // Logging
  LOG_LEVEL
};