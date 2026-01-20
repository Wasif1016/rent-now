interface Vehicle {
  title: string
  city: {
    name: string
  }
  town?: {
    name: string
  } | null
  vehicleModel?: {
    name: string
    vehicleBrand: {
      name: string
    }
  } | null
}

interface GenerateWhatsAppLinkOptions {
  vehicle: Vehicle
  userName?: string
  userPhone?: string
}

/**
 * Generates a WhatsApp link with a pre-filled message for booking a vehicle
 * @param vehicle - Vehicle object with title, city, town, and model information
 * @param options - Optional user information
 * @returns WhatsApp URL (wa.me format)
 */
export function generateWhatsAppLink(
  vehicle: Vehicle,
  options?: GenerateWhatsAppLinkOptions
): string {
  const location = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name

  const vehicleName = vehicle.vehicleModel
    ? `${vehicle.vehicleModel.vehicleBrand.name} ${vehicle.vehicleModel.name}`
    : vehicle.title

  let message = `Hi, I'm interested in booking ${vehicleName} in ${location}. Please confirm availability.`

  if (options?.userName) {
    message += `\n\nName: ${options.userName}`
  }

  if (options?.userPhone) {
    message += `\nPhone: ${options.userPhone}`
  }

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)

  // Use a default WhatsApp number or get from environment
  // For now, using a placeholder - this should be configured per vendor or use admin number
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'

  // Remove any non-numeric characters from phone number
  const cleanNumber = whatsappNumber.replace(/\D/g, '')

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

/**
 * Opens WhatsApp in a new window/tab
 */
export function openWhatsApp(vehicle: Vehicle, options?: GenerateWhatsAppLinkOptions) {
  const url = generateWhatsAppLink(vehicle, options)
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Sends a booking notification to WhatsApp via Assistro.
 *
 * Configure these environment variables:
 * - ASSISTRO_API_URL   : The Assistro webhook/API URL
 * - ASSISTRO_API_TOKEN : The JWT token you shared (keep it secret)
 */
export async function sendBookingToWhatsAppViaAssistro(payload: {
  vehicleId: string
  vendorId: string
  userName: string
  userPhone: string
  userEmail?: string
  bookingDate?: string
  message?: string
  totalAmount?: number
}) {
  const apiUrl = process.env.ASSISTRO_API_URL
  const apiToken = process.env.ASSISTRO_API_TOKEN

  if (!apiUrl || !apiToken) {
    // Not configured – safely skip sending
    return
  }

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error('Failed to send booking to WhatsApp via Assistro:', error)
  }
}

