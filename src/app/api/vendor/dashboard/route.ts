import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getOrCreateVendor } from '@/lib/vendor'

export async function GET(request: NextRequest) {
  try {
    const { user } = await getServerSession(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const vendor = await getOrCreateVendor(user)
    
    // Check if profile is complete (all mandatory fields)
    const profileComplete = !!(
      vendor.name &&
      vendor.address &&
      (vendor.metadata as any)?.city &&
      vendor.phone &&
      vendor.whatsappPhone &&
      vendor.email &&
      vendor.logo
    )

    // Check if vendor has at least one vehicle
    const vehicleCount = await prisma.vehicle.count({
      where: { vendorId: vendor.id },
    })
    const hasVehicles = vehicleCount > 0

    // Check if vendor has at least one route
    const routeCount = await prisma.route.count({
      where: { vendorId: vendor.id },
    })
    const hasRoutes = routeCount > 0

    // Calculate progress: Profile 33%, Vehicles 33%, Routes 34%
    let progress = 0
    if (profileComplete) progress += 33
    if (hasVehicles) progress += 33
    if (hasRoutes) progress += 34

    return NextResponse.json({
      profileComplete,
      hasVehicles,
      hasRoutes,
      progress,
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching dashboard progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard progress' },
      { status: 500 }
    )
  }
}

