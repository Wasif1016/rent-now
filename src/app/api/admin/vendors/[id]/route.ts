import { NextRequest, NextResponse } from 'next/server'
import { getVendorById } from '@/lib/data'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const vendor = await getVendorById(id)

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(vendor, { status: 200 })
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.personName !== undefined) updateData.personName = body.personName
    if (body.whatsappPhone !== undefined) updateData.whatsappPhone = body.whatsappPhone
    if (body.address !== undefined) updateData.address = body.address
    if (body.verificationStatus !== undefined) updateData.verificationStatus = body.verificationStatus
    if (body.isActive !== undefined) updateData.isActive = body.isActive

    const vendor = await prisma.vendor.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(vendor, { status: 200 })
  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    )
  }
}

