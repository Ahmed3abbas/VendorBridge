export const successResponse = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });

export const paginatedResponse = (res, data, pagination) =>
  res.status(200).json({ success: true, data, pagination });

// M2 aliases
export const sendSuccess = (res, data, message = 'Success', statusCode = 200, pagination = null) => {
  const body = { success: true, message, data };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
};

export const sendError = (res, statusCode = 500, code = 'INTERNAL_ERROR', message = 'Something went wrong', fields = null) => {
  const body = { success: false, error: { code, message } };
  if (fields) body.error.fields = fields;
  return res.status(statusCode).json(body);
};
