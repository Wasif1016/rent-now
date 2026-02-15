"use client";

import { useState } from "react";
import { VehicleCard } from "@/components/search/vehicle-card-redesigned";
import { EmptyState } from "@/components/search/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { Search, X, Car } from "lucide-react";
import Image from "next/image";
import type { Vehicle, LocationOption, Town } from "@/types";
import { useVehicleFiltering } from "@/hooks/use-vehicle-filtering";
import { useTownsLoader } from "@/hooks/use-towns-loader";

interface HeroFiltersSectionProps {
  initialVehicles: Vehicle[];
  cities: LocationOption[];
  vehicleTypes: Array<{ id: string; name: string; slug: string }>;
  onFilteredVehiclesChange?: (vehicles: Vehicle[]) => void;
}

export function HeroFiltersSection({
  initialVehicles,
  cities,
  vehicleTypes,
  onFilteredVehiclesChange,
}: HeroFiltersSectionProps) {
  // Use centralized filtering hook
  const {
    filteredVehicles,
    filters,
    setSearchQuery,
    setSelectedCity,
    setSelectedTown,
    setSelectedVehicleType,
    resetFilters,
    hasActiveFilters,
  } = useVehicleFiltering({
    vehicles: initialVehicles,
    onFilteredChange: onFilteredVehiclesChange,
  });

  // Use centralized towns loader hook
  const { towns } = useTownsLoader({
    citySlug: filters.selectedCity !== "all" ? filters.selectedCity : undefined,
    cities,
    enabled: filters.selectedCity !== "all",
  });

  // Combobox search states
  const [citySearch, setCitySearch] = useState("");
  const [townSearch, setTownSearch] = useState("");
  const [vehicleTypeSearch, setVehicleTypeSearch] = useState("");

  // Filtered options for comboboxes
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredTowns = towns.filter((town) =>
    town.name.toLowerCase().includes(townSearch.toLowerCase())
  );

  const filteredVehicleTypes = vehicleTypes.filter((type) =>
    type.name.toLowerCase().includes(vehicleTypeSearch.toLowerCase())
  );

  // Get display values
  const getCityDisplayValue = () => {
    if (filters.selectedCity === "all") return "All Cities";
    return cities.find((c) => c.slug === filters.selectedCity)?.name || "City";
  };

  const getTownDisplayValue = () => {
    if (filters.selectedTown === "all") return "All Towns";
    return towns.find((t) => t.slug === filters.selectedTown)?.name || "Town";
  };

  const getVehicleTypeDisplayValue = () => {
    if (filters.selectedVehicleType === "all") return "All Types";
    return (
      vehicleTypes.find((t) => t.slug === filters.selectedVehicleType)?.name ||
      "Vehicle Type"
    );
  };

  // Vehicle type icon mapper
  const getVehicleTypeIcon = (typeName: string) => {
    const normalizedName = typeName.toLowerCase();
    const iconMap: Record<string, string> = {
      sedan: "/icons/car.svg",
      suv: "/icons/car.svg",
      hatchback: "/icons/car.svg",
      van: "/icons/car.svg",
      coupe: "/icons/car.svg",
      wagon: "/icons/car.svg",
      default: "/icons/car.svg",
    };
    return iconMap[normalizedName] || iconMap.default;
  };

  // Store filtered vehicles in a way that can be accessed by results component
  // We'll use a custom hook pattern or just render results separately
  return (
    <>
      {/* Filters Section - Positioned at bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-background/90 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Input */}
            <div className="w-full lg:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle, city, or town..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-border rounded-none h-10 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            {/* Dropdowns */}
            <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-3 overflow-x-auto pb-1 sm:pb-0 items-center">
              {/* City Combobox */}
              <Combobox
                value={filters.selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value || "all");
                  setCitySearch("");
                }}
              >
                <ComboboxInput
                  placeholder={getCityDisplayValue()}
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full sm:w-[180px] h-10 rounded-none border-border"
                  showClear={citySearch.length > 0}
                />
                <ComboboxContent className="w-[--anchor-width] rounded-none">
                  <ComboboxList>
                    <ComboboxItem value="all" className="rounded-none">
                      All Cities
                    </ComboboxItem>
                    {filteredCities.map((city) => (
                      <ComboboxItem
                        key={city.id}
                        value={city.slug}
                        className="rounded-none"
                      >
                        {city.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              {/* Town Combobox */}
              <Combobox
                value={filters.selectedTown}
                onValueChange={(value) => {
                  setSelectedTown(value || "all");
                  setTownSearch("");
                }}
                disabled={
                  !filters.selectedCity || filters.selectedCity === "all" || towns.length === 0
                }
              >
                <ComboboxInput
                  placeholder={getTownDisplayValue()}
                  value={townSearch}
                  onChange={(e) => setTownSearch(e.target.value)}
                  className="w-full sm:w-[180px] h-10 rounded-none border-border"
                  showClear={townSearch.length > 0}
                  disabled={
                    !filters.selectedCity || filters.selectedCity === "all" || towns.length === 0
                  }
                />
                <ComboboxContent className="w-[--anchor-width] rounded-none">
                  <ComboboxList>
                    <ComboboxItem value="all" className="rounded-none">
                      All Towns
                    </ComboboxItem>
                    {filteredTowns.map((town) => (
                      <ComboboxItem
                        key={town.id}
                        value={town.slug}
                        className="rounded-none"
                      >
                        {town.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              {/* Vehicle Type Combobox */}
              <Combobox
                value={filters.selectedVehicleType}
                onValueChange={(value) => {
                  setSelectedVehicleType(value || "all");
                  setVehicleTypeSearch("");
                }}
              >
                <ComboboxInput
                  placeholder={getVehicleTypeDisplayValue()}
                  value={vehicleTypeSearch}
                  onChange={(e) => setVehicleTypeSearch(e.target.value)}
                  className="w-full sm:w-[180px] h-10 rounded-none border-border"
                  showClear={vehicleTypeSearch.length > 0}
                />
                <ComboboxContent className="w-[--anchor-width] rounded-none">
                  <ComboboxList>
                    <ComboboxItem value="all" className="rounded-none">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>All Types</span>
                      </div>
                    </ComboboxItem>
                    {filteredVehicleTypes.map((type) => (
                      <ComboboxItem
                        key={type.id}
                        value={type.slug}
                        className="rounded-none"
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={getVehicleTypeIcon(type.name)}
                            alt={type.name}
                            width={16}
                            height={16}
                            className="h-4 w-4"
                          />
                          <span>{type.name}</span>
                        </div>
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-transparent"
                >
                  <span className="sr-only">Reset</span>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Results component
export function HeroResults({ filteredVehicles }: { filteredVehicles: Vehicle[] }) {
  return (
    <section className="bg-foreground/10 pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Results Info */}
        {/* <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredVehicles.length}{" "}
            {filteredVehicles.length === 1 ? "Result" : "Results"}
          </h2>
        </div> */}

        {/* Grid */}
        <div className="min-h-[400px]">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}
