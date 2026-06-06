export const successResponse = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });

export const paginatedResponse = (res, data, pagination) =>
  res.status(200).json({ success: true, data, pagination });
