import jwt from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '../config/constants.js';

const generateAccessToken = payload =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

const generateRefreshToken = payload =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });

const verifyToken = token => jwt.verify(token, JWT_SECRET);

export { generateAccessToken, generateRefreshToken, verifyToken };

