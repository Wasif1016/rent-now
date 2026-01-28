import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getBusinesses } from '@/lib/services/business.service'
import { RegistrationStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as RegistrationStatus | null
    const city = searchParams.get('city') || undefined
    const search = searchParams.get('search') || undefined

    const result = await getBusinesses({
      page,
      limit,
      status: status || undefined,
      city,
      search,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

