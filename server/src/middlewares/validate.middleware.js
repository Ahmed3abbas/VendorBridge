import { sendError } from '../utils/apiResponse.js';

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const fields = result.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return sendError(res, 422, 'VALIDATION_ERROR', 'Validation failed', fields);
  }
  req.body = result.data;
  next();
};

export default validate;
