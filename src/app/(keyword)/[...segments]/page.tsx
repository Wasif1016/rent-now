import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { resolveKeywordSegments, RESERVED_FIRST_SEGMENTS } from '@/lib/seo-resolver'
import { KeywordLandingPage } from '@/components/keyword/keyword-landing-page'
import { CityLandingPage } from '@/components/city/city-landing-page'
import { CityKeywordModelLandingPage } from '@/components/city/city-keyword-model-landing-page'
import { CityKeywordFilterLandingPage } from '@/components/city/city-keyword-filter-landing-page'
import { CityKeywordRouteLandingPage } from '@/components/route/city-keyword-route-landing-page'
import { CityKeywordRouteModelLandingPage } from '@/components/route/city-keyword-route-model-landing-page'
import { KeywordModelLandingPage } from '@/components/keyword/keyword-model-landing-page'
import { generateMetadataFromResolved } from '@/lib/seo'

type PageProps = {
  params: Promise<{ segments: string[] }>
}

export default async function DynamicKeywordPage({ params }: PageProps) {
  const { segments } = await params
  if (!segments?.length || RESERVED_FIRST_SEGMENTS.has(segments[0])) {
    notFound()
  }

  const resolved = await resolveKeywordSegments(segments)
  if (resolved.pageType === 'not_found') {
    notFound()
  }

  if (resolved.pageType === 'keyword_only' && resolved.keyword) {
    return <KeywordLandingPage keyword={resolved.keyword.slug} />
  }

  if (resolved.pageType === 'keyword_model' && resolved.keyword && resolved.model) {
    return (
      <KeywordModelLandingPage
        keywordSlug={resolved.keyword.slug}
        modelSlug={resolved.model.slug}
        modelName={resolved.model.name}
        brandName={resolved.model.vehicleBrand.name}
        vehicleCategory={resolved.model.vehicleType?.name}
        seatingCapacity={resolved.model.capacity}
        driverOption="With Driver / Without Driver / Both"
      />
    )
  }

  if (resolved.pageType === 'keyword_city' && resolved.keyword && resolved.city) {
    return (
      <CityLandingPage
        city={resolved.city.slug}
        keyword={resolved.keyword.slug}
      />
    )
  }

  if (resolved.pageType === 'keyword_city_model' && resolved.keyword && resolved.city && resolved.model) {
    return (
      <CityKeywordModelLandingPage
        citySlug={resolved.city.slug}
        cityName={resolved.city.name}
        keywordSlug={resolved.keyword.slug}
        modelSlug={resolved.model.slug}
        modelName={resolved.model.name}
        brandName={resolved.model.vehicleBrand.name}
        vehicleCategory={resolved.model.vehicleType?.name}
        seatingCapacity={resolved.model.capacity}
        driverOption="With Driver / Without Driver / Both"
      />
    )
  }

  if (resolved.pageType === 'keyword_filter_city' && resolved.keyword && resolved.city && resolved.filterSlug) {
    return (
      <CityKeywordFilterLandingPage
        citySlug={resolved.city.slug}
        cityName={resolved.city.name}
        keywordSlug={resolved.keyword.slug}
        filterSlug={resolved.filterSlug}
        filterType={resolved.filterType}
        category={resolved.category}
        capacity={resolved.capacity}
      />
    )
  }

  if (resolved.pageType === 'keyword_route' && resolved.keyword && resolved.route) {
    return (
      <CityKeywordRouteLandingPage
        keywordSlug={resolved.keyword.slug}
        route={resolved.route}
      />
    )
  }

  if (resolved.pageType === 'keyword_route_model' && resolved.keyword && resolved.route && resolved.model) {
    return (
      <CityKeywordRouteModelLandingPage
        keywordSlug={resolved.keyword.slug}
        route={resolved.route}
        modelSlug={resolved.model.slug}
        modelName={resolved.model.name}
        brandName={resolved.model.vehicleBrand.name}
        seatingCapacity={resolved.model.capacity}
      />
    )
  }

  if (resolved.pageType === 'keyword_filter_route' && resolved.keyword && resolved.route && resolved.filterSlug) {
    return (
      <CityKeywordRouteLandingPage
        keywordSlug={resolved.keyword.slug}
        route={resolved.route}
      />
    )
  }

  notFound()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments } = await params
  if (!segments?.length || RESERVED_FIRST_SEGMENTS.has(segments[0])) {
    return { title: 'Not Found' }
  }

  const resolved = await resolveKeywordSegments(segments)
  if (resolved.pageType === 'not_found') {
    return { title: 'Not Found' }
  }

  return generateMetadataFromResolved(resolved)
}
