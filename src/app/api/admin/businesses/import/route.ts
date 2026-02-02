import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { importBusinessesFromCSV } from '@/lib/services/csv-import.service'
import { logActivity } from '@/lib/services/activity-log.service'

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request)

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    // Read file content
    const text = await file.text()

    // Import businesses
    const result = await importBusinessesFromCSV(text)

    // Log activity
    await logActivity({
      action: 'CSV_IMPORTED',
      entityType: 'VENDOR',
      entityId: 'bulk',
      adminUserId: user.id,
      details: {
        success: result.success,
        total: result.total,
        errors: result.errors.length,
        fileName: file.name,
      },
    })

    return NextResponse.json(result)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
    if (error.message?.includes('Forbidden') || error.message?.includes('Admin access required')) {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    console.error('Error importing CSV:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

