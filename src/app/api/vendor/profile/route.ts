import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getOrCreateVendor } from '@/lib/vendor'

export async function GET(request: NextRequest) {
  try {
    const { user } = await getServerSession(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vendor = await getOrCreateVendor(user)

    return NextResponse.json(
      {
        id: vendor.id,
        name: vendor.name,
        logo: vendor.logo,
        email: vendor.email,
        phone: vendor.phone,
        whatsappPhone: vendor.whatsappPhone,
        address: vendor.address,
        city: (vendor.metadata as any)?.city ?? null,
        establishedYear: (vendor.metadata as any)?.establishedYear ?? null,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    return NextResponse.json({ error: 'Failed to fetch vendor profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await getServerSession(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vendor = await getOrCreateVendor(user)
    const body = await request.json()

    const metadata: any = {
      ...((vendor.metadata as any) || {}),
    }

    if (body.city !== undefined) metadata.city = body.city
    if (body.establishedYear !== undefined) metadata.establishedYear = body.establishedYear

    const updated = await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        name: body.companyName ?? vendor.name,
        address: body.companyAddress ?? vendor.address,
        phone: body.phoneNumber ?? vendor.phone,
        whatsappPhone: body.whatsappNumber ?? vendor.whatsappPhone,
        email: body.email ?? vendor.email,
        logo: body.logoUrl ?? vendor.logo,
        metadata,
      },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating vendor profile:', error)
    return NextResponse.json({ error: 'Failed to update vendor profile' }, { status: 500 })
  }
}


