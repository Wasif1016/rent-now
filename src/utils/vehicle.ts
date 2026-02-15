/**
 * Vehicle utility functions
 * Helper functions for vehicle-related operations
 */

import type { Vehicle } from "@/types";

/**
 * Get display title for a vehicle: show model (Brand Model) in front when available, else title.
 * Used wherever we show the car title (listing page, cards, admin, vendor).
 */
export function getVehicleDisplayTitle(vehicle: {
  title: string;
  vehicleModel?: {
    name: string;
    vehicleBrand: { name: string };
  } | null;
}): string {
  if (vehicle.vehicleModel) {
    const { vehicleBrand, name } = vehicle.vehicleModel;
    return `${vehicleBrand.name} ${name}`;
  }
  return vehicle.title;
}

/**
 * Get vehicle image URL (first image or fallback)
 * @param vehicle - Vehicle object
 * @param fallback - Fallback image URL
 * @returns Image URL string
 */
export function getVehicleImageUrl(
  vehicle: Vehicle,
  fallback: string = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
): string {
  if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    return vehicle.images[0];
  }
  return fallback;
}

/**
 * Get vehicle location text (town, city or just city)
 * @param vehicle - Vehicle object
 * @returns Location string
 */
export function getVehicleLocationText(vehicle: Vehicle): string {
  if (vehicle.town) {
    return `${vehicle.town.name}, ${vehicle.city.name}`;
  }
  return vehicle.city.name;
}

/**
 * Check if vehicle has any pricing information
 * @param vehicle - Vehicle object
 * @returns Boolean indicating if vehicle has pricing
 */
export function hasVehiclePrice(vehicle: Vehicle): boolean {
  return !!(
    vehicle.priceWithDriver != null ||
    vehicle.priceSelfDrive != null ||
    vehicle.priceDaily != null ||
    vehicle.priceHourly != null ||
    vehicle.priceMonthly != null ||
    vehicle.priceWithinCity != null ||
    vehicle.priceOutOfCity != null
  );
}

/**
 * Get primary price for vehicle (prefers withinCity, then outOfCity, then daily)
 * @param vehicle - Vehicle object
 * @returns Price value or null
 */
export function getVehiclePrimaryPrice(vehicle: Vehicle): number | null {
  return (
    vehicle.priceWithinCity ??
    vehicle.priceOutOfCity ??
    vehicle.priceDaily ??
    vehicle.priceSelfDrive ??
    vehicle.priceWithDriver ??
    null
  );
}
