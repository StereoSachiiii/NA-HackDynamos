import createHttpError from '../utils/createHttpError.js';

const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw createHttpError(403, 'Admin access required');
  }

  next();
};

export default requireAdmin;


