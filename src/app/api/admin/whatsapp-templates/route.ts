import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/services/activity-log.service'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const templates = await prisma.whatsAppTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error: unknown) {
    const err = error as { message?: string }
    if (err.message === 'Unauthorized' || String(err.message).includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.error('Error fetching WhatsApp templates:', error)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request)
    const body = await request.json()

    const { name, body: templateBody, isActive } = body

    if (!name || templateBody == null || templateBody === '') {
      return NextResponse.json(
        { error: 'Missing required fields: name and body' },
        { status: 400 }
      )
    }

    const template = await prisma.whatsAppTemplate.create({
      data: {
        name,
        body: String(templateBody),
        isActive: isActive !== false,
      },
    })

    await logActivity({
      action: 'WHATSAPP_TEMPLATE_CREATED',
      entityType: 'WHATSAPP_TEMPLATE',
      entityId: template.id,
      adminUserId: user.id,
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    if (err.message === 'Unauthorized' || String(err.message).includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'Template name already exists' },
        { status: 400 }
      )
    }
    console.error('Error creating WhatsApp template:', error)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
