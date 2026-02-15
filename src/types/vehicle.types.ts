/**
 * Vehicle-related type definitions
 * Centralized types for vehicles across the application
 */

// Base vehicle type - minimal fields
export interface VehicleBase {
  id: string;
  title: string;
  slug: string;
}

// Vehicle with full details for display/search
export interface Vehicle extends VehicleBase {
  seats?: number | null;
  images: string[] | null;
  city: {
    id?: string;
    name: string;
    slug: string;
  };
  town?: {
    id?: string;
    name: string;
    slug: string;
  } | null;
  vehicleType?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  vehicleModel?: {
    id?: string;
    name: string;
    slug?: string;
    capacity?: number | null;
    vehicleBrand: {
      id?: string;
      name: string;
      slug?: string;
    };
  } | null;
  vendor: {
    id?: string;
    name: string;
    slug?: string;
    verificationStatus?: string | null;
    phone?: string | null;
    whatsappPhone?: string | null;
    email?: string | null;
  };
  priceWithinCity?: number | null;
  priceOutOfCity?: number | null;
  priceSelfDrive?: number | null;
  priceWithDriver?: number | null;
  priceDaily?: number | null;
  priceHourly?: number | null;
  priceMonthly?: number | null;
  year?: number | null;
  mileage?: number | null;
  fuelType?: string | null;
  transmission?: string | null;
  featured?: boolean;
  isAvailable?: boolean | null;
  status?: string;
}

// Vehicle for admin/vendor table lists
export interface VehicleListItem extends VehicleBase {
  isAvailable: boolean | null;
  status: string;
  images: any;
  views?: number;
  whatsappClicks?: number;
  callClicks?: number;
  plateNumber?: string | null;
  city: {
    id: string;
    name: string;
  } | null;
  vehicleType: {
    id: string;
    name: string;
  } | null;
  vendor: {
    id: string;
    name: string;
    email: string | null;
  };
}

// Vehicle form data
export interface VehicleFormData {
  vehicleModelId: string;
  cityId: string;
  townId: string;
  title: string;
  transmission: string;
  seats: string;
  seatingCapacity: string;
  driverOption: string;
  priceWithDriver: string;
  priceSelfDrive: string;
  priceDaily: string;
  priceHourly: string;
  priceMonthly: string;
  priceWithinCity: string;
  priceOutOfCity: string;
  images: string[];
  imageUrl: string;
}

// Vehicle card props
export interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: "default" | "redesigned";
}

// Vehicle search/filter result
export interface VehicleSearchResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
}
