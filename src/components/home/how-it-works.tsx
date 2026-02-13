import {
  MapPin,
  Car,
  PhoneCall,
  Search as SearchIcon,
  ShieldCheck,
} from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Search Near You",
      description:
        "Find vehicles in your city and specific town with ease. Our hyper-local search covers all major Pakistani hubs.",
      footerIcon: SearchIcon,
      footerLabel: "SEARCH PAKISTAN",
    },
    {
      icon: Car,
      title: "Pick Your Fit",
      description:
        "Browse verified listings and choose the vehicle that fits your group and budget. From luxury sedans to spacious SUVs.",
      footerIcon: ShieldCheck,
      footerLabel: "VERIFIED FLEET",
    },
    {
      icon: PhoneCall,
      title: "Call Directly",
      description:
        "Connect with the driver or vendor directly via phone or WhatsApp to finalize your trip details and schedule.",
      footerIcon: PhoneCall,
      footerLabel: "DIRECT CONNECT",
    },
  ];

  return (
    <section className="relative bg-background py-16 lg:py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-16 max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-14 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-extrabold text-foreground mb-4">
            3-Step Booking Process
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-foreground leading-relaxed">
            Find and book trusted car rental companies in your city. Pay a small
            advance to confirm, and pay the rest directly to the driver.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const FooterIcon = step.footerIcon;

            return (
              <article
                key={idx}
                className={`relative bg-primary overflow-hidden
                  ${idx === 0 ? 'rounded-tl-lg rounded-bl-lg border' : ''}
                  ${idx === 1 ? 'border-y border-r' : ''}
                  ${idx === 2 ? 'rounded-tr-lg rounded-br-lg border-r border-y' : ''}
                  `}
              >
                {/* Icon (Removed step badge/numbering) */}
                <div className="p-6 flex flex-col">
                  <div className="mb-5 w-14 h-14 rounded bg-foreground/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-foreground" />
                  </div>

                  {/* Copy */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
