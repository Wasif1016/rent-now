import { KEYWORDS, DEFAULT_TEMPLATES } from "./routes-config";
import {
  getCityBySlug,
  getVehicleCategoryBySlug,
  getVehicleModelBySlug,
  getRouteBySlug,
  getTownBySlug,
} from "./data";

/** Capacity slugs for URL segments (e.g. 7-seater). */
export const CAPACITY_SLUGS = [
  "2-seater",
  "4-seater",
  "5-seater",
  "7-seater",
  "9-seater",
  "12-seater",
  "15-seater",
  "22-seater",
  "30-seater",
  "30-plus-seater",
] as const;

export type CapacitySlug = (typeof CAPACITY_SLUGS)[number];

export function isCapacitySlug(s: string): s is CapacitySlug {
  return (CAPACITY_SLUGS as readonly string[]).includes(s);
}

/** Driver filter slugs for URL segments (e.g. with-driver, without-driver). */
export const DRIVER_FILTER_SLUGS = ["with-driver", "without-driver"] as const;

export function isDriverFilterSlug(s: string): boolean {
  return (DRIVER_FILTER_SLUGS as readonly string[]).includes(s);
}

/** Reserved first segment: vehicles → category/model pages. */
export const VEHICLES_PREFIX = "vehicles";

/** Reserved segments: routes, search, cities → not keyword pages. */
export const RESERVED_FIRST_SEGMENTS = new Set([
  VEHICLES_PREFIX,
  "routes",
  "search",
  "cities",
  "listings",
]);

export type ResolvedPageType =
  | "keyword_only"
  | "keyword_city"
  | "keyword_city_model"
  | "keyword_filter_city"
  | "keyword_model"
  | "keyword_route"
  | "keyword_route_model"
  | "keyword_filter_route"
  | "keyword_city_town"
  | "vehicle_model"
  | "vehicle_category"
  | "vehicle_model_city"
  | "vehicle_model_city_town"
  | "not_found";

/** Filter type for keyword_filter_city pages. */
export type FilterType = "DRIVER" | "SEATING" | "PRICE";

export type ResolvedResult = {
  pageType: ResolvedPageType;
  keyword?: { slug: string; label: string };
  city?: { id: string; name: string; slug: string };
  town?: { id: string; name: string; slug: string };
  model?: {
    id: string;
    name: string;
    slug: string;
    vehicleBrand: { name: string; slug: string };
    vehicleType?: { name: string } | null;
    capacity?: number | null;
  };
  category?: { id: string; name: string; slug: string };
  capacity?: number; // e.g. 7 for 7-seater
  /** Second segment for keyword_filter_city (e.g. with-driver, 7-seater). */
  filterSlug?: string;
  /** Filter type for keyword_filter_city. */
  filterType?: FilterType;
  /** Resolved route (SEO Route model) for keyword_route, keyword_route_model, keyword_filter_route. */
  route?: Awaited<ReturnType<typeof getRouteBySlug>>;
  canonical: string;
  segments: string[];
};

/**
 * Resolves [...segments] under (keyword) to page type and entities.
 */
