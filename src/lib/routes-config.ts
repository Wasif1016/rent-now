export interface SeoTemplate {
  h1: string;
  title: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface KeywordConfig {
  slug: string;
  label: string;
  templates?: {
    city?: SeoTemplate;
    model?: SeoTemplate;
    route?: SeoTemplate;
  };
}

export const DEFAULT_TEMPLATES: Record<string, SeoTemplate> = {
  keyword_only: {
    h1: "{keyword} Services",
    title: "{keyword}",
    description:
      "Looking for {keyword_lower}? Compare verified rental vendors and book with a small advance.",
  },
  keyword_city: {
    h1: "{keyword} in {city}",
    title: "{keyword} in {city} | Best Car Rental Deals",
    description:
      "Compare verified car rental vendors in {city}. Browse vehicles for city and outstation trips. Pay only a small advance to confirm.",
  },
  keyword_model: {
    h1: "{brand} {model} {keyword}",
    title: "{brand} {model} for Rent | {keyword}",
    description:
      "Book {brand} {model} through {keyword_lower}. Compare verified rental options and book with ease.",
  },
  keyword_city_model: {
    h1: "{brand} {model} {keyword} in {city}",
    title: "{brand} {model} in {city} | {keyword}",
    description:
      "Find {brand} {model} in {city} for your next trip. Compare prices and book {keyword_lower} with trusted vendors.",
  },
  route: {
    h1: "{keyword} from {from_city} to {to_city}",
    title: "{keyword} from {from_city} to {to_city} | Intercity Route",
    description:
      "Book reliable vehicles with drivers for the {from_city} to {to_city} route. Compare vendors and book with a small advance.",
  },
  keyword_city_town: {
    h1: "{keyword} in {town}, {city}",
    title: "{keyword} in {town}, {city} | Best Car Rental Deals",
    description:
      "Looking for {keyword_lower} in {town}, {city}? Compare verified rental vendors and book with a small advance. Reliable vehicles for all your travel needs.",
  },
  vehicle_model: {
    h1: "Rent {brand} {model}",
    title: "Rent {brand} {model} | Compare Prices & Book",
    description:
      "Looking to rent {brand} {model}? Compare verified local rental vendors and book with a small advance. Reliable vehicles for all your travel needs.",
  },
  vehicle_model_city: {
    h1: "{brand} {model} for Rent in {city}",
    title: "{brand} {model} for Rent in {city} | Best Deals",
    description:
      "Book {brand} {model} in {city} for your next trip. Compare prices from trusted local vendors and book with ease.",
  },
  vehicle_model_city_town: {
    h1: "{brand} {model} for Rent in {town}, {city}",
    title: "{brand} {model} for Rent in {town}, {city}",
    description:
      "Looking for {brand} {model} in {town}, {city}? Compare verified rental vendors and book with a small advance. Reliable vehicles for your local travel.",
  },
  vehicle_category: {
    h1: "{category} Rental Services",
    title: "{category} for Rent | Best Car Rental Deals",
    description:
      "Browse and book {category} vehicles from verified rental vendors. Compare prices and book with a small advance.",
  },
};

export const KEYWORDS: Record<string, KeywordConfig> = {
  "rent-a-car": {
    slug: "rent-a-car",
    label: "Rent a Car",
  },
  "car-on-rent": {
    slug: "car-on-rent",
    label: "Car on Rent",
  },
  "car-hire": {
    slug: "car-hire",
    label: "Car Hire",
  },
  "rent-a-vehicle": {
    slug: "rent-a-vehicle",
    label: "Rent a Vehicle",
  },
  "online-car-booking": {
    slug: "online-car-booking",
    label: "Online Car Booking",
  },
  "rent-vehicle-online": {
    slug: "rent-vehicle-online",
    label: "Rent Vehicle Online",
  },
  "car-rental-platform": {
    slug: "car-rental-platform",
    label: "Car Rental Platform",
  },
  "vehicle-booking-platform": {
    slug: "vehicle-booking-platform",
    label: "Vehicle Booking Platform",
  },
  "affordable-car-rental": {
    slug: "affordable-car-rental",
    label: "Affordable Car Rental",
  },
  "cheap-car-rental": {
    slug: "cheap-car-rental",
    label: "Cheap Car Rental",
  },
  "best-car-rental": {
    slug: "best-car-rental",
    label: "Best Car Rental",
  },
  "low-cost-car-rental": {
    slug: "low-cost-car-rental",
    label: "Low Cost Car Rental",
  },
  "car-rental-deals": {
    slug: "car-rental-deals",
    label: "Car Rental Deals",
  },
  "car-rental-prices": {
    slug: "car-rental-prices",
    label: "Car Rental Prices",
  },
  "daily-car-rental": {
    slug: "daily-car-rental",
    label: "Daily Car Rental",
  },
  "short-term-car-rental": {
    slug: "short-term-car-rental",
    label: "Short Term Car Rental",
  },
  "long-term-car-rental": {
    slug: "long-term-car-rental",
    label: "Long Term Car Rental",
  },
  "hourly-car-rental": {
    slug: "hourly-car-rental",
    label: "Hourly Car Rental",
  },
  "reliable-car-rental": {
    slug: "reliable-car-rental",
    label: "Reliable Car Rental",
  },
  "trusted-car-rental": {
    slug: "trusted-car-rental",
    label: "Trusted Car Rental",
  },
  "verified-car-rental": {
    slug: "verified-car-rental",
    label: "Verified Car Rental",
  },
  "best-car-rental-service": {
    slug: "best-car-rental-service",
    label: "Best Car Rental Service",
  },
  "top-car-rental-company": {
    slug: "top-car-rental-company",
    label: "Top Car Rental Company",
  },
  "instant-car-booking": {
    slug: "instant-car-booking",
    label: "Instant Car Booking",
  },
  "quick-car-booking": {
    slug: "quick-car-booking",
    label: "Quick Car Booking",
  },
  "car-rental-near-me": {
    slug: "car-rental-near-me",
    label: "Car Rental Near Me",
  },
  "rent-car-now": {
    slug: "rent-car-now",
    label: "Rent Car Now",
  },
  "travel-car-rental": {
    slug: "travel-car-rental",
    label: "Travel Car Rental",
  },
  "tour-car-rental": {
    slug: "tour-car-rental",
    label: "Tour Car Rental",
  },
  "family-car-rental": {
    slug: "family-car-rental",
    label: "Family Car Rental",
  },
  "business-car-rental": {
    slug: "business-car-rental",
    label: "Business Car Rental",
  },
  "car-rental-with-driver": {
    slug: "car-rental-with-driver",
    label: "Car Rental with Driver",
  },
  "car-rental-without-driver": {
    slug: "car-rental-without-driver",
    label: "Car Rental without Driver",
  },
  "car-rental-marketplace": {
    slug: "car-rental-marketplace",
    label: "Car Rental Marketplace",
  },
  "vehicle-rental-marketplace": {
    slug: "vehicle-rental-marketplace",
    label: "Vehicle Rental Marketplace",
  },
  "personal-car-rental": {
    slug: "personal-car-rental",
    label: "Personal Car Rental",
  },
  "commercial-car-rental": {
    slug: "commercial-car-rental",
    label: "Commercial Car Rental",
  },
  "airport-transfer": {
    slug: "airport-transfer",
    label: "Airport Transfer",
    templates: {
      city: {
        h1: "Airport Transfer in {city}",
        title: "Airport Transfer in {city} | Reliable Pick & Drop",
        description:
          "Book airport transfers in {city} with professional drivers. Ideal for late-night arrivals and family travel. Pay only a small advance.",
      },
    },
  },
  "self-drive-car-rental": {
    slug: "self-drive-car-rental",
    label: "Self Drive Car Rental",
  },
  "wedding-car-rental": {
    slug: "wedding-car-rental",
    label: "Wedding Car Rental",
  },
  "airport-transfer-services": {
    slug: "airport-transfer-services",
    label: "Airport Transfer Services",
  },
  "monthly-daily-car-rental": {
    slug: "monthly-daily-car-rental",
    label: "Monthly & Daily Car Rental",
  },
  "luxury-economy-budget-cars": {
    slug: "luxury-economy-budget-cars",
    label: "Luxury, Economy & Budget Cars",
  },
  "bus-coaster-rental": {
    slug: "bus-coaster-rental",
    label: "Bus & Coaster Rental",
  },
  "tour-travel-vehicles": {
    slug: "tour-travel-vehicles",
    label: "Tour & Travel Vehicles",
  },
};

export const FAQS: Record<string, FaqItem[]> = {
  city: [
    {
      q: "How do I book {keyword_lower} in {city}?",
      a: "Choose your preferred vehicle, share your travel dates, and our team will confirm availability in {city} by phone or WhatsApp before you pay a small advance online.",
    },
    {
      q: "Can I hire a car with driver in {city}?",
      a: "Yes, most vehicles listed in {city} are with professional local drivers who know the routes, tolls, and parking spots.",
    },
    {
      q: "What documents are required for {keyword_lower} in {city}?",
      a: "For trips with driver, you usually only need a valid CNIC and active phone number. For self-drive, vendors may ask for a driving license and security deposit.",
    },
  ],
  route: [
    {
      q: "What is included in the fare from {from_city} to {to_city}?",
      a: "Quoted prices for {from_city} to {to_city} usually include fuel and driver unless mentioned otherwise. Always confirm inclusions on your confirmation call.",
    },
    {
      q: "Can I make stops on the way between {from_city} and {to_city}?",
      a: "Short refreshment and prayer stops are normally included. For longer detours, discuss the route with your vendor.",
    },
  ],
  airport: [
    {
      q: "How do airport transfer bookings work in {city}?",
      a: "Share your flight details and passenger count. The driver will track your arrival at {city} airport and wait at the pickup area.",
    },
    {
      q: "Is waiting time included in airport transfers?",
      a: "Most vendors include a free waiting window for flight delays. Extra waiting time can be charged per hour.",
    },
  ],
};
