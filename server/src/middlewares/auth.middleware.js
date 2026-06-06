import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) throw new AppError('No token provided', 401, 'UNAUTHORIZED');

  try {
    req.user = jwt.verify(auth.split(' ')[1], env.JWT_SECRET);
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401, 'UNAUTHORIZED');
  }
}
