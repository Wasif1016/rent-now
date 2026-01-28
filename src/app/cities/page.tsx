import { CitiesHeroSection } from '@/components/cities/cities-hero-section'
import { FeaturedHubs } from '@/components/cities/featured-hubs'
import { AllLocationsDirectory } from '@/components/cities/all-locations-directory'
import { NationwideFleet } from '@/components/cities/nationwide-fleet'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Car Rental Services in 100+ Cities Across Pakistan | Rent Now',
  description: 'From major metropolitan hubs to remote scenic towns, book verified vehicles with professional drivers for every journey. Discover the luxury of convenience nationwide.',
  openGraph: {
    title: 'Car Rental Services in 100+ Cities Across Pakistan',
    description: 'From major metropolitan hubs to remote scenic towns, book verified vehicles with professional drivers for every journey.',
  },
}

export default async function CitiesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <CitiesHeroSection />
      <FeaturedHubs />
      <AllLocationsDirectory />
      <NationwideFleet />
    </main>
  )
}

