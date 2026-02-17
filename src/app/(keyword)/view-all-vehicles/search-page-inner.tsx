"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Search, X, MapPin, Car } from "lucide-react";
import Image from "next/image";

interface Vehicle {
  id: string;
  title: string;
  slug: string;
  seats?: number | null;
  images: string[] | null;
  city: { name: string; slug: string };
  town?: { name: string; slug: string } | null;
  vehicleType?: { id: string; name: string; slug: string } | null;
  vehicleModel?: { name: string; vehicleBrand: { name: string } } | null;
  vendor: {
    name: string;
    verificationStatus?: string | null;
    phone?: string | null;
    whatsappPhone?: string | null;
  };
  priceWithinCity?: number | null;
  priceOutOfCity?: number | null;
}

interface SearchPageInnerProps {
  initialVehicles: Vehicle[];
  cities: Array<{ id: string; name: string; slug: string }>;
  initialTowns: Array<{
    id: string;
    name: string;
    slug: string;
    cityId: string;
  }>;
  vehicleTypes: Array<{ id: string; name: string; slug: string }>;
}

export function SearchPageInner({
  initialVehicles,
  cities,
  initialTowns,
  vehicleTypes,
}: SearchPageInnerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [filteredVehicles, setFilteredVehicles] =
    useState<Vehicle[]>(initialVehicles);
  const [towns, setTowns] =
    useState<Array<{ id: string; name: string; slug: string; cityId: string }>>(
      initialTowns
    );

  // Filter states - initialize from URL params
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams.get("city") || "all"
  );
  const [selectedTown, setSelectedTown] = useState<string>(
    searchParams.get("town") || "all"
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(
    searchParams.get("vehicleType") || "all"
  );

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
    if (selectedCity === "all") return "All Cities";
    return cities.find((c) => c.slug === selectedCity)?.name || "City";
  };

  const getTownDisplayValue = () => {
    if (selectedTown === "all") return "All Towns";
    return towns.find((t) => t.slug === selectedTown)?.name || "Town";
  };

  const getVehicleTypeDisplayValue = () => {
    if (selectedVehicleType === "all") return "All Types";
    return (
      vehicleTypes.find((t) => t.slug === selectedVehicleType)?.name ||
      "Vehicle Type"
    );
  };

  // Vehicle type icon mapper
  const getVehicleTypeIcon = (typeName: string) => {
    const normalizedName = typeName.toLowerCase();
    // Map vehicle types to icons - you can add more mappings as needed
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

  // Sync state when URL or server data changes
  useEffect(() => {
    setVehicles(initialVehicles);
    setFilteredVehicles(initialVehicles);
  }, [initialVehicles]);

  // Sync filter state from URL
  const paramsString = searchParams.toString();
  useEffect(() => {
    setSelectedCity(searchParams.get("city") || "all");
    setSelectedTown(searchParams.get("town") || "all");
    setSelectedVehicleType(searchParams.get("vehicleType") || "all");
  }, [paramsString, searchParams]);

  // Load towns when city changes via API
  useEffect(() => {
    const loadTowns = async () => {
      if (selectedCity === "all" || !selectedCity) {
        setTowns([]);
        if (selectedTown !== "all") setSelectedTown("all");
        return;
      }

      const city = cities.find((c) => c.slug === selectedCity);
      if (!city) {
        setTowns([]);
        return;
      }

      try {
        const response = await fetch(`/api/towns?cityId=${city.id}`);
        if (response.ok) {
          const townsData = await response.json();
          setTowns(
            townsData.map((t: any) => ({
              id: t.id,
              name: t.name,
              slug: t.slug,
              cityId: t.cityId,
            }))
          );
          // Reset town selection if it's not in the new city's towns
          if (
            selectedTown !== "all" &&
            !townsData.find((t: any) => t.slug === selectedTown)
          ) {
            setSelectedTown("all");
          }
        }
      } catch (error) {
        console.error("Error loading towns:", error);
        setTowns([]);
      }
    };

    loadTowns();
  }, [selectedCity, cities, selectedTown]);

  // Filter vehicles in real-time
  useEffect(() => {
    let filtered = [...vehicles];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
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
    if (selectedCity && selectedCity !== "all") {
      filtered = filtered.filter((v) => v.city.slug === selectedCity);
    }

    // Filter by town
    if (selectedTown && selectedTown !== "all") {
      filtered = filtered.filter((v) => v.town?.slug === selectedTown);
    }

    // Filter by vehicle type
    if (selectedVehicleType && selectedVehicleType !== "all") {
      filtered = filtered.filter(
        (v) => v.vehicleType?.slug === selectedVehicleType
      );
    }

    setFilteredVehicles(filtered);
  }, [selectedCity, selectedTown, selectedVehicleType, searchQuery, vehicles]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== "all")
      params.set("city", selectedCity);
    if (selectedTown && selectedTown !== "all")
      params.set("town", selectedTown);
    if (selectedVehicleType && selectedVehicleType !== "all")
      params.set("vehicleType", selectedVehicleType);

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/view-all-vehicles${newUrl}`, { scroll: false });
  }, [selectedCity, selectedTown, selectedVehicleType, router]);

  const handleResetFilters = () => {
    setSelectedCity("all");
    setSelectedTown("all");
    setSelectedVehicleType("all");
    setSearchQuery("");
  };

  const hasActiveFilters = !!(
    (selectedCity && selectedCity !== "all") ||
    (selectedTown && selectedTown !== "all") ||
    (selectedVehicleType && selectedVehicleType !== "all") ||
    searchQuery
  );

  return (
    <div className="min-h-screen bg-foreground/5 pt-32">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Find Your Perfect Ride
          </h1>
          <p className="text-muted-foreground">
            Browse our wide selection of verified vehicles for any journey.
          </p>
        </div>

        <div className="pb-4 pt-2 mb-8 border-b border-border">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Input */}
            <div className="w-full lg:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle, city, or town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-border rounded-none h-10 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            {/* Dropdowns */}
            <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-3 overflow-x-auto pb-1 sm:pb-0 items-center">
              {/* City Combobox */}
              <Combobox
                value={selectedCity}
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
                value={selectedTown}
                onValueChange={(value) => {
                  setSelectedTown(value || "all");
                  setTownSearch("");
                }}
                disabled={
                  !selectedCity || selectedCity === "all" || towns.length === 0
                }
              >
                <ComboboxInput
                  placeholder={getTownDisplayValue()}
                  value={townSearch}
                  onChange={(e) => setTownSearch(e.target.value)}
                  className="w-full sm:w-[180px] h-10 rounded-none border-border"
                  showClear={townSearch.length > 0}
                  disabled={
                    !selectedCity || selectedCity === "all" || towns.length === 0
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
                value={selectedVehicleType}
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
                  onClick={handleResetFilters}
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

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredVehicles.length}{" "}
            {filteredVehicles.length === 1 ? "Result" : "Results"}
          </h2>
        </div>

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
    </div>
  );
}
