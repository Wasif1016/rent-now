/**
 * WhatsApp utility functions
 * Helper functions for building WhatsApp links and messages
 */

import type { Vehicle } from "@/types";
import { getVehicleDisplayTitle, getVehicleLocationText } from "./vehicle";
import { cleanPhoneNumber } from "./formatting";

/**
 * Build WhatsApp message for vehicle inquiry
 * @param vehicle - Vehicle object
 * @param location - Location string (optional, will be generated if not provided)
 * @returns WhatsApp message string
 */
export function buildWhatsAppMessage(
  vehicle: Vehicle,
  location?: string
): string {
  const vehicleName = getVehicleDisplayTitle(vehicle);
  const vehicleLocation = location || getVehicleLocationText(vehicle);
  return `Hi, I'm interested in booking ${vehicleName} in ${vehicleLocation}. Please confirm availability.`;
}

/**
 * Build WhatsApp URL
 * @param phoneNumber - Phone number (will be cleaned)
 * @param message - Message to send
 * @returns WhatsApp URL string
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleaned = cleanPhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
}

/**
 * Build complete WhatsApp link for vehicle
 * @param vehicle - Vehicle object
 * @param vendorPhone - Vendor phone number (prefers WhatsApp, falls back to phone)
 * @param defaultPhone - Default phone if vendor doesn't have one
 * @returns WhatsApp URL string
 */
export function buildVehicleWhatsAppUrl(
  vehicle: Vehicle,
  vendorPhone?: string | null,
  defaultPhone?: string
): string {
  const phone =
    vendorPhone ||
    vehicle.vendor.whatsappPhone ||
    vehicle.vendor.phone ||
    defaultPhone ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "923001234567";
  
  const message = buildWhatsAppMessage(vehicle);
  return buildWhatsAppUrl(phone, message);
}

/**
 * Get phone number for tel: link
 * @param phone - Phone number
 * @param fallback - Fallback phone number
 * @returns Cleaned phone number with + prefix
 */
export function getTelHref(phone?: string | null, fallback?: string): string {
  const phoneNumber = phone || fallback || "";
  const cleaned = cleanPhoneNumber(phoneNumber);
  return `tel:+${cleaned}`;
}
