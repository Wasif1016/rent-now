/**
 * Custom hook for loading towns when city changes
 * Used across multiple components that need town data
 */

import { useState, useEffect } from "react";
import type { Town } from "@/types";

interface UseTownsLoaderOptions {
  cityId?: string;
  citySlug?: string;
  cities?: Array<{ id: string; slug: string }>;
  enabled?: boolean;
}

interface UseTownsLoaderResult {
  towns: Town[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to load towns based on city selection
 * @param options - Configuration options
 * @returns Towns array, loading state, and error
 */
export function useTownsLoader(
  options: UseTownsLoaderOptions = {}
): UseTownsLoaderResult {
  const { cityId, citySlug, cities, enabled = true } = options;
  const [towns, setTowns] = useState<Town[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If disabled or no city selected, clear towns
    if (!enabled || (!cityId && !citySlug)) {
      setTowns([]);
      setLoading(false);
      return;
    }

    // Get city ID from slug if needed
    let targetCityId = cityId;
    if (!targetCityId && citySlug && cities) {
      const city = cities.find((c) => c.slug === citySlug);
      if (!city) {
        setTowns([]);
        setLoading(false);
        return;
      }
      targetCityId = city.id;
    }

    if (!targetCityId) {
      setTowns([]);
      setLoading(false);
      return;
    }

    // Load towns
    const loadTowns = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/towns?cityId=${targetCityId}`);
        if (!response.ok) {
          throw new Error("Failed to load towns");
        }

        const townsData = await response.json();
        setTowns(
          townsData.map((t: any) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            cityId: t.cityId,
          }))
        );
      } catch (err) {
        console.error("Error loading towns:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setTowns([]);
      } finally {
        setLoading(false);
      }
    };

    loadTowns();
  }, [cityId, citySlug, cities, enabled]);

  return { towns, loading, error };
}
