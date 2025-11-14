import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import createHttpError from '../utils/createHttpError.js';
import { JWT_SECRET } from '../config/constants.js';

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createHttpError(401, 'Not authorized, token missing');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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
    throw createHttpError(401, 'Not authorized, token invalid');
  }
});

export { protect };

