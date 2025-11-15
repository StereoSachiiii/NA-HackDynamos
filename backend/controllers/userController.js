import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import createHttpError from '../utils/createHttpError.js';
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from '../utils/token.js';
import { ADMIN_EMAILS } from '../config/constants.js';

// --- Validation Rules ---

const registerValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const refreshValidationRules = [
  body('refreshToken').notEmpty().withMessage('refreshToken is required')
];

const resetRequestValidationRules = [
  body('email').isEmail().withMessage('Valid email is required')
];

const resetPasswordValidationRules = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const updateProfileValidationRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('preferredLanguage').optional().isString().withMessage('Invalid language format'),
  // Password changes should typically use a separate, dedicated route for security
];

// --- Utility Functions ---

const formatUserResponse = user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  demographics: user.demographics,
  lifestyle: user.lifestyle,
  preferredLanguage: user.preferredLanguage,
  themeMode: user.themeMode,
  preferences: {
    language: user.preferredLanguage,
    themeMode: user.themeMode
  },
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const assignRole = email =>
  (ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user');

const issueTokens = async user => {
  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });
  await user.addRefreshToken(refreshToken);

  return { accessToken, refreshToken };
};

// --- Controllers (CRUD & Auth) ---

/**
 * @desc Register a new user
 * @route POST /api/v1/users/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, preferredLanguage, themeMode } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'User already exists');
  }

  // Normalize preferredLanguage to lowercase to match enum
  const normalizedLanguage = preferredLanguage 
    ? preferredLanguage.toLowerCase() 
    : undefined;

  const user = await User.create({
    name,
    email,
    password,
    preferredLanguage: normalizedLanguage,
    themeMode,
    role: assignRole(email)
  });

  const tokens = await issueTokens(user);

  res.status(201).json({
    success: true,
    tokens,
    user: formatUserResponse(user)
  });
});

/**
 * @desc Authenticate user & get token
 * @route POST /api/v1/users/login
 * @access Public
 */
const authUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  // Check MongoDB connection before attempting login
  const mongoose = (await import('mongoose')).default;
  if (mongoose.connection.readyState !== 1) {
    throw createHttpError(503, 'Database connection required. Please check MongoDB connection and ensure your IP address is whitelisted in MongoDB Atlas.');
  }

  const { email, password } = req.body;

  // Use select('+password') to retrieve the password hash
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const tokens = await issueTokens(user);

  res.json({
    success: true,
    tokens,
    user: formatUserResponse(user)
  });
});

/**
 * @desc Get user profile
 * @route GET /api/v1/users/profile
 * @access Private
 */
const getProfile = asyncHandler(async (req, res) => {
  // req.user is set by the 'protect' middleware after JWT verification
  res.json({
    success: true,
    user: formatUserResponse(req.user)
  });
});

/**
 * @desc Update user profile (Partial Update)
 * @route PATCH /api/v1/users/profile
 * @access Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { name, email, demographics, lifestyle, preferredLanguage, themeMode } = req.body;
  const user = req.user; // User from protect middleware

  // Update fields if provided
  if (name) user.name = name;
  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw createHttpError(409, 'Email address is already in use');
    }
    user.email = email;
    user.role = assignRole(email); // Re-assign role if email changes
  }
  if (demographics) user.demographics = { ...user.demographics, ...demographics };
  if (lifestyle) user.lifestyle = { ...user.lifestyle, ...lifestyle };
  if (preferredLanguage) user.preferredLanguage = preferredLanguage.toLowerCase();
  if (themeMode) user.themeMode = themeMode;

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: formatUserResponse(updatedUser)
  });
});

/**
 * @desc Delete user profile (Account Deletion)
 * @route DELETE /api/v1/users/profile
 * @access Private
 */
const deleteProfile = asyncHandler(async (req, res) => {
  // We use req.user.id provided by the 'protect' middleware
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) {
    throw createHttpError(404, 'User not found'); // Should not happen if protect works
  }

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

/**
 * @desc Refresh Access Token using Refresh Token
 * @route POST /api/v1/users/refresh
 * @access Public
 */
const refreshTokens = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { refreshToken } = req.body;
  let decoded;

  try {
    decoded = verifyToken(refreshToken);
  } catch (error) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  // Check if the token exists in the user's valid token list (atomic check)
  const tokenExists = user.refreshTokens.some(
    entry => entry.token === refreshToken
  );

  if (!tokenExists) {
    // If an invalid token is used, clear all tokens for security (token rotation failure)
    await user.clearRefreshTokens();
    throw createHttpError(401, 'Refresh token revoked or compromised');
  }

  // Use atomic operation to revoke token and prevent race conditions
  // This ensures only one refresh request can succeed with the same token
  const updateResult = await User.findByIdAndUpdate(
    decoded.id,
    {
      $pull: { refreshTokens: { token: refreshToken } }
    },
    { new: true }
  );

  if (!updateResult) {
    throw createHttpError(401, 'User not found');
  }

  // Reload user to get updated refreshTokens array
  const updatedUser = await User.findById(decoded.id);
  
  // Issue new tokens
  const tokens = await issueTokens(updatedUser);

  res.json({
    success: true,
    tokens
  });
});

/**
 * @desc Logout user (revoke provided refresh token)
 * @route POST /api/v1/users/logout
 * @access Public (token can be sent from client, optional)
 */
const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    try {
      const decoded = verifyToken(refreshToken);
      const user = await User.findById(decoded.id);
      if (user) {
        await user.revokeRefreshToken(refreshToken);
      }
    } catch (error) {
      // Ignore token errors on logout, just proceed with success message
    }
  }

  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * @desc Request password reset token
 * @route POST /api/v1/users/password/forgot
 * @access Public
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Important security measure: return a generic success message even if the user doesn't exist
    return res.json({ success: true, message: 'If account exists, reset instructions have been sent to email.' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiry
  await user.save();

  // IMPORTANT: In a real app, you would integrate an email service here.
  // const resetUrl = `https://your-app.com/reset-password?token=${resetToken}`;
  // await sendEmail(user.email, 'Password Reset', `Click here to reset: ${resetUrl}`);
  
  // For development/testing, we log or return a generic message:
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`Password Reset Token for ${user.email}: ${resetToken}`);
  }

  res.json({
    success: true,
    message: 'If account exists, reset instructions have been sent to email.'
  });
});

/**
 * @desc Reset password using token
 * @route POST /api/v1/users/password/reset
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  }).select('+password'); // Need password field to save new hash

  if (!user) {
    throw createHttpError(400, 'Invalid or expired reset token');
  }

  user.password = password; // Hashed by pre-save hook
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Log the user back in by issuing new tokens
  const tokens = await issueTokens(user);

  res.json({
    success: true,
    message: 'Password updated successfully',
    tokens
  });
});

export {
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
};