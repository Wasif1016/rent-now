import { ShieldCheck, CreditCard, HeadphonesIcon } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified rental companies only",
    description:
      "All rental partners are thoroughly verified for your safety and peace of mind.",
  },
  {
    icon: CreditCard,
    title: "No full payment online",
    description:
      "Pay only a small advance. Complete payment after confirming your booking.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support before and after booking",
    description:
      "24/7 customer support to assist you throughout your rental journey.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground mb-4">
            Why Book Through Our Platform?
          </h2>
          <p className="text-lg lg:text-xl text-foreground max-w-2xl mx-auto">
            Experience the most trusted and reliable way to rent vehicles across
            Pakistan
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative bg-background p-6 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out  flex flex-col"
              >
                {/* Icon */}
                <div className="relative mb-4">
                  <Icon className="h-7 w-7 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500 ease-in-out" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-500 ease-in-out">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-500 ease-in-out">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        {/* <div className="mt-12 lg:mt-16 text-center">
          <div className="inline-block bg-[#1a1a1a] rounded-2xl p-6 lg:p-8 border border-gray-800/50">
            <p className="text-white text-lg lg:text-xl font-semibold mb-2">
              Trusted by thousands of customers across Pakistan
            </p>
            <p className="text-gray-400 text-sm lg:text-base">
              Join our community of satisfied renters
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}
