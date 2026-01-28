// Prisma 7: Set DATABASE_URL in process.env before importing
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file explicitly
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const DATABASE_URL = process.env.DATABASE_URL || process.env.DIRECT_URL

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL or DIRECT_URL environment variable is not set!')
  process.exit(1)
}

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'

// Prisma 7: Use adapter for Postgres connection
const pool = new Pool({ connectionString: DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Supabase client for auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Supabase environment variables are not set!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function main() {
  console.log('🌱 Starting comprehensive seed...\n')

  // ============================================
  // 1. COUNTRY & CITIES
  // ============================================
  console.log('📍 Creating countries and cities...')
  const pakistan = await prisma.country.upsert({
    where: { code: 'PK' },
    update: {},
    create: {
      name: 'Pakistan',
      slug: 'pakistan',
      code: 'PK',
      isActive: true,
    },
  })

  const cities = [
    { name: 'Karachi', slug: 'karachi', province: 'Sindh' },
    { name: 'Lahore', slug: 'lahore', province: 'Punjab' },
    { name: 'Islamabad', slug: 'islamabad', province: 'Islamabad Capital Territory' },
    { name: 'Rawalpindi', slug: 'rawalpindi', province: 'Punjab' },
    { name: 'Faisalabad', slug: 'faisalabad', province: 'Punjab' },
    { name: 'Multan', slug: 'multan', province: 'Punjab' },
    { name: 'Peshawar', slug: 'peshawar', province: 'Khyber Pakhtunkhwa' },
    { name: 'Quetta', slug: 'quetta', province: 'Balochistan' },
    { name: 'Gujranwala', slug: 'gujranwala', province: 'Punjab' },
    { name: 'Sialkot', slug: 'sialkot', province: 'Punjab' },
    { name: 'Sargodha', slug: 'sargodha', province: 'Punjab' },
    { name: 'Bahawalpur', slug: 'bahawalpur', province: 'Punjab' },
  ]

  const cityRecords = []
  for (const city of cities) {
    const cityRecord = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: {
        name: city.name,
        slug: city.slug,
        province: city.province,
        countryId: pakistan.id,
        isActive: true,
      },
    })
    cityRecords.push(cityRecord)
    console.log(`  ✅ ${city.name}`)
  }

  // ============================================
  // 2. TOWNS
  // ============================================
  console.log('\n🏘️  Creating towns...')
  const townsData = [
    // Karachi towns
    { name: 'Clifton', citySlug: 'karachi' },
    { name: 'DHA', citySlug: 'karachi' },
    { name: 'Gulshan-e-Iqbal', citySlug: 'karachi' },
    { name: 'PECHS', citySlug: 'karachi' },
    { name: 'Defence', citySlug: 'karachi' },
    { name: 'Gulistan-e-Johar', citySlug: 'karachi' },
    { name: 'Malir', citySlug: 'karachi' },
    // Lahore towns
    { name: 'Gulberg', citySlug: 'lahore' },
    { name: 'DHA Phase 5', citySlug: 'lahore' },
    { name: 'Model Town', citySlug: 'lahore' },
    { name: 'Johar Town', citySlug: 'lahore' },
    { name: 'Bahria Town', citySlug: 'lahore' },
    { name: 'Wapda Town', citySlug: 'lahore' },
    { name: 'Ferozepur Road', citySlug: 'lahore' },
    // Islamabad towns
    { name: 'F-7', citySlug: 'islamabad' },
    { name: 'F-8', citySlug: 'islamabad' },
    { name: 'G-11', citySlug: 'islamabad' },
    { name: 'DHA Phase 2', citySlug: 'islamabad' },
    { name: 'E-11', citySlug: 'islamabad' },
    { name: 'I-8', citySlug: 'islamabad' },
    { name: 'Blue Area', citySlug: 'islamabad' },
    // Rawalpindi towns
    { name: 'Bahria Town', citySlug: 'rawalpindi' },
    { name: 'DHA Phase 1', citySlug: 'rawalpindi' },
    { name: 'Chaklala', citySlug: 'rawalpindi' },
    { name: 'Cantt', citySlug: 'rawalpindi' },
    // Faisalabad towns
    { name: 'D Ground', citySlug: 'faisalabad' },
    { name: 'Satiana Road', citySlug: 'faisalabad' },
    { name: 'Jaranwala Road', citySlug: 'faisalabad' },
    // Multan towns
    { name: 'Cantt', citySlug: 'multan' },
    { name: 'Gulgasht', citySlug: 'multan' },
    { name: 'Bosan Road', citySlug: 'multan' },
    // Peshawar towns
    { name: 'Hayatabad', citySlug: 'peshawar' },
    { name: 'University Town', citySlug: 'peshawar' },
    { name: 'Cantt', citySlug: 'peshawar' },
    // Quetta towns
    { name: 'Cantt', citySlug: 'quetta' },
    { name: 'Jinnah Town', citySlug: 'quetta' },
    // Gujranwala towns
    { name: 'Cantt', citySlug: 'gujranwala' },
    { name: 'Model Town', citySlug: 'gujranwala' },
    // Sialkot towns
    { name: 'Cantt', citySlug: 'sialkot' },
    { name: 'Model Town', citySlug: 'sialkot' },
    // Sargodha towns
    { name: 'Cantt', citySlug: 'sargodha' },
    { name: 'Model Town', citySlug: 'sargodha' },
    // Bahawalpur towns
    { name: 'Cantt', citySlug: 'bahawalpur' },
    { name: 'Model Town', citySlug: 'bahawalpur' },
  ]

  const townRecords = []
  for (const town of townsData) {
    const city = cityRecords.find(c => c.slug === town.citySlug)
    if (!city) continue

    const townSlug = `${town.citySlug}-${town.name.toLowerCase().replace(/\s+/g, '-')}`
    
    const townRecord = await prisma.town.upsert({
      where: {
        slug_cityId: {
          slug: townSlug,
          cityId: city.id,
        },
      },
      update: {},
      create: {
        name: town.name,
        slug: townSlug,
        cityId: city.id,
        isActive: true,
      },
    })
    townRecords.push(townRecord)
    console.log(`  ✅ ${town.name} (${city.name})`)
  }

  // ============================================
  // 3. VEHICLE TYPES
  // ============================================
  console.log('\n🚙 Creating vehicle types...')
  const vehicleTypes = [
    { name: 'Cars', slug: 'cars', description: 'Sedan, Corolla, Civic and more' },
    { name: 'Hiace', slug: 'hiace', description: 'Toyota Hiace vans for group travel' },
    { name: 'Vans', slug: 'vans', description: 'Passenger and cargo vans' },
    { name: 'Coaster', slug: 'coaster', description: 'Toyota Coaster buses' },
    { name: 'Buses', slug: 'buses', description: 'Large buses for group travel' },
    { name: 'Wedding Cars', slug: 'wedding-cars', description: 'Luxury cars for weddings' },
  ]

  const vehicleTypeRecords = []
  for (const vehicleType of vehicleTypes) {
    const vehicleTypeRecord = await prisma.vehicleType.upsert({
      where: { slug: vehicleType.slug },
      update: {},
      create: {
        name: vehicleType.name,
        slug: vehicleType.slug,
        description: vehicleType.description,
        isActive: true,
      },
    })
    vehicleTypeRecords.push(vehicleTypeRecord)
    console.log(`  ✅ ${vehicleType.name}`)
  }

  // ============================================
  // 4. VEHICLE BRANDS
  // ============================================
  console.log('\n🚗 Creating vehicle brands...')
  const brands = [
    { name: 'Toyota', slug: 'toyota' },
    { name: 'Honda', slug: 'honda' },
    { name: 'Suzuki', slug: 'suzuki' },
    { name: 'Nissan', slug: 'nissan' },
    { name: 'Hyundai', slug: 'hyundai' },
    { name: 'Kia', slug: 'kia' },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz' },
    { name: 'BMW', slug: 'bmw' },
    { name: 'Audi', slug: 'audi' },
    { name: 'Volkswagen', slug: 'volkswagen' },
    { name: 'Ford', slug: 'ford' },
    { name: 'Chevrolet', slug: 'chevrolet' },
    { name: 'Mazda', slug: 'mazda' },
    { name: 'Daihatsu', slug: 'daihatsu' },
  ]

  const brandRecords = []
  for (const brand of brands) {
    const brandRecord = await prisma.vehicleBrand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: {
        name: brand.name,
        slug: brand.slug,
        isActive: true,
      },
    })
    brandRecords.push(brandRecord)
    console.log(`  ✅ ${brand.name}`)
  }

  // ============================================
  // 5. VEHICLE MODELS
  // ============================================
  console.log('\n🚘 Creating vehicle models...')
  const models = [
    // Toyota
    { name: 'Corolla', brand: 'toyota' },
    { name: 'Camry', brand: 'toyota' },
    { name: 'Land Cruiser', brand: 'toyota' },
    { name: 'Hilux', brand: 'toyota' },
    { name: 'Prius', brand: 'toyota' },
    { name: 'Vitz', brand: 'toyota' },
    // Honda
    { name: 'Civic', brand: 'honda' },
    { name: 'City', brand: 'honda' },
    { name: 'CR-V', brand: 'honda' },
    { name: 'Accord', brand: 'honda' },
    // Suzuki
    { name: 'Mehran', brand: 'suzuki' },
    { name: 'Cultus', brand: 'suzuki' },
    { name: 'Swift', brand: 'suzuki' },
    { name: 'Alto', brand: 'suzuki' },
    { name: 'Wagon R', brand: 'suzuki' },
    { name: 'Bolan', brand: 'suzuki' },
    // Nissan
    { name: 'Sunny', brand: 'nissan' },
    { name: 'X-Trail', brand: 'nissan' },
    { name: 'Sentra', brand: 'nissan' },
    // Hyundai
    { name: 'Elantra', brand: 'hyundai' },
    { name: 'Tucson', brand: 'hyundai' },
    { name: 'Sonata', brand: 'hyundai' },
    { name: 'Accent', brand: 'hyundai' },
    // Kia
    { name: 'Sportage', brand: 'kia' },
    { name: 'Picanto', brand: 'kia' },
    { name: 'Cerato', brand: 'kia' },
    // Luxury
    { name: 'C-Class', brand: 'mercedes-benz' },
    { name: 'E-Class', brand: 'mercedes-benz' },
    { name: '3 Series', brand: 'bmw' },
    { name: '5 Series', brand: 'bmw' },
    { name: 'A4', brand: 'audi' },
    { name: 'A6', brand: 'audi' },
    // Others
    { name: 'Golf', brand: 'volkswagen' },
    { name: 'Passat', brand: 'volkswagen' },
    { name: 'Fusion', brand: 'ford' },
    { name: 'Optra', brand: 'chevrolet' },
    { name: 'Mazda3', brand: 'mazda' },
    { name: 'Mira', brand: 'daihatsu' },
  ]

  const modelRecords = []
  for (const model of models) {
    const brand = brandRecords.find(b => b.slug === model.brand)
    if (!brand) continue

    const modelSlug = `${model.brand}-${model.name.toLowerCase().replace(/\s+/g, '-')}`
    
    // Create or find model
    let modelRecord = await prisma.vehicleModel.findFirst({
      where: {
        slug: modelSlug,
        vehicleBrandId: brand.id,
      },
    })

    if (!modelRecord) {
      // Set capacity for popular Pakistani vehicles
      let capacity: number | null = null
      if (model.name === 'Alto' || model.name === 'Mehran' || model.name === 'Cultus' || model.name === 'Vitz' || model.name === 'Mira' || model.name === 'Picanto') {
        capacity = 4
      } else if (model.name === 'Wagon R' || model.name === 'Swift' || model.name === 'City' || model.name === 'Civic' || model.name === 'Corolla' || model.name === 'Sunny' || model.name === 'Elantra' || model.name === 'Accent') {
        capacity = 5
      } else if (model.name === 'Bolan' || model.name === 'CR-V' || model.name === 'X-Trail' || model.name === 'Land Cruiser') {
        capacity = 7
      } else {
        capacity = 5 // Default
      }

      modelRecord = await prisma.vehicleModel.create({
        data: {
          name: model.name,
          slug: modelSlug,
          vehicleBrandId: brand.id,
          capacity,
          isActive: true,
        },
      })
    }
    modelRecords.push(modelRecord)
    console.log(`  ✅ ${brand.name} ${model.name}`)
  }

  // ============================================
  // 5b. PREDEFINED VEHICLES (Quick Listing)
  // ============================================
  console.log('\n🚗 Creating predefined vehicles for quick listing...')
  const predefinedVehicles = [
    { name: 'Wagon R', brand: 'suzuki', bodyType: 'HatchBack', color: 'White', doors: 4, largeBags: 1, passengers: 4, transmission: 'MANUAL', image: '/rental-cars-images/Suzuki-Wagon R.png' },
    { name: 'Cultus', brand: 'suzuki', bodyType: 'HatchBack', color: 'White', doors: 4, largeBags: 1, passengers: 4, transmission: 'MANUAL', image: '/rental-cars-images/Suzuki-cultus.png' },
    { name: 'City', brand: 'honda', bodyType: 'Sedan', color: 'White', doors: 4, largeBags: 2, passengers: 4, transmission: 'MANUAL', image: '/rental-cars-images/Honda-city.png' },
    { name: 'Alto', brand: 'suzuki', bodyType: 'HatchBack', color: 'White', doors: 4, largeBags: 1, passengers: 4, transmission: 'MANUAL', image: '/rental-cars-images/suzuki-alto.png' },
    { name: 'Corolla', brand: 'toyota', bodyType: 'Sedan', color: 'White', doors: 4, largeBags: 2, passengers: 4, transmission: 'MANUAL', image: '/rental-cars-images/toyota-corolla.png' },
    { name: 'Yaris', brand: 'toyota', bodyType: 'Sedan', color: 'White', doors: 4, largeBags: 2, passengers: 4, transmission: 'AUTOMATIC', image: '/rental-cars-images/toyota-yaris.png' },
    { name: 'BR-V', brand: 'honda', bodyType: 'SUV', color: 'White', doors: 4, largeBags: 4, passengers: 7, transmission: 'AUTOMATIC', image: '/rental-cars-images/honda-br-v.png' },
    { name: 'Civic', brand: 'honda', bodyType: 'Sedan', color: 'White', doors: 4, largeBags: 2, passengers: 4, transmission: 'AUTOMATIC', image: '/rental-cars-images/honda-civic.png' },
    { name: 'Hiace', brand: 'toyota', bodyType: 'Van', color: 'White', doors: 4, largeBags: 4, passengers: 10, transmission: 'AUTOMATIC', image: '/rental-cars-images/toyota-hiace.png' },
    { name: 'Coaster', brand: 'toyota', bodyType: 'Van', color: 'White', doors: 4, largeBags: 5, passengers: 29, transmission: 'MANUAL', image: '/rental-cars-images/toyota-coaster.jpg' },
    { name: 'Fortuner', brand: 'toyota', bodyType: 'SUV', color: 'White', doors: 4, largeBags: 4, passengers: 7, transmission: 'AUTOMATIC', image: '/rental-cars-images/toyota-furtuner.png' },
    { name: 'Prado', brand: 'toyota', bodyType: 'SUV', color: 'White', doors: 4, largeBags: 4, passengers: 7, transmission: 'AUTOMATIC', image: '/rental-cars-images/toyota-prado.png' },
    { name: 'Land Cruiser', brand: 'toyota', bodyType: 'SUV', color: 'White', doors: 4, largeBags: 4, passengers: 7, transmission: 'AUTOMATIC', image: '/rental-cars-images/toyota-land-cruiser.png' },
  ]

  const predefinedModelRecords = []
  for (const vehicle of predefinedVehicles) {
    const brand = brandRecords.find(b => b.slug === vehicle.brand)
    if (!brand) continue

    const modelSlug = `${vehicle.brand}-${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`
    
    // Find or create the model
    let modelRecord = await prisma.vehicleModel.findFirst({
      where: {
        slug: modelSlug,
        vehicleBrandId: brand.id,
      },
      include: {
        vehicleBrand: true,
      },
    })

    if (!modelRecord) {
      modelRecord = await prisma.vehicleModel.create({
        data: {
          name: vehicle.name,
          slug: modelSlug,
          vehicleBrandId: brand.id,
          capacity: vehicle.passengers,
          image: vehicle.image,
          bodyType: vehicle.bodyType,
          doors: vehicle.doors,
          largeBags: vehicle.largeBags,
          defaultColor: vehicle.color,
          defaultTransmission: vehicle.transmission as any,
          isPredefined: true,
          isActive: true,
        },
        include: {
          vehicleBrand: true,
        },
      })
    } else {
      // Update existing model with predefined details
      modelRecord = await prisma.vehicleModel.update({
        where: { id: modelRecord.id },
        data: {
          capacity: vehicle.passengers,
          image: vehicle.image,
          bodyType: vehicle.bodyType,
          doors: vehicle.doors,
          largeBags: vehicle.largeBags,
          defaultColor: vehicle.color,
          defaultTransmission: vehicle.transmission as any,
          isPredefined: true,
        },
        include: {
          vehicleBrand: true,
        },
      })
    }

    predefinedModelRecords.push(modelRecord)
    console.log(`  ✅ ${brand.name} ${vehicle.name} (Predefined)`)
  }

  // ============================================
  // 6. CREATE SUPABASE AUTH USERS & VENDORS
  // ============================================
  console.log('\n👤 Creating vendors with Supabase auth accounts...')
  
  const vendors = [
    {
      name: 'Premium Car Rentals',
      email: 'premium@rentals.com',
      phone: '+92-300-1234567',
      password: 'Test123!@#',
      description: 'Premium vehicle rental service with luxury cars',
    },
    {
      name: 'City Wheels',
      email: 'city@wheels.com',
      phone: '+92-300-2345678',
      password: 'Test123!@#',
      description: 'Affordable car rentals for everyday needs',
    },
    {
      name: 'Elite Motors',
      email: 'elite@motors.com',
      phone: '+92-300-3456789',
      password: 'Test123!@#',
      description: 'Luxury and premium vehicle collection',
    },
    {
      name: 'Budget Rent A Car',
      email: 'budget@rentacar.com',
      phone: '+92-300-4567890',
      password: 'Test123!@#',
      description: 'Budget-friendly car rental solutions',
    },
    {
      name: 'Express Car Hire',
      email: 'express@carhire.com',
      phone: '+92-300-5678901',
      password: 'Test123!@#',
      description: 'Fast and reliable car rental service',
    },
    {
      name: 'Royal Fleet',
      email: 'royal@fleet.com',
      phone: '+92-300-6789012',
      password: 'Test123!@#',
      description: 'Royal treatment with premium vehicles',
    },
    {
      name: 'Quick Drive',
      email: 'quick@drive.com',
      phone: '+92-300-7890123',
      password: 'Test123!@#',
      description: 'Quick and easy car rental bookings',
    },
  ]

  const vendorRecords = []
  for (const vendorData of vendors) {
    // Check if vendor already exists
    let vendor = await prisma.vendor.findUnique({
      where: { email: vendorData.email },
    })

    if (!vendor) {
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: vendorData.email,
        password: vendorData.password,
        email_confirm: true,
      })

      if (authError) {
        console.error(`  ⚠️  Error creating auth user for ${vendorData.email}:`, authError.message)
        continue
      }

      // Create vendor in database
      vendor = await prisma.vendor.create({
        data: {
          name: vendorData.name,
          slug: vendorData.name.toLowerCase().replace(/\s+/g, '-'),
          email: vendorData.email,
          phone: vendorData.phone,
          personName: `Manager ${vendorData.name}`, // Placeholder person name
          whatsappPhone: vendorData.phone, // Use same phone for WhatsApp
          description: vendorData.description,
          supabaseUserId: authData.user.id,
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
          isActive: true,
        },
      })
      console.log(`  ✅ Created ${vendorData.name} (${vendorData.email})`)
    } else {
      console.log(`  ✅ Found existing ${vendorData.name} (${vendorData.email})`)
    }

    vendorRecords.push(vendor)
  }

  // ============================================
  // 7. SEO DIMENSIONS & FAQ TEMPLATES
  // ============================================
  console.log('\n📈 Creating SEO dimensions and FAQ templates...')

  // Reusable FAQ groups (use `any` to avoid issues if client typings lag behind)
  const anyPrisma = prisma as any

  const cityFaqGroup = await anyPrisma.faqGroup.upsert({
    where: { id: 'city_rent_a_car' },
    update: {},
    create: {
      id: 'city_rent_a_car',
      name: 'city_rent_a_car',
      faqs: {
        create: [
          {
            question: 'How do I book a car for rent in {city_name}?',
            answer:
              'Choose your preferred vehicle, share your travel dates, and our team will confirm availability in {city_name} by phone or WhatsApp before you pay a 2% advance online.',
            sortOrder: 1,
          },
          {
            question: 'Can I hire a car with driver in {city_name}?',
            answer:
              'Yes, most vehicles listed in {city_name} are with professional local drivers who know the routes, tolls, and parking spots. Self-drive options are limited and subject to verification.',
            sortOrder: 2,
          },
          {
            question: 'What documents are required to rent a car in {city_name}?',
            answer:
              'For trips with driver, you usually only need a valid CNIC and active phone number. For self-drive, vendors may ask for CNIC, driving license, and a refundable security deposit.',
            sortOrder: 3,
          },
        ],
      },
    },
  })

  const routeFaqGroup = await anyPrisma.faqGroup.upsert({
    where: { id: 'intercity_routes' },
    update: {},
    create: {
      id: 'intercity_routes',
      name: 'intercity_routes',
      faqs: {
        create: [
          {
            question: 'What is included in the fare from {from_city} to {to_city}?',
            answer:
              'Quoted prices for {from_city} to {to_city} usually include fuel, driver, and basic tolls unless clearly mentioned otherwise by the vendor. Always confirm inclusions on your confirmation call.',
            sortOrder: 1,
          },
          {
            question: 'Can I make stops on the way between {from_city} and {to_city}?',
            answer:
              'Short refreshment and prayer stops are normally included. For longer detours or sightseeing, discuss the route with your vendor so they can adjust pricing if needed.',
            sortOrder: 2,
          },
        ],
      },
    },
  })

  const airportFaqGroup = await anyPrisma.faqGroup.upsert({
    where: { id: 'airport_transfer' },
    update: {},
    create: {
      id: 'airport_transfer',
      name: 'airport_transfer',
      faqs: {
        create: [
          {
            question: 'How do airport transfer bookings work in {city_name}?',
            answer:
              'Share your flight number, landing time, and passenger count. The driver will track your arrival at {city_name} airport and wait with a name card at the pickup area.',
            sortOrder: 1,
          },
          {
            question: 'Is waiting time included in airport transfers?',
            answer:
              'Most vendors include a free waiting window for flight delays. Extra waiting time can be charged per hour, so always confirm the policy before your trip.',
            sortOrder: 2,
          },
        ],
      },
    },
  })

  // Core SEO dimensions for programmatic pages
  await anyPrisma.seoDimension.upsert({
    where: {
      id: 'rent-a-car-city',
    },
    update: {},
    create: {
      id: 'rent-a-car-city',
      slug: 'rent-a-car-city',
      type: 'keyword_city',
      basePattern: '/rent-a-car/{city_slug}',
      defaultH1Template: 'Rent a Car in {city_name}',
      defaultTitleTemplate: 'Rent a Car in {city_name} | Best Car Rental Deals | Rent Now',
      defaultMetaDescriptionTemplate:
        'Compare verified car rental vendors in {city_name}. Browse {vehicles_count}+ vehicles with drivers for city and outstation trips. Pay only 2% advance to confirm.',
      faqGroupId: cityFaqGroup.id,
      isIndexableByDefault: true,
    },
  })

  await anyPrisma.seoDimension.upsert({
    where: {
      id: 'route-rent-a-car',
    },
    update: {},
    create: {
      id: 'route-rent-a-car',
      slug: 'route-rent-a-car',
      type: 'route',
      basePattern: '/routes/{from_slug}-to-{to_slug}',
      defaultH1Template: 'Car Rental from {from_city} to {to_city}',
      defaultTitleTemplate: 'Rent a Car from {from_city} to {to_city} | Intercity Route | Rent Now',
      defaultMetaDescriptionTemplate:
        'Book reliable vehicles with drivers for the {from_city} to {to_city} route. Compare vendors, seat capacity, and prices before paying a 2% advance to confirm your trip.',
      faqGroupId: routeFaqGroup.id,
      isIndexableByDefault: true,
    },
  })

  await anyPrisma.seoDimension.upsert({
    where: {
      id: 'airport-transfer-city',
    },
    update: {},
    create: {
      id: 'airport-transfer-city',
      slug: 'airport-transfer-city',
      type: 'airport_transfer',
      basePattern: '/airport-transfer/{city_slug}',
      defaultH1Template: 'Airport Transfer in {city_name}',
      defaultTitleTemplate: 'Airport Transfer in {city_name} | Reliable Pick & Drop | Rent Now',
      defaultMetaDescriptionTemplate:
        'Book airport transfers in {city_name} with professional drivers and clean vehicles. Ideal for late-night arrivals, business trips, and family travel. Pay only 2% in advance.',
      faqGroupId: airportFaqGroup.id,
      isIndexableByDefault: true,
    },
  })

  console.log('  ✅ SEO dimensions and FAQ templates created')

  // ============================================
  // 8. ASSIGN PREDEFINED VEHICLES TO VENDORS
  // ============================================
  console.log('\n🚗 Cleaning up old vehicles and related bookings...')
  // Delete bookings first to avoid foreign key issues, then vehicles
  await prisma.booking.deleteMany({})
  await prisma.vehicle.deleteMany({})
  console.log('  ✅ Removed all existing bookings and vehicles')

  console.log('\n🚗 Assigning predefined vehicles to vendors...')

  // Distribution: Assign 13 predefined vehicles across 7 vendors and multiple cities
  const vehicleAssignments = [
    // Premium Car Rentals (vendor 0) - Premium vehicles
    { vendorIndex: 0, modelSlug: 'toyota-corolla', citySlug: 'karachi', townSlug: 'karachi-clifton', priceWithDriver: 8000, priceSelfDrive: 5000 },
    { vendorIndex: 0, modelSlug: 'honda-civic', citySlug: 'lahore', townSlug: 'lahore-gulberg', priceWithDriver: 9000, priceSelfDrive: 5500 },
    { vendorIndex: 0, modelSlug: 'toyota-fortuner', citySlug: 'islamabad', townSlug: 'islamabad-f-7', priceWithDriver: 15000, priceSelfDrive: 10000 },
    
    // City Wheels (vendor 1) - Budget vehicles
    { vendorIndex: 1, modelSlug: 'suzuki-wagon-r', citySlug: 'karachi', townSlug: 'karachi-dha', priceWithDriver: 5000, priceSelfDrive: 3000 },
    { vendorIndex: 1, modelSlug: 'suzuki-cultus', citySlug: 'lahore', townSlug: 'lahore-model-town', priceWithDriver: 5500, priceSelfDrive: 3200 },
    { vendorIndex: 1, modelSlug: 'suzuki-alto', citySlug: 'islamabad', townSlug: 'islamabad-g-11', priceWithDriver: 4500, priceSelfDrive: 2800 },
    
    // Elite Motors (vendor 2) - Luxury SUVs
    { vendorIndex: 2, modelSlug: 'toyota-land-cruiser', citySlug: 'lahore', townSlug: 'lahore-dha-phase-5', priceWithDriver: 20000, priceSelfDrive: 12000 },
    { vendorIndex: 2, modelSlug: 'toyota-prado', citySlug: 'islamabad', townSlug: 'islamabad-f-8', priceWithDriver: 18000, priceSelfDrive: 11000 },
    
    // Budget Rent A Car (vendor 3) - Economy
    { vendorIndex: 3, modelSlug: 'honda-city', citySlug: 'rawalpindi', townSlug: 'rawalpindi-chaklala', priceWithDriver: 7000, priceSelfDrive: 4500 },
    
    // Express Car Hire (vendor 4) - Mid-range
    { vendorIndex: 4, modelSlug: 'toyota-yaris', citySlug: 'karachi', townSlug: 'karachi-pechs', priceWithDriver: 7500, priceSelfDrive: 4800 },
    { vendorIndex: 4, modelSlug: 'honda-br-v', citySlug: 'lahore', townSlug: 'lahore-ferozepur-road', priceWithDriver: 12000, priceSelfDrive: 8000 },
    
    // Royal Fleet (vendor 5) - Premium & Vans
    { vendorIndex: 5, modelSlug: 'toyota-hiace', citySlug: 'islamabad', townSlug: 'islamabad-f-7', priceWithDriver: 14000, priceSelfDrive: 9000 },
    { vendorIndex: 5, modelSlug: 'toyota-coaster', citySlug: 'karachi', townSlug: 'karachi-clifton', priceWithDriver: 25000, priceSelfDrive: null },
  ]

  let vehicleCount = 0
  for (const assignment of vehicleAssignments) {
    const vendor = vendorRecords[assignment.vendorIndex]
    const model = predefinedModelRecords.find(m => m.slug === assignment.modelSlug)
    const city = cityRecords.find(c => c.slug === assignment.citySlug)
    const town = townRecords.find(t => t.slug === assignment.townSlug)
    
    if (!vendor || !model || !city) {
      console.log(`  ⚠️  Skipping vehicle assignment: ${assignment.modelSlug} (vendor, model, or city not found)`)
      continue
    }

    // Generate title from model
    const title = `${model.vehicleBrand.name} ${model.name}`
    const baseSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const uniqueSlug = `${baseSlug}-${vendor.slug}-${vehicleCount}`

    const vehicle = await prisma.vehicle.create({
      data: {
        vendorId: vendor.id,
        vehicleModelId: model.id,
        cityId: city.id,
        townId: town?.id || null,
        title: title,
        slug: uniqueSlug,
        transmission: model.defaultTransmission as any,
        seats: model.capacity || 5,
        color: model.defaultColor || 'White',
        images: model.image ? [model.image] : [],
        priceWithDriver: assignment.priceWithDriver,
        priceSelfDrive: assignment.priceSelfDrive,
        isAvailable: true,
        isVerified: true,
      },
    })

    vehicleCount++
    console.log(`  ✅ ${title} → ${vendor.name} (${city.name})`)
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`   - ${cityRecords.length} cities`)
  console.log(`   - ${townRecords.length} towns`)
  console.log(`   - ${brandRecords.length} vehicle brands`)
  console.log(`   - ${modelRecords.length} vehicle models`)
  console.log(`   - ${predefinedModelRecords.length} predefined vehicles`)
  console.log(`   - ${vendorRecords.length} vendors`)
  console.log(`   - ${vehicleCount} vehicle listings`)
  console.log(`\n🔐 Vendor Login Credentials:`)
  vendors.forEach((v, i) => {
    console.log(`   ${i + 1}. ${v.email} / ${v.password}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
