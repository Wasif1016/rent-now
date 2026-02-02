import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/services/activity-log.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    const template = await prisma.whatsAppTemplate.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error: unknown) {
    const err = error as { message?: string }
    if (err.message === 'Unauthorized' || String(err.message).includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Error fetching WhatsApp template:', error)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request)
    const { id } = await params
    const body = await request.json()

    const { name, body: templateBody, isActive } = body

    if (!name || templateBody == null || templateBody === '') {
      return NextResponse.json(
        { error: 'Missing required fields: name and body' },
        { status: 400 }
      )
    }

    const template = await prisma.whatsAppTemplate.update({
      where: { id },
      data: {
        name,
        body: String(templateBody),
        isActive: isActive !== false,
      },
    })

    await logActivity({
      action: 'WHATSAPP_TEMPLATE_UPDATED',
      entityType: 'WHATSAPP_TEMPLATE',
      entityId: id,
      adminUserId: user.id,
    })

    return NextResponse.json(template)
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    if (err.message === 'Unauthorized' || String(err.message).includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'Template name already exists' },
        { status: 400 }
      )
    }
    console.error('Error updating WhatsApp template:', error)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request)
    const { id } = await params

    await prisma.whatsAppTemplate.delete({
      where: { id },
    })

    await logActivity({
      action: 'WHATSAPP_TEMPLATE_DELETED',
      entityType: 'WHATSAPP_TEMPLATE',
      entityId: id,
      adminUserId: user.id,
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    if (err.message === 'Unauthorized' || String(err.message).includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    console.error('Error deleting WhatsApp template:', error)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
