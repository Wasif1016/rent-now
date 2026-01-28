import nodemailer from 'nodemailer'

type BookingEmailPayload = {
  vehicleId: string
  vendorId: string
  userName: string
  userPhone: string
  userEmail?: string
  bookingDate?: string
  message?: string
  totalAmount?: number
  advanceAmount?: number
}

/**
 * Sends booking form data via Brevo SMTP.
 *
 * Required environment variables:
 * - BREVO_SMTP_HOST
 * - BREVO_SMTP_PORT
 * - BREVO_SMTP_USER
 * - BREVO_SMTP_PASS
 * - BREVO_FROM_EMAIL
 * - BREVO_TO_EMAIL
 */
export async function sendBookingEmail(payload: BookingEmailPayload) {
  const {
    BREVO_SMTP_HOST,
    BREVO_SMTP_PORT,
    BREVO_SMTP_USER,
    BREVO_SMTP_PASS,
    BREVO_FROM_EMAIL,
    BREVO_TO_EMAIL,
  } = process.env

  if (
    !BREVO_SMTP_HOST ||
    !BREVO_SMTP_PORT ||
    !BREVO_SMTP_USER ||
    !BREVO_SMTP_PASS ||
    !BREVO_FROM_EMAIL ||
    !BREVO_TO_EMAIL
  ) {
    console.error('Brevo SMTP environment variables are not fully configured.')
    return
  }

  const transporter = nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: BREVO_SMTP_USER,
      pass: BREVO_SMTP_PASS,
    },
  })

  const {
    vehicleId,
    vendorId,
    userName,
    userPhone,
    userEmail,
    bookingDate,
    message,
    totalAmount,
    advanceAmount,
  } = payload

  const subject = `New Booking Request - Vehicle ${vehicleId} (Vendor ${vendorId})`

  const text = [
    'New booking request received from website:',
    '',
    `Name: ${userName}`,
    `Phone: ${userPhone}`,
    `Email: ${userEmail || 'N/A'}`,
    '',
    `Vehicle ID: ${vehicleId}`,
    `Vendor ID: ${vendorId}`,
    `Preferred Date: ${bookingDate || 'N/A'}`,
    `Estimated Budget: ${typeof totalAmount === 'number' ? totalAmount : 'N/A'}`,
    `Advance Amount (2%): ${
      typeof advanceAmount === 'number' ? advanceAmount : 'Not collected online'
    }`,
    '',
    'Message:',
    message || 'N/A',
  ].join('\n')

  try {
    await transporter.sendMail({
      from: BREVO_FROM_EMAIL,
      to: BREVO_TO_EMAIL,
      subject,
      text,
    })
  } catch (error) {
    console.error('Failed to send booking email via Brevo SMTP:', error)
  }
}

type VendorCredentialsEmailPayload = {
  to: string
  businessName: string
  email: string
  password: string
  loginUrl?: string
  subject?: string
  body?: string // HTML template with {{variables}}
}

/**
 * Get Brevo transporter (reusable)
 */
function getBrevoTransporter() {
  const {
    BREVO_SMTP_HOST,
    BREVO_SMTP_PORT,
    BREVO_SMTP_USER,
    BREVO_SMTP_PASS,
  } = process.env

  if (!BREVO_SMTP_HOST || !BREVO_SMTP_PORT || !BREVO_SMTP_USER || !BREVO_SMTP_PASS) {
    throw new Error('Brevo SMTP environment variables are not fully configured.')
  }

  return nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: BREVO_SMTP_USER,
      pass: BREVO_SMTP_PASS,
    },
  })
}

/**
 * Replace template variables in email body
 */
function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

/**
 * Send vendor credentials email via Brevo SMTP
 */
export async function sendVendorCredentialsEmail(
  payload: VendorCredentialsEmailPayload
): Promise<{ success: boolean; error?: string }> {
  const {
    BREVO_FROM_EMAIL,
  } = process.env

  if (!BREVO_FROM_EMAIL) {
    return {
      success: false,
      error: 'BREVO_FROM_EMAIL is not configured',
    }
  }

  try {
    const transporter = getBrevoTransporter()
    
    const {
      to,
      businessName,
      email,
      password,
      loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login`,
      subject: customSubject,
      body: customBody,
    } = payload

    // Default email template
    const defaultSubject = 'Your Vendor Account Credentials - Rent Now'
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

    const subject = customSubject || defaultSubject
    const bodyTemplate = customBody || defaultBody

    // Replace variables
    const htmlBody = replaceTemplateVariables(bodyTemplate, {
      business_name: businessName,
      email,
      password,
      login_url: loginUrl,
    })

    // Plain text version
    const textBody = `
Welcome to Rent Now

Dear ${businessName},

Your vendor account has been created successfully. Use the credentials below to log in:

Email: ${email}
Password: ${password}

Login URL: ${loginUrl}

Important: Please change your password after your first login for security.

© ${new Date().getFullYear()} Rent Now. All rights reserved.
    `.trim()

    await transporter.sendMail({
      from: BREVO_FROM_EMAIL,
      to,
      subject,
      text: textBody,
      html: htmlBody,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to send vendor credentials email:', error)
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Unknown error'
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      errorMessage = 'SMTP Authentication failed. Please check your BREVO_SMTP_USER and BREVO_SMTP_PASS in .env.local. Make sure you are using the SMTP password (not your account password) from Brevo dashboard.'
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Failed to connect to SMTP server. Please check your BREVO_SMTP_HOST and BREVO_SMTP_PORT settings.'
    }
    
    return {
      success: false,
      error: errorMessage,
    }
  }
}


