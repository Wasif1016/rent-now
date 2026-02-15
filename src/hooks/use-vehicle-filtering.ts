/**
 * Custom hook for vehicle filtering logic
 * Centralized filtering logic used across multiple components
 */

import { useState, useEffect, useMemo } from "react";
import type { Vehicle, VehicleFilterState } from "@/types";

interface UseVehicleFilteringOptions {
  vehicles: Vehicle[];
  initialFilters?: Partial<VehicleFilterState>;
  onFilteredChange?: (filtered: Vehicle[]) => void;
}

interface UseVehicleFilteringResult {
  filteredVehicles: Vehicle[];
  filters: VehicleFilterState;
  setFilters: (filters: Partial<VehicleFilterState> | ((prev: VehicleFilterState) => VehicleFilterState)) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedTown: (town: string) => void;
  setSelectedVehicleType: (type: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: VehicleFilterState = {
  searchQuery: "",
  selectedCity: "all",
  selectedTown: "all",
  selectedVehicleType: "all",
};

/**
 * Hook for filtering vehicles based on search query, city, town, and vehicle type
 * @param options - Configuration options
 * @returns Filtered vehicles and filter controls
 */
export function useVehicleFiltering(
  options: UseVehicleFilteringOptions
): UseVehicleFilteringResult {
  const { vehicles, initialFilters, onFilteredChange } = options;

  const [filters, setFilters] = useState<VehicleFilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // Filter vehicles based on current filter state
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.vehicleModel?.name.toLowerCase().includes(query) ||
          v.vehicleModel?.vehicleBrand.name.toLowerCase().includes(query) ||
          v.town?.name.toLowerCase().includes(query) ||
          v.city.name.toLowerCase().includes(query)
      );
    }

    // Filter by city
    if (filters.selectedCity && filters.selectedCity !== "all") {
      filtered = filtered.filter((v) => v.city.slug === filters.selectedCity);
    }

    // Filter by town
    if (filters.selectedTown && filters.selectedTown !== "all") {
      filtered = filtered.filter((v) => v.town?.slug === filters.selectedTown);
    }

    // Filter by vehicle type
    if (filters.selectedVehicleType && filters.selectedVehicleType !== "all") {
      filtered = filtered.filter(
        (v) => v.vehicleType?.slug === filters.selectedVehicleType
      );
    }

    return filtered;
  }, [vehicles, filters]);

  // Notify parent of filtered vehicles change
  useEffect(() => {
    if (onFilteredChange) {
      onFilteredChange(filteredVehicles);
    }
  }, [filteredVehicles, onFilteredChange]);

  // Helper setters
  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setSelectedCity = (city: string) => {
    setFilters((prev) => ({ ...prev, selectedCity: city, selectedTown: "all" }));
  };

  const setSelectedTown = (town: string) => {
    setFilters((prev) => ({ ...prev, selectedTown: town }));
  };

  const setSelectedVehicleType = (type: string) => {
    setFilters((prev) => ({ ...prev, selectedVehicleType: type }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = !!(
    (filters.selectedCity && filters.selectedCity !== "all") ||
    (filters.selectedTown && filters.selectedTown !== "all") ||
    (filters.selectedVehicleType && filters.selectedVehicleType !== "all") ||
    filters.searchQuery.trim()
  );

  return {
    filteredVehicles,
    filters,
    setFilters,
    setSearchQuery,
    setSelectedCity,
    setSelectedTown,
    setSelectedVehicleType,
    resetFilters,
    hasActiveFilters,
  };
}
