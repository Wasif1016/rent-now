import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { resolveVehiclesSlug } from '@/lib/seo-resolver'
import { CategoryLandingPage } from '@/components/city/category-landing-page'
import { ModelLandingPage } from '@/components/city/model-landing-page'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function VehiclesSlugPage({ params }: PageProps) {
  const { slug } = await params
  const resolved = await resolveVehiclesSlug(slug)

  if (resolved.pageType === 'not_found') {
    notFound()
  }

  if (resolved.pageType === 'category' && resolved.category) {
    return <CategoryLandingPage category={resolved.category} />
  }

  if (resolved.pageType === 'model' && resolved.model) {
    return (
      <ModelLandingPage
        model={{
          id: resolved.model.id,
          name: resolved.model.name,
          slug: resolved.model.slug,
          vehicleBrand: resolved.model.vehicleBrand,
        }}
      />
    )
  }

  notFound()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const resolved = await resolveVehiclesSlug(slug)

  if (resolved.pageType === 'not_found') {
    return { title: 'Not Found' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'rentnow.com'
  const canonical = `https://${baseUrl}/vehicles/${slug}`

  if (resolved.pageType === 'category' && resolved.category) {
    const name = resolved.category.name.replace(/-/g, ' ')
    const title = `${name.charAt(0).toUpperCase() + name.slice(1)} Rental | Rent Now`
    return {
      title,
      description: `Rent ${resolved.category.name} vehicles. Compare prices and book with trusted vendors across Pakistan.`,
      alternates: { canonical },
    }
  }

  if (resolved.pageType === 'model' && resolved.model) {
    const displayName = `${resolved.model.vehicleBrand.name} ${resolved.model.name}`
    return {
      title: `Rent ${displayName} | Compare Prices | Rent Now`,
      description: `Find ${displayName} rental listings. Compare vendors and book with a small advance.`,
      alternates: { canonical },
    }
  }

  return { title: 'Not Found' }
}
