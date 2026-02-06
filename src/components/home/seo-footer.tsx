import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Camera,
  Share2,
  MessageCircle,
  Check,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import { KEYWORDS } from "@/lib/routes-config";

export function SeoFooter() {
  // Derive services from central config to stay in sync
  const serviceKeys = [
    "car-rental-with-driver",
    "self-drive-car-rental",
    "wedding-car-rental",
    "airport-transfer",
    "monthly-daily-car-rental",
    "luxury-economy-budget-cars",
    "bus-coaster-rental",
    "tour-travel-vehicles",
  ];

  const rentalServices = serviceKeys
    .map((key) => KEYWORDS[key])
    .filter(Boolean)
    .map((k) => ({ name: k.label, href: `/${k.slug}` }));

  const cityLinks = [
    { name: "Rent a Car in Lahore", href: "/rent-a-car/lahore" },
    { name: "Rent a Car in Karachi", href: "/rent-a-car/karachi" },
    { name: "Rent a Car in Islamabad", href: "/rent-a-car/islamabad" },
    { name: "Rent a Car in Rawalpindi", href: "/rent-a-car/rawalpindi" },
    { name: "Rent a Car in Faisalabad", href: "/rent-a-car/faisalabad" },
    { name: "Rent a Car in Multan", href: "/rent-a-car/multan" },
    { name: "Rent a Car in Bahawalnagar", href: "/rent-a-car/bahawalnagar" },
    { name: "Rent a Car in Bahawalpur", href: "/rent-a-car/bahawalpur" },
    { name: "Rent a Car in Sahiwal", href: "/rent-a-car/sahiwal" },
    { name: "Rent a Car in Gujranwala", href: "/rent-a-car/gujranwala" },
  ];

  const popularVehicles = [
    { name: "Suzuki Alto", href: "/rent-a-car/suzuki-alto" },
    { name: "Suzuki Mehran", href: "/rent-a-car/suzuki-mehran" },
    { name: "Toyota Corolla", href: "/rent-a-car/toyota-corolla" },
    { name: "Toyota Yaris", href: "/rent-a-car/toyota-yaris" },
    { name: "Honda City", href: "/rent-a-car/honda-city" },
    { name: "Honda Civic", href: "/rent-a-car/honda-civic" },
    { name: "Hiace & Coaster", href: "/rent-a-car/toyota-hiace" },
    { name: "Prado & Land Cruiser", href: "/rent-a-car/toyota-land-cruiser" },
  ];

  const popularTowns = [
    { name: "Bahria Town Lahore", href: "/rent-a-car/lahore/bahria-town" },
    { name: "DHA Lahore", href: "/rent-a-car/lahore/dha-lahore" },
    { name: "Johar Town Lahore", href: "/rent-a-car/lahore/johar-town" },
    { name: "Gulberg Lahore", href: "/rent-a-car/lahore/gulberg" },
    { name: "Clifton Karachi", href: "/rent-a-car/karachi/clifton" },
    { name: "DHA Karachi", href: "/rent-a-car/karachi/dha" },
    {
      name: "Gulshan-e-Iqbal Karachi",
      href: "/rent-a-car/karachi/gulshan-e-iqbal",
    },
    { name: "F-7 Islamabad", href: "/rent-a-car/islamabad/f-7" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Vehicles", href: "/view-all-vehicles" },
    { name: "List Your Car", href: "/list-your-car" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalPages = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Disclaimer", href: "/disclaimer" },
  ];

  return (
    <footer className="bg-[#1a2332] text-gray-300 py-12 lg:py-16">
      <div className="container mx-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: About + Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Column 1: About RentNowPk */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt="RentNow Pk"
                width={100}
                height={100}
                className="h-14 w-auto"
              />
              <span className="text-2xl font-bold text-[#C0F11C] tracking-tight">
                RentNow Pk
              </span>
            </Link>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              RentNowPk is Pakistan’s trusted car rental directory that connect
              customers with verified local car rental businesses for weddings,
              tours, airport transfers, business travel, and daily use at
              affordable prices.
            </p>
          </div>

          {/* Column 2: Car Rental Services */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              Car Rental Services
            </h3>
            <ul className="space-y-2 text-sm">
              {rentalServices.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Car Rental by Cities */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              Car Rental by Cities
            </h3>
            <ul className="space-y-2 text-sm">
              {cityLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Popular Vehicles */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              Popular Vehicles
            </h3>
            <ul className="space-y-2 text-sm">
              {popularVehicles.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Quick Links & Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm mb-6">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="space-y-2 text-sm mb-6">
              {legalPages.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} RentNowPk. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Email */}
            <a
              href="mailto:help@rentnowpk.com"
              className="flex items-center gap-2 px-4 py-2 border border-[#C0F11C] rounded bg-[#0f1419] hover:bg-[#C0F11C]/10 transition-colors"
            >
              <Mail className="h-4 w-4 text-[#C0F11C]" />
              <span className="text-sm font-semibold text-[#C0F11C]">
                help@rentnowpk.com
              </span>
            </a>

            {/* Phone Number */}
            <a
              href="tel:+923144176625"
              className="flex items-center gap-2 px-4 py-2 border border-[#C0F11C] rounded bg-[#0f1419] hover:bg-[#C0F11C]/10 transition-colors"
            >
              <Phone className="h-4 w-4 text-[#C0F11C]" />
              <span className="text-sm font-semibold text-[#C0F11C]">
                +92 3144174625
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
