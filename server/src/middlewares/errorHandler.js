import { sendError } from '../utils/apiResponse.js';
import logger from '../config/logger.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (!err.isOperational) logger.error(err);
  const status = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  sendError(res, status, code, err.message || 'Something went wrong');
};

export default errorHandler;
