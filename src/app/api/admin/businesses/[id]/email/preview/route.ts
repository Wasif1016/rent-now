import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decryptPassword } from '@/lib/services/crypto.service'
import { replaceTemplateVariables } from '@/lib/services/template.service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request)
    const { id } = await params
    const body = await request.json()

    // Get vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    if (!vendor.email || !vendor.temporaryPasswordEncrypted) {
      return NextResponse.json(
        { error: 'Account not created yet' },
        { status: 400 }
      )
    }

    // Decrypt password
    let password: string
    try {
      password = decryptPassword(vendor.temporaryPasswordEncrypted)
    } catch (decryptError: any) {
      console.error('Error decrypting password:', decryptError)
      return NextResponse.json(
        { error: decryptError.message || 'Failed to decrypt password. Please check ENCRYPTION_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Prepare email variables
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login`
    const variables = {
      business_name: vendor.name,
      email: vendor.email,
      password,
      login_url: loginUrl,
    }

    // Get template if provided
    let emailSubject = body.subject
    let emailBody = body.body

    if (body.templateId) {
      const template = await prisma.emailTemplate.findUnique({
        where: { id: body.templateId },
      })

      if (template && template.isActive) {
        emailSubject = template.subject
        emailBody = template.body
      }
    }

    // Use default template if body not provided
    const defaultBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a2332; color: #C0F11C; padding: 20px; text-align: center; }
          .content { background: #f5f5f5; padding: 30px; }
          .credentials { background: #fff; padding: 20px; border-left: 4px solid #C0F11C; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #C0F11C; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Rent Now</h1>
          </div>
          <div class="content">
            <p>Dear {{business_name}},</p>
            <p>Your vendor account has been created successfully. Use the credentials below to log in:</p>
            
            <div class="credentials">
              <p><strong>Email:</strong> {{email}}</p>
              <p><strong>Password:</strong> {{password}}</p>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="{{login_url}}" class="button">Login to Dashboard</a>
            </p>
            
            <p><strong>Important:</strong> Please change your password after your first login for security.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Rent Now. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const templateBody = emailBody || defaultBody
    const htmlBody = replaceTemplateVariables(templateBody, variables)
    const subject = emailSubject || 'Your Vendor Account Credentials - Rent Now'

    return NextResponse.json({
      success: true,
      subject,
      body: htmlBody,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error generating preview:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

