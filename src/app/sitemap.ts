import { MetadataRoute } from "next";
import { KEYWORDS } from "@/lib/routes-config";
import {
  getAllCitiesForStatic,
  getCategorySlugs,
  getModelSlugs,
  getRoutesForSitemap,
  getAllTownsForSitemap,
} from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "www.rentnowpk.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const keywordSlugs = Object.keys(KEYWORDS);
  const [cities, categorySlugs, modelSlugs, routeSlugs, towns] =
    await Promise.all([
      getAllCitiesForStatic(),
      getCategorySlugs(),
      getModelSlugs(),
      getRoutesForSitemap(),
      getAllTownsForSitemap(),
    ]);

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/404`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
  ];

  // Keyword-only pages
  for (const slug of keywordSlugs) {
    sitemap.push({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Keyword + city pages
  for (const keyword of keywordSlugs) {
    for (const city of cities) {
      sitemap.push({
        url: `${siteUrl}/${keyword}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  // Vehicle category pages
  for (const slug of categorySlugs) {
    sitemap.push({
      url: `${siteUrl}/vehicles/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Vehicle model pages
  for (const slug of modelSlugs) {
    sitemap.push({
      url: `${siteUrl}/vehicles/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Route pages (only routes with vehicles)
  for (const r of routeSlugs) {
    sitemap.push({
      url: `${siteUrl}/routes/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Keyword + route pages (e.g. rent-a-car/lahore-to-islamabad)
  const rentACarSlug = keywordSlugs.includes("rent-a-car")
    ? "rent-a-car"
    : keywordSlugs[0];
  for (const r of routeSlugs) {
    sitemap.push({
      url: `${siteUrl}/${rentACarSlug}/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Keyword + City + Town pages (Limit to top keywords to avoid >50k sitemap limit)
  const townKeywords = [
    "rent-a-car",
    "car-on-rent",
    "car-hire",
    "airport-transfer",
  ];
  for (const keyword of townKeywords) {
    if (!KEYWORDS[keyword]) continue;
    for (const t of towns) {
      if (!t.city?.slug) continue;
      sitemap.push({
        url: `${siteUrl}/${keyword}/${t.city.slug}/${t.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return sitemap;
}
