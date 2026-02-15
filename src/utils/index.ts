/**
 * Central export point for all utilities
 * Import utilities from here: import { formatPrice, formatPhoneNumber } from '@/utils'
 */

// Formatting utilities
export {
  formatPrice,
  formatCurrency,
  cleanPhoneNumber,
  formatPhoneNumber,
  formatDate,
  formatNumber,
} from "./formatting";

// Vehicle utilities
export {
  getVehicleDisplayTitle,
  getVehicleImageUrl,
  getVehicleLocationText,
  hasVehiclePrice,
  getVehiclePrimaryPrice,
} from "./vehicle";

// WhatsApp utilities
export {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  buildVehicleWhatsAppUrl,
  getTelHref,
} from "./whatsapp";
