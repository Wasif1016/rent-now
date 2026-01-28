import { notFound } from 'next/navigation'
import { getCityStatsBySlug } from '@/lib/data'
import { generateCityPageMetadata } from '@/lib/seo'
export { generateStaticParams, default } from '@/app/rent-cars/[city]/page'

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { city: citySlug } = await params
  const stats = await getCityStatsBySlug(citySlug)

  if (!stats || !stats.city) {
    return {
      title: 'City Not Found | Rent Now',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  return generateCityPageMetadata(
    { id: stats.city.id, name: stats.city.name, slug: stats.city.slug },
    stats.vehiclesCount,
    { noindex: true }
  )
}

export default function CityPageWrapper() {
  // This component should never be rendered directly because we re-export the
  // default export from `/rent-cars/[city]/page`. Keeping this here as a
  // safeguard in case of misuse.
  notFound()
}


