interface IntroSectionProps {
  heading: string;
  paragraphs: string[];
  variant?: "centered" | "left-aligned";
  showGradient?: boolean;
}

export function IntroSection({
  heading,
  paragraphs,
  variant = "centered",
  showGradient = false,
}: IntroSectionProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-background border-b overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {variant === "centered" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight text-center">
              {heading}
            </h2>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl"
              >
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
            <div className="space-y-4 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="text-3xl lg:text-5xl xl:text-5xl font-extrabold text-foreground tracking-tight">
                {heading}
              </h2>
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
