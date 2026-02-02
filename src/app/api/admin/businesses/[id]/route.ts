import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { logActivity } from '@/lib/services/activity-log.service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request)
    const { id } = await params

    // Get vendor with related data counts
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            vehicles: true,
            bookings: true,
            inquiries: true,
            vendorRouteOffers: true,
          },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Delete Supabase user if exists
    if (vendor.supabaseUserId) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })
        await supabase.auth.admin.deleteUser(vendor.supabaseUserId)
      } catch (supabaseError: any) {
        console.error('Error deleting Supabase user:', supabaseError)
        // Continue with deletion even if Supabase user deletion fails
      }
    }

    // Delete all related data in order to satisfy foreign key constraints
    // 1. VehicleRoute links (vehicleId references Vehicle)
    const vendorVehicleIds = await prisma.vehicle
      .findMany({ where: { vendorId: id }, select: { id: true } })
      .then((rows) => rows.map((r) => r.id))
    if (vendorVehicleIds.length > 0) {
      await prisma.vehicleRoute.deleteMany({
        where: { vehicleId: { in: vendorVehicleIds } },
      })
    }

    // 2. Vehicles
    await prisma.vehicle.deleteMany({
      where: { vendorId: id },
    })

    // Delete bookings
    await prisma.booking.deleteMany({
      where: { vendorId: id },
    })

    // Delete inquiries
    await prisma.inquiry.deleteMany({
      where: { vendorId: id },
    })

    // Delete routes
    await prisma.vendorRouteOffer.deleteMany({
      where: { vendorId: id },
    })

    // Delete activity logs related to this vendor
    await prisma.activityLog.deleteMany({
      where: {
        entityType: 'VENDOR',
        entityId: id,
      },
    })

    // Finally, delete the vendor
    await prisma.vendor.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      action: 'BUSINESS_DELETED',
      entityType: 'VENDOR',
      entityId: id,
      adminUserId: user.id,
      details: {
        vendorName: vendor.name,
        deletedVehicles: vendor._count.vehicles,
        deletedBookings: vendor._count.bookings,
        deletedInquiries: vendor._count.inquiries,
        deletedRoutes: vendor._count.vendorRouteOffers,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Business and all associated data deleted successfully',
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error deleting business:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

