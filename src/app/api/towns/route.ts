import { NextRequest, NextResponse } from 'next/server'
import { prisma, cache } from '@/lib/prisma'

// Cached function for per-request deduplication
const getTowns = cache(async (cityId?: string) => {
  const where: any = {
    isActive: true,
  }

  if (cityId) {
    where.cityId = cityId
  }

  return await prisma.town.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      cityId: true,
      city: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cityId = searchParams.get('cityId') || undefined

    const towns = await getTowns(cityId)
    return NextResponse.json(towns, { status: 200 })
  } catch (error) {
    console.error('Error fetching towns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch towns' },
      { status: 500 }
    )
  }
}

