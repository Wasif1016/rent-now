import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/services/activity-log.service'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request)
    const body = await request.json()

    const { name, subject, body: emailBody, variables, isActive } = body

    if (!name || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        body: emailBody,
        variables: variables || [],
        isActive: isActive !== false,
      },
    })

    await logActivity({
      action: 'EMAIL_TEMPLATE_CREATED',
      entityType: 'EMAIL_TEMPLATE',
      entityId: template.id,
      adminUserId: user.id,
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Template name already exists' },
        { status: 400 }
      )
    }

    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

