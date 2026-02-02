import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { logActivity } from '@/lib/services/activity-log.service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request)
    const body = await request.json()
    const ids = body.ids as string[] | undefined
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Request body must include an array of business ids' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const results: { id: string; success: boolean; error?: string }[] = []

    for (const id of ids) {
      try {
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
          results.push({ id, success: false, error: 'Business not found' })
          continue
        }

        // Delete Supabase user if exists
        if (vendor.supabaseUserId) {
          try {
            await supabase.auth.admin.deleteUser(vendor.supabaseUserId)
          } catch {
            // Continue even if Supabase user deletion fails
          }
        }

        // 1. VehicleRoute links for this vendor's vehicles
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

        // 3. Bookings, inquiries, vendor routes, activity logs
        await prisma.booking.deleteMany({ where: { vendorId: id } })
        await prisma.inquiry.deleteMany({ where: { vendorId: id } })
        await prisma.vendorRouteOffer.deleteMany({ where: { vendorId: id } })
        await prisma.activityLog.deleteMany({
          where: { entityType: 'VENDOR', entityId: id },
        })

        // 4. Vendor
        await prisma.vendor.delete({ where: { id } })

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

        results.push({ id, success: true })
      } catch (err: any) {
        results.push({ id, success: false, error: err.message || 'Delete failed' })
      }
    }

    const succeeded = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success)

    return NextResponse.json({
      success: failed.length === 0,
      message:
        failed.length === 0
          ? `${succeeded} business(es) deleted successfully`
          : `${succeeded} deleted, ${failed.length} failed`,
      results,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Bulk delete businesses error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
