"use client";

import { useState, FormEvent, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

interface City {
  id: string;
  name: string;
  slug: string;
  province: string | null;
}

interface HeroSearchFormProps {
  cities: City[];
  vehicleModels?: any[];
  heading?: string;
}

export function HeroSearchForm({ cities, heading }: HeroSearchFormProps) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const query = searchQuery.toLowerCase();
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.province && c.province.toLowerCase().includes(query))
    );
  }, [cities, searchQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCitySelect = (selectedCity: City) => {
    setCity(selectedCity.slug);
    setSearchQuery(selectedCity.name);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
    if (e.target.value === "") {
      setCity("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (city) {
      const params = new URLSearchParams();
      params.set("city", city);
      router.push(`/view-all-vehicles?${params.toString()}`);
    } else if (searchQuery) {
      // If user typed something but didn't select, try to find match
      const match = cities.find(
        (c) => c.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (match) {
        const params = new URLSearchParams();
        params.set("city", match.slug);
        router.push(`/view-all-vehicles?${params.toString()}`);
      }
    }
  };

  return (
    <div className="bg-primary p-4 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="mb-4">
          <h1 className="text-xl sm:text-3xl lg:text-2xl font-bold text-foreground leading-tight">
            {heading ??
              "Book Verified Cars, Hiace, Vans & Buses Across Pakistan"}
          </h1>
        </div>

        <div className="space-y-2 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Input
              ref={inputRef}
              id="city"
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownOpen(true)}
              className="pl-10 h-10 w-full bg-background text-foreground rounded-none border-gray-200 focus:ring-primary focus:border-primary"
              autoComplete="off"
            />

            {isDropdownOpen && (filteredCities.length > 0 || searchQuery) && (
              <div
                ref={dropdownRef}
                className={`absolute left-0 right-0 top-full mt-1 p-0 bg-background border border-border shadow-lg z-50 md:min-h-50 md:max-h-50 min-h-42 max-h-42 overflow-y-auto ${
                  filteredCities.length > 0
                    ? ""
                    : "flex items-center justify-center h-full w-full"
                }`}
              >
                {filteredCities.length > 0 ? (
                  <ul className="">
                    {filteredCities.map((c) => (
                      <li
                        key={c.id}
                        onClick={() => handleCitySelect(c)}
                        className={`px-4 py-2 hover:bg-primary/60 cursor-pointer text-sm transition-colors flex items-center gap-2
                          ${c.slug === city ? "bg-primary/60" : ""}
                          `}
                      >
                        <Image
                          src={
                            c.slug === city
                              ? "/icons/checked-checkbox.svg"
                              : "/icons/unchecked-checkbox.svg"
                          }
                          alt={c.name}
                          width={20}
                          height={20}
                          className="h-5 w-5 shrink-0"
                        />
                        {c.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center flex items-center justify-center h-full w-full">
                    No cities found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-10 text-md font-semibold bg-foreground hover:bg-foreground/90 text-background rounded-none transition-all"
        >
          <Image
            src="/icons/car.svg"
            alt="Search"
            width={20}
            height={20}
            className="w-fit h-8"
            style={{
              transform: "scaleX(-1)",
            }}
          />
          Search
        </Button>
      </form>
    </div>
  );
}
