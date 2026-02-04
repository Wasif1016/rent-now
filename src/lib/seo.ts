import type { Metadata } from "next";
import { KEYWORDS, DEFAULT_TEMPLATES, FAQS } from "./routes-config";
import type { ResolvedResult } from "./seo-resolver";

interface SEOConfig {
  title: string;
  description: string;
  path: string;
}

const siteName = "Rent Now";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "www.rentnowpk.com";

function applyTemplate(
  template: string,
  variables: Record<string, string | number | undefined | null>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = variables[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}

/**
 * Generates the variables needed for template replacement.
 */
export function getTemplateVariables(resolved: ResolvedResult) {
  const vars: Record<string, string | number | undefined | null> = {
    keyword: resolved.keyword?.label || "Rent a Car",
    keyword_lower: (resolved.keyword?.label || "Rent a Car").toLowerCase(),
    city: resolved.city?.name || "",
    from_city: resolved.route?.originCity.name || "",
    to_city: resolved.route?.destinationCity.name || "",
    brand: resolved.model?.vehicleBrand.name || "",
    model: resolved.model?.name || "",
    category:
      resolved.category?.name || resolved.model?.vehicleType?.name || "",
    capacity: resolved.capacity || resolved.model?.capacity || "",
    town: resolved.town?.name || "",
  };
  return vars;
}

/**
 * Resolves SEO templates based on the resolved page type and data.
 */
export function resolveSeoTemplates(resolved: ResolvedResult) {
  const keywordConfig = resolved.keyword
    ? KEYWORDS[resolved.keyword.slug]
    : null;
  const pageType = resolved.pageType;

  // 1. Try Keyword-specific template override
  let template = (keywordConfig?.templates as any)?.[pageType];

  // 2. Fallback to default template for the page type
  if (!template) {
    template = DEFAULT_TEMPLATES[pageType];
  }

  // 3. Last fallback (e.g. if pageType doesn't have a default)
  if (!template && pageType.startsWith("keyword_")) {
    template = DEFAULT_TEMPLATES.keyword_only;
  }

  if (!template) {
    return {
      h1: siteName,
      title: siteName,
      description: "Book reliable vehicles with drivers across Pakistan.",
    };
  }

  const vars = getTemplateVariables(resolved);

  return {
    h1: applyTemplate(template.h1, vars),
    title: applyTemplate(template.title, vars),
    description: applyTemplate(template.description, vars),
  };
}

/**
 * Resolves FAQ templates based on the resolved page type.
 */
export function resolveFaqs(resolved: ResolvedResult) {
  let faqList = FAQS.city; // Default

  if (resolved.pageType.includes("route")) {
    faqList = FAQS.route;
  } else if (resolved.keyword?.slug.includes("airport")) {
    faqList = FAQS.airport;
  }

  const vars = getTemplateVariables(resolved);

  return faqList.map((item) => ({
    q: applyTemplate(item.q, vars),
    a: applyTemplate(item.a, vars),
  }));
}

export function generateMetadata(config: SEOConfig): Metadata {
  const { title, description, path } = config;
  const canonical = `https://${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * The primary way to generate metadata from a ResolvedResult.
 */
export function generateMetadataFromResolved(
  resolved: ResolvedResult
): Metadata {
  const templates = resolveSeoTemplates(resolved);
  return generateMetadata({
    title: templates.title,
    description: templates.description,
    path: resolved.canonical,
  });
}

export function generateBreadcrumbs(resolved: ResolvedResult) {
  const items = [{ name: "Home", url: "/" }];
  const vars = getTemplateVariables(resolved);

  if (resolved.keyword) {
    items.push({
      name: resolved.keyword.label,
      url: `/${resolved.keyword.slug}`,
    });
  }

  if (resolved.city) {
    items.push({
      name: resolved.city.name,
      url: `${resolved.canonical}`,
    });
  }

  return items;
}

export function generateStructuredData(
  resolved: ResolvedResult,
  vehicles?: Array<{
    id: string;
    title: string;
    slug: string;
    images: string[] | null;
    vendor: { name: string };
  }>
) {
  const structuredData: any[] = [];
  const vars = getTemplateVariables(resolved);

  // BreadcrumbList
  const breadcrumbs = generateBreadcrumbs(resolved);
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://${siteUrl}${item.url}`,
    })),
  });

  // ItemList for search results
  if (vehicles && vehicles.length > 0) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Cars available for ${vars.keyword} in ${vars.city || "Pakistan"}`,
      description: `Browse available cars for ${vars.keyword}`,
      numberOfItems: vehicles.length,
      itemListElement: vehicles.map((vehicle, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: vehicle.title,
          description: `${vehicle.title} available for rent`,
          url: `https://${siteUrl}/listings/${vehicle.slug}`,
          image: (vehicle.images as string[])?.[0] || "",
          brand: {
            "@type": "Brand",
            name: vehicle.vendor.name,
          },
        },
      })),
    });
  }

  return structuredData;
}

export function generateFaqSchema(resolved: ResolvedResult) {
  const faqs = resolveFaqs(resolved);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
