import { NextRequest, NextResponse } from 'next/server'
import { getTownsByCity } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cityId = searchParams.get('cityId')

    if (!cityId) {
      return NextResponse.json(
        { error: 'cityId is required' },
        { status: 400 }
      )
    }

    const towns = await getTownsByCity(cityId)
    
    return NextResponse.json(towns)
  } catch (error: any) {
    console.error('Error fetching towns:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch towns' },
      { status: 500 }
    )
  }
}
