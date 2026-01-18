import { HeroSearchForm } from './hero-search-form'
import { HeroCarousel } from './hero-carousel'
import { getCitiesWithVehicles, getVehicleBrandsWithVehicles } from '@/lib/data'

export async function HeroSection() {
  // Fetch cities and brands in parallel using Server Components
  const [cities, brands] = await Promise.all([
    getCitiesWithVehicles(),
    getVehicleBrandsWithVehicles(),
  ])

  // Transform data to minimize serialization
  const citiesData = cities.map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    province: city.province,
  }))

  const brandsData = brands.map(brand => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
  }))

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden  px-4 sm:px-6 lg:px-16 py-12 lg:py-20" >
      {/* Background Carousel */}
      <HeroCarousel />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg">
        <HeroSearchForm cities={citiesData} brands={brandsData} />
      </div>
    </section>
  )
}