export async function resolveKeywordSegments(
  segments: string[]
): Promise<ResolvedResult> {
  const canonical = "/" + segments.join("/");
  const notFound: ResolvedResult = {
    pageType: "not_found",
    canonical,
    segments,
  };

  if (segments.length === 0) {
    return notFound;
  }

  const [first, second, third] = segments;

  if (RESERVED_FIRST_SEGMENTS.has(first)) {
    return notFound;
  }

  const keyword = KEYWORDS[first];
  if (!keyword) {
    // If not a keyword, it could be a model-first URL (e.g. /toyota-corolla/karachi/clifton)
    const vehiclesResolved = await resolveVehiclesSegments(segments);
    if (vehiclesResolved.pageType !== "not_found") {
      return {
        ...vehiclesResolved,
        canonical,
        segments,
      } as ResolvedResult;
    }
    return notFound;
  }

  const keywordData = { slug: keyword.slug, label: keyword.label };

  if (segments.length === 1) {
    return {
      pageType: "keyword_only",
      keyword: keywordData,
      canonical,
      segments,
    };
  }

  if (segments.length === 2) {
    const city = await getCityBySlug(second);
    if (city) {
      return {
        pageType: "keyword_city",
        keyword: keywordData,
        city: {
          id: city.id,
          name: city.name,
          slug: city.slug,
        },
        canonical,
        segments,
      };
    }
    const route = await getRouteBySlug(second);
    if (route) {
      return {
        pageType: "keyword_route",
        keyword: keywordData,
        route,
        canonical,
        segments,
      };
    }

    const model = await getVehicleModelBySlug(second);
    if (model) {
      const m = model as any;
      return {
        pageType: "keyword_model",
        keyword: keywordData,
        model: {
          id: m.id,
          name: m.name,
          slug: m.slug,
          vehicleBrand: m.vehicleBrand,
          vehicleType: m.vehicleType ?? undefined,
          capacity: m.capacity ?? undefined,
        },
        canonical,
        segments,
      };
    }

    return notFound;
  }

  if (segments.length === 3) {
    const citySecond = await getCityBySlug(second);
    const categorySecond = await getVehicleCategoryBySlug(second);
    const capacitySecond = isCapacitySlug(second)
      ? second === "30-plus-seater"
        ? 30
        : parseInt(second.replace(/-seater$/, ""), 10)
      : undefined;

    if (citySecond) {
      const model = await getVehicleModelBySlug(third);
      if (model) {
        const m = model as any;
        return {
          pageType: "keyword_city_model",
          keyword: keywordData,
          city: {
            id: citySecond.id,
            name: citySecond.name,
            slug: citySecond.slug,
          },
          model: {
            id: m.id,
            name: m.name,
            slug: m.slug,
            vehicleBrand: m.vehicleBrand,
            vehicleType: m.vehicleType ?? undefined,
            capacity: m.capacity ?? undefined,
          },
          canonical,
          segments,
        };
      }

      let town = await getTownBySlug(third, citySecond.id);
      if (!town) {
        // Try prefixed slug (e.g. karachi-clifton)
        town = await getTownBySlug(
          `${citySecond.slug}-${third}`,
          citySecond.id
        );
      }

      if (town) {
        return {
          pageType: "keyword_city_town",
          keyword: keywordData,
          city: {
            id: citySecond.id,
            name: citySecond.name,
            slug: citySecond.slug,
          },
          town: {
            id: town.id,
            name: town.name,
            slug: town.slug,
          },
          canonical,
          segments,
        };
      }

      return notFound;
    }

    const cityThird = await getCityBySlug(third);
    if (cityThird && isDriverFilterSlug(second)) {
      return {
        pageType: "keyword_filter_city",
        keyword: keywordData,
        filterSlug: second,
        filterType: "DRIVER" as const,
        city: {
          id: cityThird.id,
          name: cityThird.name,
          slug: cityThird.slug,
        },
        canonical,
        segments,
      };
    }

    if (
      cityThird &&
      (categorySecond || capacitySecond !== undefined || isCapacitySlug(second))
    ) {
      const cap =
        capacitySecond ??
        (isCapacitySlug(second)
          ? second === "30-plus-seater"
            ? 30
            : parseInt(second.replace(/-seater$/, ""), 10)
          : undefined);
      return {
        pageType: "keyword_filter_city",
        keyword: keywordData,
        category: categorySecond
          ? {
              id: categorySecond.id,
              name: categorySecond.name,
              slug: categorySecond.slug,
            }
          : undefined,
        capacity: cap,
        filterSlug: second,
        filterType:
          cap !== undefined
            ? ("SEATING" as const)
            : categorySecond
            ? ("PRICE" as const)
            : undefined,
        city: {
          id: cityThird.id,
          name: cityThird.name,
          slug: cityThird.slug,
        },
        canonical,
        segments,
      };
    }

    const routeSecond = await getRouteBySlug(second);
    const modelThird = await getVehicleModelBySlug(third);
    if (routeSecond && modelThird) {
      const m = modelThird as any;
      return {
        pageType: "keyword_route_model",
        keyword: keywordData,
        route: routeSecond,
        model: {
          id: m.id,
          name: m.name,
          slug: m.slug,
          vehicleBrand: m.vehicleBrand,
          vehicleType: m.vehicleType ?? undefined,
          capacity: m.capacity ?? undefined,
        },
        canonical,
        segments,
      };
    }

    if (isDriverFilterSlug(second)) {
      const routeThird = await getRouteBySlug(third);
      if (routeThird) {
        return {
          pageType: "keyword_filter_route",
          keyword: keywordData,
          filterSlug: second,
          filterType: "DRIVER" as const,
          route: routeThird,
          canonical,
          segments,
        };
      }
    }
  }

  return notFound;
}

/**
 * Resolves /vehicles/[...segments] to category, model, city-model, or town-model pages.
 */
export async function resolveVehiclesSegments(segments: string[]): Promise<
  | {
      pageType: "vehicle_category";
      category: { id: string; name: string; slug: string };
    }
  | {
      pageType: "vehicle_model";
      model: Awaited<ReturnType<typeof getVehicleModelBySlug>>;
    }
  | {
      pageType: "vehicle_model_city";
      model: Awaited<ReturnType<typeof getVehicleModelBySlug>>;
      city: { id: string; name: string; slug: string };
    }
  | {
      pageType: "vehicle_model_city_town";
      model: Awaited<ReturnType<typeof getVehicleModelBySlug>>;
      city: { id: string; name: string; slug: string };
      town: { id: string; name: string; slug: string };
    }
  | { pageType: "not_found" }
> {
  if (segments.length === 0) return { pageType: "not_found" };

  const first = segments[0];

  // Case 1: /vehicles/[slug]
  if (segments.length === 1) {
    const category = await getVehicleCategoryBySlug(first);
    if (category) {
      return {
        pageType: "vehicle_category",
        category: { id: category.id, name: category.name, slug: category.slug },
      };
    }
    const model = await getVehicleModelBySlug(first);
    if (model) {
      return { pageType: "vehicle_model", model };
    }
    return { pageType: "not_found" };
  }

  // Case 2: /vehicles/[model]/[city]
  if (segments.length === 2) {
    const model = await getVehicleModelBySlug(first);
    const city = await getCityBySlug(segments[1]);
    if (model && city) {
      return {
        pageType: "vehicle_model_city",
        model,
        city: { id: city.id, name: city.name, slug: city.slug },
      };
    }
    return { pageType: "not_found" };
  }

  // Case 3: /vehicles/[model]/[city]/[town]
  if (segments.length === 3) {
    const model = await getVehicleModelBySlug(first);
    const city = await getCityBySlug(segments[1]);
    if (model && city) {
      let town = await getTownBySlug(segments[2], city.id);
      if (!town) {
        town = await getTownBySlug(`${city.slug}-${segments[2]}`, city.id);
      }
      if (town) {
        return {
          pageType: "vehicle_model_city_town",
          model,
          city: { id: city.id, name: city.name, slug: city.slug },
          town: { id: town.id, name: town.name, slug: town.slug },
        };
      }
    }
    return { pageType: "not_found" };
  }

  return { pageType: "not_found" };
}
