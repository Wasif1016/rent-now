import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { resetVendorPassword } from '@/lib/services/vendor-account.service'
import { logActivity } from '@/lib/services/activity-log.service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request)
    const { id } = await params

    const result = await resetVendorPassword(id, user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to reset password' },
        { status: 400 }
      )
    }

    await logActivity({
      action: 'PASSWORD_RESET',
      entityType: 'VENDOR',
      entityId: id,
      adminUserId: user.id,
    })

    return NextResponse.json({
      success: true,
      password: result.password,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

