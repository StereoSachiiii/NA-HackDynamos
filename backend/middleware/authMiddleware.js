import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import createHttpError from '../utils/createHttpError.js';
import { JWT_SECRET } from '../config/constants.js';
import { getConnectionStatus } from '../config/db.js';
import mongoose from 'mongoose';

const protect = asyncHandler(async (req, _res, next) => {
  // Check if MongoDB is connected before attempting database operations
  const isConnected = getConnectionStatus() || mongoose.connection.readyState === 1;
  
  if (!isConnected) {
    throw createHttpError(503, 'Service unavailable: Database connection required. Please check MongoDB connection and IP whitelist.');
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createHttpError(401, 'Not authorized, token missing');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check connection again before query
    if (mongoose.connection.readyState !== 1) {
      throw createHttpError(503, 'Database connection lost. Please try again.');
    }
    
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createHttpError(401, 'Not authorized, user not found');
    }

    req.user = user;
    req.context = {
      ...(req.context || {}),
      language: user.preferredLanguage,
      themeMode: user.themeMode
    };

    next();
  } catch (error) {
    // If it's already an HTTP error, re-throw it
    if (error.statusCode) {
      throw error;
    }
    // If it's a MongoDB connection error, provide helpful message
    if (error.name === 'MongooseError' || error.message?.includes('buffering')) {
      throw createHttpError(503, 'Database connection error. Please ensure MongoDB is connected and your IP is whitelisted.');
    }
    // Otherwise, it's a JWT error
    throw createHttpError(401, 'Not authorized, token invalid');
  }
});

export { protect };

