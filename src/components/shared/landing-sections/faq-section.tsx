import { HelpCircle } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  faqs: FAQ[];
}

export function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-foreground/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && <p className="text-foreground/80">{subtitle}</p>}
        </div>
        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="group bg-background p-6 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out"
            >
              <h3 className="flex items-start gap-3 text-lg font-semibold text-foreground mb-2">
                <HelpCircle className="h-5 w-5 text-foreground/60 shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-base text-foreground/70 pl-8 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
