/**
 * Filter-related type definitions
 * Types for vehicle filtering, search, and filter state management
 */

// Vehicle filter state
export interface VehicleFilterState {
  searchQuery: string;
  selectedCity: string; // slug or "all"
  selectedTown: string; // slug or "all"
  selectedBrand: string; // slug or "all"
  selectedVehicleType: string; // slug or "all"
}

// Filter options (available choices)
export interface FilterOptions {
  cities: Array<{ id: string; name: string; slug: string }>;
  towns: Array<{ id: string; name: string; slug: string; cityId: string }>;
  vehicleTypes: Array<{ id: string; name: string; slug: string }>;
}

// Filter callbacks
export interface FilterCallbacks {
  onSearchChange?: (query: string) => void;
  onCityChange?: (citySlug: string) => void;
  onTownChange?: (townSlug: string) => void;
  onVehicleTypeChange?: (typeSlug: string) => void;
  onReset?: () => void;
}

// Filter props for filter components
export interface VehicleFilterProps {
  initialFilters?: Partial<VehicleFilterState>;
  options: FilterOptions;
  callbacks?: FilterCallbacks;
  className?: string;
}

// Search params (Next.js)
export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// Vehicle search filters (for API/server-side)
export interface VehicleSearchFilters {
  citySlug?: string;
  townSlug?: string;
  brandSlug?: string;
  vehicleSlug?: string;
  modelSlug?: string;
  vehicleTypeSlug?: string;
  categorySlug?: string;
  categoryId?: string;
  typeId?: string;
  driverOption?: "WITH_DRIVER" | "WITHOUT_DRIVER" | "BOTH";
  seatingCapacity?: number;
  fuelType?: string;
  transmission?: string;
  sortBy?: "date" | "popularity";
  page?: number;
  limit?: number;
}
