import { HeroSection } from '@/components/hero/hero-section'
import { HowItWorks } from '@/components/home/how-it-works'
import { BrowseByCity } from '@/components/home/browse-by-city'
import { BrowseByVehicleType } from '@/components/home/browse-by-vehicle-type'
import { PopularRoutes } from '@/components/home/popular-routes'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { ListYourCar } from '@/components/home/list-your-car'
import { SeoFooter } from '@/components/home/seo-footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <BrowseByCity />
      <BrowseByVehicleType />
      <PopularRoutes />
      <WhyChooseUs />
      <ListYourCar />
      <SeoFooter />
    </main>
  )
}
