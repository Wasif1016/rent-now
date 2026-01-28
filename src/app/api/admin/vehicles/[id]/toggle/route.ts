import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/services/activity-log.service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request)
    const { id } = await params
    const body = await request.json()

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        isAvailable: body.isAvailable,
      },
    })

    await logActivity({
      action: body.isAvailable ? 'VEHICLE_APPROVED' : 'VEHICLE_DISABLED',
      entityType: 'VEHICLE',
      entityId: id,
      adminUserId: user.id,
      details: {
        vehicleTitle: vehicle.title,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error toggling vehicle:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

