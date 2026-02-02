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
    <section className="relative bg-background min-h-screen px-6 py-12 lg:py-20 overflow-hidden flex items-end pb-8 lg:pb-0 lg:items-center">
      <div className="absolute top left-0 right-0 bottom-0 h-[100vh]">
        <Image
          src="/home/hero-desktop.webp"
          alt="Car rental service"
          width={1000}
          height={1000}
          className="object-cover object-top w-full h-[100vh] lg:block hidden"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <Image
          src="/home/hero-mobile.webp"
          alt="Car rental service"
          width={1000}
          height={1000}
          className="object-cover object-top h-[100vh] block lg:hidden"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
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
