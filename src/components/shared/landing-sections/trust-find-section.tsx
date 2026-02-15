import { Check } from "lucide-react";

interface TrustFindSectionProps {
  trustCard: {
    title: string;
    description: string;
    items: string[];
    footerText?: string;
  };
  findCard: {
    title: string;
    description: string;
  };
}

export function TrustFindSection({ trustCard, findCard }: TrustFindSectionProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Trust Card */}
          <div className="bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out flex flex-col">
            <h3 className="text-xl font-bold text-foreground mb-3">{trustCard.title}</h3>
            <p className="text-base text-foreground/70 mb-3">{trustCard.description}</p>
            <ul className="space-y-1 text-base text-foreground/70">
              {trustCard.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <Check className="h-4 w-4 text-foreground/60 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            {trustCard.footerText && (
              <p className="text-base text-foreground/70 mt-3">{trustCard.footerText}</p>
            )}
          </div>

          {/* Find Card */}
          <div className="bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out flex flex-col">
            <h3 className="text-xl font-bold text-foreground mb-3">{findCard.title}</h3>
            <p className="text-base text-foreground/70">{findCard.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
