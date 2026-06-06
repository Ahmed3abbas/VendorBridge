import logger from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  if (status >= 500) logger.error(err.message, { stack: err.stack, path: req.path });

  res.status(status).json({
    success: false,
    error: { code, message: err.isOperational ? err.message : 'Internal server error' },
  });
}
