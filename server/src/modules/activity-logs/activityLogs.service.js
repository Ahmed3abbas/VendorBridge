import db from '../../config/db.js';

export const getLogs = async ({ entityType, entityId, userId, page = 1, limit = 20 }) => {
  const where = {};
  if (entityType) where.entity_type = entityType;
  if (entityId) where.entity_id = entityId;
  if (userId) where.user_id = userId;

  const [data, total] = await Promise.all([
    db.activityLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, role: true } } },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.activityLog.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
