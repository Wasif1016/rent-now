import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, MapPin, Car, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0f16] text-white overflow-hidden relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Glows */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#C0F11C]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-10" />
      </div>

      <div className="container relative z-10 px-4 py-20 text-center">
        {/* Hero Section */}
        <div className="relative mb-12">
          {/* Subtle 404 Outline */}
          <div className="absolute inset-0 flex items-center justify-center -translate-y-4 select-none opacity-[0.03]">
            <span className="text-[30vw] font-black tracking-tighter">404</span>
          </div>

          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#C0F11C] to-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <h1 className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter text-white relative">
              4<span className="text-[#C0F11C]">0</span>4
            </h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Page Not Found
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed">
              We couldn&apos;t find the vehicle or route you&apos;re looking
              for. Let&apos;s get you back on the right track.
            </p>
          </div>

          {/* Core Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
            <Button
              size="lg"
              className="bg-[#C0F11C] text-[#0f1419] hover:bg-[#A9D718] font-black px-6 py-4 h-auto rounded-md text-xl shadow-[0_0_40px_rgba(192,241,28,0.2)] transition-all hover:scale-105"
              asChild
            >
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#C0F11C]/50 text-white font-bold px-6 py-4 h-auto rounded-full text-md transition-all"
              asChild
            >
              <Link href="/view-all-vehicles">Explore Vehicles</Link>
            </Button>
          </div>

          {/* SEO Sitemap Links */}
          <div className="mt-24 pt-16 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C0F11C]/10">
                  <MapPin className="h-6 w-6 text-[#C0F11C]" />
                </div>
                <h3 className="font-bold text-xl text-white">Top Cities</h3>
              </div>
              <ul className="space-y-3">
                {["Lahore", "Karachi", "Islamabad", "Rawalpindi"].map(
                  (city) => (
                    <li key={city}>
                      <Link
                        href={`/rent-a-car/${city.toLowerCase()}`}
                        className="text-gray-400 hover:text-[#C0F11C] transition-colors flex items-center group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-[#C0F11C] mr-3 transition-colors" />
                        Rent a Car in {city}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C0F11C]/10">
                  <Car className="h-6 w-6 text-[#C0F11C]" />
                </div>
                <h3 className="font-bold text-xl text-white">Vehicle Models</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Toyota Corolla",
                  "Honda Civic",
                  "Suzuki Alto",
                  "Toyota Hiace",
                ].map((model) => (
                  <li key={model}>
                    <Link
                      href={`/rent-a-car/${model
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      className="text-gray-400 hover:text-[#C0F11C] transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-[#C0F11C] mr-3 transition-colors" />
                      Rent {model}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C0F11C]/10">
                  <ArrowRight className="h-6 w-6 text-[#C0F11C]" />
                </div>
                <h3 className="font-bold text-xl text-white">Quick Access</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { name: "List Your Car", href: "/list-your-car" },
                  { name: "About RentNow", href: "/about" },
                  { name: "Contact Support", href: "/contact" },
                  { name: "Terms of Service", href: "/terms" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-[#C0F11C] transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-[#C0F11C] mr-3 transition-colors" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
