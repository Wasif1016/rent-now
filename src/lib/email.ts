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


