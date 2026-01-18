import { NextResponse } from 'next/server'
import { prisma, cache } from '@/lib/prisma'

// Cached function for per-request deduplication
const getCities = cache(async () => {
  return await prisma.city.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      province: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
})

export async function GET() {
  try {
    const cities = await getCities()
    return NextResponse.json(cities, { status: 200 })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}

