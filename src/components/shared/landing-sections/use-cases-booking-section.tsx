import { Check, Search, FileCheck, CreditCard, Phone, Car } from "lucide-react";

interface BookingStep {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  number?: number;
}

interface UseCasesAndBookingSectionProps {
  useCases: {
    title: string;
    description: string;
    items: string[];
    footerText?: string;
  };
  booking: {
    title: string;
    subtitle?: string;
    description?: string;
    steps: BookingStep[];
    footerText?: string;
  };
  variant?: "icons" | "numbers";
}

export function UseCasesAndBookingSection({
  useCases,
  booking,
  variant = "icons",
}: UseCasesAndBookingSectionProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-foreground/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Use Cases Card */}
          <div className="bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out flex flex-col space-y-5">
            <h3 className="text-xl font-bold text-foreground">{useCases.title}</h3>
            <p className="text-base text-foreground/70">{useCases.description}</p>
            <ul className="mt-3 grid gap-2 text-base text-foreground/70">
              {useCases.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <Check className="h-4 w-4 text-foreground/60 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            {useCases.footerText && (
              <p className="text-base text-foreground/70 mt-3 leading-relaxed">
                {useCases.footerText}
              </p>
            )}
          </div>

          {/* Booking Steps Card */}
          <div className="bg-primary p-6 lg:p-8 border-2 border-foreground/20 flex flex-col space-y-5">
            {booking.subtitle && (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground/80">
                {booking.subtitle}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{booking.title}</h2>
            {booking.description && (
              <p className="text-base text-foreground/80">{booking.description}</p>
            )}
            <ol className="mt-4 space-y-3 text-base md:text-lg text-foreground/90">
              {booking.steps.map((step, i) => {
                const Icon = step.icon;
                const stepNumber = step.number ?? i + 1;

                return (
                  <li key={i} className="flex gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-sm shrink-0">
                      {variant === "numbers" ? (
                        stepNumber
                      ) : (
                        <Icon className="h-5 w-5 text-foreground" />
                      )}
                    </span>
                    <span className="flex-1 self-center">{step.text}</span>
                  </li>
                );
              })}
            </ol>
            {booking.footerText && (
              <p className="text-base md:text-lg text-foreground/80 mt-3 leading-relaxed">
                {booking.footerText}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
