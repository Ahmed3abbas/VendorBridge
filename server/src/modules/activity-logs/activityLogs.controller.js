import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { getLogs } from './activityLogs.service.js';

export const listLogs = asyncHandler(async (req, res) => {
  const { entityType, entityId, userId, page, limit } = req.query;
  const result = await getLogs({
    entityType,
    entityId,
    userId,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });
  const { data, total, ...pagination } = result;
  sendSuccess(res, data, 'Activity logs retrieved', 200, { total, ...pagination });
});
