import { PrismaClient } from '@prisma/client'
import { cache } from 'react'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client singleton for Next.js
 * 
 * Following Next.js best practices:
 * - Uses React.cache() for per-request deduplication
 * - Prevents multiple instances in development
 * - Properly handles connection pooling
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Cached Prisma queries for per-request deduplication
 * 
 * Use this for queries that may be called multiple times
 * within the same request to avoid duplicate database calls.
 * 
 * Example:
 * ```ts
 * export const getCity = cache(async (slug: string) => {
 *   return await prisma.city.findUnique({ where: { slug } })
 * })
 * ```
 */
export { cache }

