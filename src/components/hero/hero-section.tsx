import { HeroSearchForm } from './hero-search-form'
import { getCities, getVehicleFilters } from '@/lib/data'
import Image from 'next/image'

interface HeroSectionProps {
  heading?: string
}

export async function HeroSection({ heading }: HeroSectionProps) {
  // Fetch all cities and vehicle models in parallel (hero shows all cities so user can select any)
  const [cities, vehicleFilters] = await Promise.all([
    getCities(),
    getVehicleFilters(),
  ])

  // Transform data to minimize serialization
  const citiesData = cities.map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    province: city.province,
  }))

  const vehicleModelsData = vehicleFilters.map(model => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    brand: {
      id: model.brand.id,
      name: model.brand.name,
      slug: model.brand.slug,
    },
  }))

  return (
    <section className="relative bg-background h-svh px-4 py-12 lg:py-20 overflow-hidden flex items-end pb-24 lg:pb-0 lg:items-center">
      {/* Desktop Image */}
      <div className="absolute inset-0 w-full h-full lg:block hidden">
        <Image
          src="/home/hero-desktop.webp"
          alt="Car rental service"
          fill
          className="object-cover object-top"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>
      {/* Mobile Image */}
      <div className="absolute inset-0 w-full h-full block lg:hidden">
        <Image
          src="/home/hero-mobile.webp"
          alt="Car rental service"
          fill
          className="object-cover object-top"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>
      <div className="w-full container mx-auto">
        <div className='relative z-10 max-w-[500px]'>
          <HeroSearchForm
            cities={citiesData}
            vehicleModels={vehicleModelsData}
            heading={heading}
          />
        </div>
      </div>
    </section>
  )
}
