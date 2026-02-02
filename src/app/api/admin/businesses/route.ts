import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getBusinesses } from '@/lib/services/business.service'
import { prisma } from '@/lib/prisma'
import { RegistrationStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const {
      name,
      email,
      phone,
      personName,
      whatsappPhone,
      cityId,
      town,
      province,
      address,
      description,
      googleMapsUrl,
    } = body as {
      name?: string
      email?: string
      phone?: string
      personName?: string
      whatsappPhone?: string
      cityId?: string
      town?: string
      province?: string
      address?: string
      description?: string
      googleMapsUrl?: string
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }

    const slug =
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      'business'
    const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 9)}`

    if (email) {
      const existing = await prisma.vendor.findUnique({
        where: { email: email.trim().toLowerCase() },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'A business with this email already exists' },
          { status: 400 }
        )
      }
    }

    const vendor = await prisma.vendor.create({
      data: {
        name: name.trim(),
        slug: uniqueSlug,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        personName: personName?.trim() || null,
        whatsappPhone: whatsappPhone?.trim() || phone?.trim() || null,
        cityId: cityId || null,
        town: town?.trim() || null,
        province: province?.trim() || null,
        address: address?.trim() || null,
        description: description?.trim() || null,
        googleMapsUrl: googleMapsUrl?.trim() || null,
        registrationStatus: 'NOT_REGISTERED',
        verificationStatus: 'PENDING',
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, vendor: { id: vendor.id } })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    if (error.message?.includes('Forbidden') || error.message?.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })
    }
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    if (error.message?.includes('Forbidden') || error.message?.includes('Admin access required')) {
      return NextResponse.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 })
    }

    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

