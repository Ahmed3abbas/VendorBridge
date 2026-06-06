import db from '../config/db.js';

const activityLogger = (action, entityType) => async (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode < 400 && req.user) {
      const entityId = body?.data?.id || req.params?.id || null;
      db.activityLog.create({
        data: {
          user_id: req.user.id,
          action,
          entity_type: entityType,
          entity_id: entityId || '',
          metadata: { method: req.method, path: req.path },
          ip_address: req.ip,
        },
      }).catch(() => {});
    }
    return originalJson(body);
  };

  next();
};

export default activityLogger;
