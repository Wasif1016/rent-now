import { CheckCircle2, Percent, Headphones } from 'lucide-react'
import Image from 'next/image'

export function NationwideFleet() {
  return (
    <section className="py-12 lg:py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Nationwide Fleet, Local Expertise
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Whether you need a luxury sedan in Lahore or a rugged 4x4 in Skardu, our platform connects you with the most reliable local rental companies. We bridge the gap between traditional rental agencies and modern digital travelers.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="flex flex-col items-start space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <p className="text-primary font-semibold text-sm">Verified Vendors</p>
              </div>

              <div className="flex flex-col items-start space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Percent className="h-6 w-6 text-primary" />
                </div>
                <p className="text-primary font-semibold text-sm">2% Booking Advance</p>
              </div>

              <div className="flex flex-col items-start space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <p className="text-primary font-semibold text-sm">24/7 Support</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
            <Image
              src="/home/hero-desktop.webp"
              alt="Car rental service"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Safe Travels, Anywhere.
              </h3>
              <p className="text-white/70 text-sm font-semibold">
                Pakistan's most trusted rental network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

