import { prisma } from '@/lib/prisma'

interface LogActivityParams {
  action: string
  entityType: string
  entityId: string
  adminUserId?: string | null
  details?: any
}

/**
 * Log an admin activity
 */
export async function logActivity(params: LogActivityParams) {
  // Sanitize details to remove any password fields
  const sanitizedDetails = params.details ? { ...params.details } : {}
  if (sanitizedDetails.password) {
    delete sanitizedDetails.password
  }
  if (sanitizedDetails.temporaryPassword) {
    delete sanitizedDetails.temporaryPassword
  }

  return await prisma.activityLog.create({
    data: {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      adminUserId: params.adminUserId || null,
      details: sanitizedDetails || null,
    },
  })
}

/**
 * Get activity logs for an entity
 */
export async function getActivityLogs(
  entityType: string,
  entityId: string,
  limit: number = 50
) {
  return await prisma.activityLog.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

/**
 * Get all activity logs with pagination
 */
export async function getAllActivityLogs(params: {
  page?: number
  limit?: number
  action?: string
  entityType?: string
  adminId?: string
}) {
  const { page = 1, limit = 50, action, entityType, adminId } = params
  const skip = (page - 1) * limit

  const where: any = {}
  if (action) where.action = action
  if (entityType) where.entityType = entityType
  if (adminId) where.adminUserId = adminId

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.activityLog.count({ where }),
  ])

  return {
    logs,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  }
}
