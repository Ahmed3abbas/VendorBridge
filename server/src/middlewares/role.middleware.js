import AppError from '../utils/AppError.js';

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError('Forbidden: insufficient permissions', 403, 'FORBIDDEN'));
  }
  next();
};

export default requireRole;
