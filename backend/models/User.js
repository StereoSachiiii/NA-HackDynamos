import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME_MODE,
  SUPPORTED_LANGUAGES
} from '../config/constants.js';

// Defines the duration (in milliseconds) a refresh token is valid before it's pruned.
// Example: 30 days
const REFRESH_TOKEN_VALIDITY_MS = 30 * 24 * 60 * 60 * 1000; 

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // Never send the password hash by default
    },
    demographics: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    lifestyle: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    preferredLanguage: {
      type: String,
      enum: SUPPORTED_LANGUAGES,
      default: DEFAULT_LANGUAGE
    },
    themeMode: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: DEFAULT_THEME_MODE
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    refreshTokens: {
      type: [
        {
          token: String,
          createdAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

// Instance Method to compare passwords
userSchema.methods.matchPassword = async function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Instance Method to add a new refresh token and prune old ones
userSchema.methods.addRefreshToken = async function addRefreshToken(token) {
  const expiryTime = Date.now() - REFRESH_TOKEN_VALIDITY_MS;

  // 1. Prune expired tokens (security/cleanup)
  this.refreshTokens = this.refreshTokens.filter(
    entry => entry.createdAt.getTime() > expiryTime
  );

  // 2. Add the new token
  this.refreshTokens.push({ token });
  await this.save();
};

// Instance Method to revoke a single refresh token
userSchema.methods.revokeRefreshToken = async function revokeRefreshToken(token) {
  this.refreshTokens = this.refreshTokens.filter(entry => entry.token !== token);
  await this.save();
};

// Instance Method to clear all refresh tokens (e.g., on suspicious activity or logout all)
userSchema.methods.clearRefreshTokens = async function clearRefreshTokens() {
  this.refreshTokens = [];
  await this.save();
};

// Ensures password is not sent in the response when converting to JSON
userSchema.methods.toJSON = function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;