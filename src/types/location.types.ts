/**
 * Location-related type definitions
 * Centralized types for cities, towns, and locations
 */

// Base city type
export interface City {
  id: string;
  name: string;
  slug: string;
  province?: string | null;
}

// City with vehicle counts
export interface CityWithCounts extends City {
  _count?: {
    vehicles?: number;
  };
}

// Town type
export interface Town {
  id: string;
  name: string;
  slug: string;
  cityId: string;
}

// Town with city relation
export interface TownWithCity extends Town {
  city?: City;
}

// Location option for selects/dropdowns
export interface LocationOption {
  id: string;
  name: string;
  slug: string;
  province?: string | null;
}

// City option for forms
export interface CityOption {
  id: string;
  name: string;
  slug: string;
  province?: string | null;
}
