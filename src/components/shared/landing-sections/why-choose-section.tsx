import { Check, Car, ShieldCheck } from "lucide-react";

interface WhyChooseSectionProps {
  title: string;
  subtitle?: string;
  trustCard: {
    title?: string;
    items: string[];
    footerText?: string;
  };
  vehiclesCard: {
    title: string;
    description: string;
    items: Array<{ icon?: React.ComponentType<{ className?: string }>; label: string } | string>;
    footerText?: string;
  };
}

export function WhyChooseSection({
  title,
  subtitle,
  trustCard,
  vehiclesCard,
}: WhyChooseSectionProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-background/10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 mx-auto max-w-3xl">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl mx-auto leading-[130%] font-extrabold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg lg:text-xl text-foreground/80">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
          {/* Trust & Choice Card */}
          <div className="group relative bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out flex flex-col">
            <div className="mb-4">
              <div className="w-14 h-14 rounded bg-foreground/10 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-foreground/80 group-hover:text-foreground transition-colors duration-500 ease-in-out" />
              </div>
            </div>
            {trustCard.title && (
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-foreground/80 transition-colors duration-500 ease-in-out">
                {trustCard.title}
              </h3>
            )}
            <ul className="grid gap-3 text-base md:text-lg text-foreground/70">
              {trustCard.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-foreground/60 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {trustCard.footerText && (
              <p className="text-base text-foreground/70 mt-4">{trustCard.footerText}</p>
            )}
          </div>

          {/* Available Vehicles Card */}
          <div className="group relative bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out flex flex-col">
            <div className="mb-4">
              <div className="w-14 h-14 rounded bg-foreground/10 flex items-center justify-center">
                <Car className="h-7 w-7 text-foreground/80 group-hover:text-foreground transition-colors duration-500 ease-in-out" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-500 ease-in-out">
              {vehiclesCard.title}
            </h3>
            <p className="text-base text-foreground/70 mb-4">{vehiclesCard.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehiclesCard.items.map((item, i) => {
                const isObject = typeof item === "object";
                const Icon = isObject && item.icon ? item.icon : Check;
                const label = isObject ? item.label : item;

                return (
                  <div
                    key={i}
                    className="rounded border border-foreground/10 bg-foreground/5 px-4 py-3 flex items-center gap-3 text-foreground/70"
                  >
                    <Icon className="h-5 w-5 text-foreground/60 shrink-0" />
                    <span className="text-sm">{label}</span>
                  </div>
                );
              })}
            </div>
            {vehiclesCard.footerText && (
              <p className="text-xs text-foreground/60 mt-3">{vehiclesCard.footerText}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
