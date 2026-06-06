import prisma from '../config/db.js';

const activityLogger = (action, entityType) => async (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode < 400 && req.user) {
      const entityId = body?.data?.id || req.params?.id || null;
      prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action,
          entityType,
          entityId,
          metadata: { method: req.method, path: req.path },
          ipAddress: req.ip,
        },
      }).catch(() => {});
    }
    return originalJson(body);
  };

  next();
};

export default activityLogger;
