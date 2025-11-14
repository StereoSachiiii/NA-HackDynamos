import { Router } from 'express';
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

const router = Router();

// --- Auth Endpoints (Public) ---
router.post('/register', registerValidationRules, registerUser);
router.post('/login', loginValidationRules, authUser);
router.post('/refresh', refreshValidationRules, refreshTokens);
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