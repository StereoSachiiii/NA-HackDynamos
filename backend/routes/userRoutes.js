import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerValidationRules,
  loginValidationRules,
  refreshValidationRules,
  resetRequestValidationRules,
  resetPasswordValidationRules,
  updateProfileValidationRules,
  registerUser,
  authUser,
  getProfile,
  updateProfile, // NEW
  deleteProfile, // NEW
  refreshTokens,
  logoutUser,
  requestPasswordReset,
  resetPassword
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { AUTH_RATE_LIMIT_OPTIONS } from '../config/constants.js';

const router = Router();

// Apply more lenient rate limiting to auth routes
// In development, create a very lenient limiter or skip entirely
const authRateLimiter = rateLimit(AUTH_RATE_LIMIT_OPTIONS);

// In development, we can optionally skip rate limiting for testing
const applyRateLimit = (req, res, next) => {
  // Skip rate limiting in development if explicitly disabled
  if (process.env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true') {
    return next();
  }
  return authRateLimiter(req, res, next);
};

// --- Auth Endpoints (Public) ---
router.post('/register', applyRateLimit, registerValidationRules, registerUser);
router.post('/login', applyRateLimit, loginValidationRules, authUser);
router.post('/refresh', applyRateLimit, refreshValidationRules, refreshTokens);
router.post('/logout', logoutUser); // Requires refresh token in body to revoke

// --- Password Reset Endpoints (Public) ---
router.post('/password/forgot', resetRequestValidationRules, requestPasswordReset);
router.post('/password/reset', resetPasswordValidationRules, resetPassword);

// --- Profile Endpoints (Protected) ---
// R: Get Profile
router.get('/profile', protect, getProfile);

// U: Update Profile (using PATCH for partial updates)
router.patch('/profile', protect, updateProfileValidationRules, updateProfile);

// D: Delete Account
router.delete('/profile', protect, deleteProfile);

export default router;