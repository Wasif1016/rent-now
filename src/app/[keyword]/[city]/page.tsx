import { notFound } from 'next/navigation'
import { getCityStatsBySlug } from '@/lib/data'
import { generateCityPageMetadata } from '@/lib/seo'
import { KEYWORD_CONFIG } from '@/lib/keyword-pages'
import BaseCityPage from '@/app/rent-cars/[city]/page'

interface PageProps {
  params: Promise<{ keyword: string; city: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { keyword, city: citySlug } = await params

  const keywordLabel = KEYWORD_CONFIG[keyword]
  if (!keywordLabel) {
    return {
      title: 'Page Not Found | Rent Now',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

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

  // Reuse city metadata and canonical (to /rent-a-car/{city_slug})
  return generateCityPageMetadata(
    { id: stats.city.id, name: stats.city.name, slug: stats.city.slug },
    stats.vehiclesCount,
    stats.vendorsCount === 0 ? { noindex: true } : undefined
  )
}

export default function KeywordCityPage(props: any) {
  // Delegate rendering to the base city page. The keyword is used only for routing/SEO,
  // not for changing the underlying template content. We pass a flag so the base page
  // can adjust UX (e.g. avoid showing a hard \"No Results\" state for keyword URLs).
  if (!props) {
    notFound()
  }

  return <BaseCityPage {...props} isKeywordRoute />
}
