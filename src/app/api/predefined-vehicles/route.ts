import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const predefinedVehicles = await prisma.vehicleModel.findMany({
      where: {
        isPredefined: true,
        isActive: true,
      },
      include: {
        vehicleBrand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        vehicleBrand: {
          name: 'asc',
        },
      },
    })

    return NextResponse.json(predefinedVehicles, { status: 200 })
  } catch (error) {
    console.error('Error fetching predefined vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predefined vehicles' },
      { status: 500 }
    )
  }
}

