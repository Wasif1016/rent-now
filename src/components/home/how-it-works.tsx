import {
  MapPin,
  Car,
  PhoneCall,
  Search as SearchIcon,
  ShieldCheck,
} from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: 'Search Near You',
      description:
        'Find vehicles in your city and specific town with ease. Our hyper-local search covers all major Pakistani hubs.',
      footerIcon: SearchIcon,
      footerLabel: 'SEARCH PAKISTAN',
    },
    {
      icon: Car,
      title: 'Pick Your Fit',
      description:
        'Browse verified listings and choose the vehicle that fits your group and budget. From luxury sedans to spacious SUVs.',
      footerIcon: ShieldCheck,
      footerLabel: 'VERIFIED FLEET',
    },
    {
      icon: PhoneCall,
      title: 'Call Directly',
      description:
        'Connect with the driver or vendor directly via phone or WhatsApp to finalize your trip details and schedule.',
      footerIcon: PhoneCall,
      footerLabel: 'DIRECT CONNECT',
    },
  ]

  return (
    <section className="relative bg-background py-16 lg:py-24 overflow-hidden">
      {/* Background glow / texture */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_55%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-16 max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-14 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold text-foreground mb-4">
            3-Step Booking Process
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-foreground leading-relaxed">
          Find and book trusted car rental companies in your city. Pay a small advance to confirm, and pay the rest directly to the driver.



          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const FooterIcon = step.footerIcon

            return (
              <article
                key={idx}
                className="relative rounded-2xl bg-foreground border border-primary shadow-primary overflow-hidden"
              >
                {/* Icon (Removed step badge/numbering) */}
                <div className="pt-10 pb-6 flex flex-col items-center justify-center">
                  <div className="relative mb-5">
                    <div className="absolute bg-primary/50 blur-xl rounded-3xl" />
                    <div className="relative w-20 h-20 rounded-2xl bg-[#061712] flex items-center justify-center border-primary">
                      <Icon className="h-9 w-9 text-primary" />
                      {/* Step number removed */}
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="px-7 pb-7 text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-emerald-50/80">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="border-t border-primary bg-black/20 px-7 py-4 flex items-center justify-center gap-2 text-[0.7rem] tracking-[0.22em] font-semibold uppercase text-primary">
                  <FooterIcon className="h-4 w-4" />
                  <span>{step.footerLabel}</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
