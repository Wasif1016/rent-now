/**
 * Get display title for a vehicle: show model (Brand Model) in front when available, else title.
 * Used wherever we show the car title (listing page, cards, admin, vendor).
 */
export function getVehicleDisplayTitle(vehicle: {
  title: string
  vehicleModel?: {
    name: string
    vehicleBrand: { name: string }
  } | null
}): string {
  if (vehicle.vehicleModel) {
    const { vehicleBrand, name } = vehicle.vehicleModel
    return `${vehicleBrand.name} ${name}`
  }
  return vehicle.title
}
