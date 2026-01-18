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
  // 3. VEHICLE BRANDS
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
  // 4. VEHICLE MODELS
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
      modelRecord = await prisma.vehicleModel.create({
        data: {
          name: model.name,
          slug: modelSlug,
          vehicleBrandId: brand.id,
          isActive: true,
        },
      })
    }
    modelRecords.push(modelRecord)
    console.log(`  ✅ ${brand.name} ${model.name}`)
  }

  // ============================================
  // 5. CREATE SUPABASE AUTH USERS & VENDORS
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
    const vendor = await prisma.vendor.create({
      data: {
        name: vendorData.name,
        slug: vendorData.name.toLowerCase().replace(/\s+/g, '-'),
        email: vendorData.email,
        phone: vendorData.phone,
        description: vendorData.description,
        supabaseUserId: authData.user.id,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        isActive: true,
      },
    })

    vendorRecords.push(vendor)
    console.log(`  ✅ ${vendorData.name} (${vendorData.email})`)
  }

  // ============================================
  // 6. CREATE VEHICLES WITH LOCATION
  // ============================================
  console.log('\n🚗 Creating vehicles...')

  const vehicles = [
    // Premium Car Rentals (vendor 0) - Luxury & Premium
    { vendor: 0, model: 'toyota-corolla', title: 'Toyota Corolla 2023', year: 2023, mileage: 15000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Power Steering'], color: 'White', citySlug: 'karachi', townSlug: 'karachi-clifton' },
    { vendor: 0, model: 'honda-civic', title: 'Honda Civic 2024', year: 2024, mileage: 5000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats'], color: 'Silver', citySlug: 'lahore', townSlug: 'lahore-gulberg' },
    { vendor: 0, model: 'mercedes-benz-c-class', title: 'Mercedes-Benz C-Class 2023', year: 2023, mileage: 12000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound'], color: 'Black', citySlug: 'islamabad', townSlug: 'islamabad-f-7' },
    { vendor: 0, model: 'bmw-3-series', title: 'BMW 3 Series 2024', year: 2024, mileage: 8000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound', 'Heated Seats'], color: 'Blue', citySlug: 'islamabad', townSlug: 'islamabad-e-11' },
    { vendor: 0, model: 'audi-a4', title: 'Audi A4 2023', year: 2023, mileage: 14000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound'], color: 'Black', citySlug: 'karachi', townSlug: 'karachi-defence' },
    { vendor: 0, model: 'toyota-camry', title: 'Toyota Camry 2023', year: 2023, mileage: 18000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Leather Seats'], color: 'Silver', citySlug: 'lahore', townSlug: 'lahore-bahria-town' },
    
    // City Wheels (vendor 1) - Budget & Economy
    { vendor: 1, model: 'suzuki-mehran', title: 'Suzuki Mehran 2022', year: 2022, mileage: 30000, fuelType: 'CNG', transmission: 'MANUAL', seats: 5, features: ['AC', 'Power Steering'], color: 'White', citySlug: 'karachi', townSlug: 'karachi-dha' },
    { vendor: 1, model: 'suzuki-swift', title: 'Suzuki Swift 2023', year: 2023, mileage: 20000, fuelType: 'PETROL', transmission: 'MANUAL', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Power Steering'], color: 'Red', citySlug: 'lahore', townSlug: 'lahore-model-town' },
    { vendor: 1, model: 'suzuki-cultus', title: 'Suzuki Cultus 2023', year: 2023, mileage: 22000, fuelType: 'PETROL', transmission: 'MANUAL', seats: 5, features: ['AC', 'Power Steering', 'Bluetooth'], color: 'Blue', citySlug: 'islamabad', townSlug: 'islamabad-g-11' },
    { vendor: 1, model: 'suzuki-alto', title: 'Suzuki Alto 2022', year: 2022, mileage: 28000, fuelType: 'CNG', transmission: 'MANUAL', seats: 5, features: ['AC', 'Power Steering'], color: 'White', citySlug: 'rawalpindi', townSlug: 'rawalpindi-chaklala' },
    { vendor: 1, model: 'toyota-vitz', title: 'Toyota Vitz 2023', year: 2023, mileage: 15000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Power Steering'], color: 'Silver', citySlug: 'faisalabad', townSlug: 'faisalabad-d-ground' },
    { vendor: 1, model: 'honda-city', title: 'Honda City 2023', year: 2023, mileage: 16000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera'], color: 'White', citySlug: 'multan', townSlug: 'multan-cantt' },
    
    // Elite Motors (vendor 2) - Luxury Collection
    { vendor: 2, model: 'toyota-land-cruiser', title: 'Toyota Land Cruiser 2023', year: 2023, mileage: 25000, fuelType: 'DIESEL', transmission: 'AUTOMATIC', seats: 7, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', '4WD', 'Premium Sound'], color: 'Black', citySlug: 'lahore', townSlug: 'lahore-dha-phase-5' },
    { vendor: 2, model: 'mercedes-benz-e-class', title: 'Mercedes-Benz E-Class 2024', year: 2024, mileage: 6000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound', 'Heated Seats'], color: 'Black', citySlug: 'islamabad', townSlug: 'islamabad-f-8' },
    { vendor: 2, model: 'bmw-5-series', title: 'BMW 5 Series 2023', year: 2023, mileage: 10000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound', 'Heated Seats'], color: 'White', citySlug: 'karachi', townSlug: 'karachi-gulshan-e-iqbal' },
    { vendor: 2, model: 'audi-a6', title: 'Audi A6 2023', year: 2023, mileage: 11000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound'], color: 'Silver', citySlug: 'lahore', townSlug: 'lahore-johar-town' },
    { vendor: 2, model: 'honda-accord', title: 'Honda Accord 2023', year: 2023, mileage: 13000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats'], color: 'Black', citySlug: 'islamabad', townSlug: 'islamabad-dha-phase-2' },
    
    // Budget Rent A Car (vendor 3) - Economy Focus
    { vendor: 3, model: 'suzuki-mehran', title: 'Suzuki Mehran 2021', year: 2021, mileage: 45000, fuelType: 'CNG', transmission: 'MANUAL', seats: 5, features: ['AC', 'Power Steering'], color: 'White', citySlug: 'karachi', townSlug: 'karachi-gulistan-e-johar' },
    { vendor: 3, model: 'suzuki-wagon-r', title: 'Suzuki Wagon R 2022', year: 2022, mileage: 35000, fuelType: 'CNG', transmission: 'MANUAL', seats: 5, features: ['AC', 'Power Steering'], color: 'Silver', citySlug: 'lahore', townSlug: 'lahore-wapda-town' },
    { vendor: 3, model: 'daihatsu-mira', title: 'Daihatsu Mira 2022', year: 2022, mileage: 32000, fuelType: 'CNG', transmission: 'MANUAL', seats: 5, features: ['AC', 'Power Steering'], color: 'White', citySlug: 'islamabad', townSlug: 'islamabad-i-8' },
    { vendor: 3, model: 'suzuki-bolan', title: 'Suzuki Bolan 2021', year: 2021, mileage: 50000, fuelType: 'CNG', transmission: 'MANUAL', seats: 7, features: ['AC'], color: 'White', citySlug: 'rawalpindi', townSlug: 'rawalpindi-cantt' },
    { vendor: 3, model: 'toyota-corolla', title: 'Toyota Corolla 2022', year: 2022, mileage: 28000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Power Steering'], color: 'Silver', citySlug: 'faisalabad', townSlug: 'faisalabad-satiana-road' },
    
    // Express Car Hire (vendor 4) - Mid-Range
    { vendor: 4, model: 'toyota-corolla', title: 'Toyota Corolla 2024', year: 2024, mileage: 8000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Power Steering'], color: 'White', citySlug: 'karachi', townSlug: 'karachi-pechs' },
    { vendor: 4, model: 'honda-civic', title: 'Honda Civic 2023', year: 2023, mileage: 17000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera'], color: 'Silver', citySlug: 'lahore', townSlug: 'lahore-ferozepur-road' },
    { vendor: 4, model: 'hyundai-elantra', title: 'Hyundai Elantra 2023', year: 2023, mileage: 19000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera'], color: 'White', citySlug: 'islamabad', townSlug: 'islamabad-blue-area' },
    { vendor: 4, model: 'nissan-sunny', title: 'Nissan Sunny 2023', year: 2023, mileage: 21000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Power Steering'], color: 'Silver', citySlug: 'rawalpindi', townSlug: 'rawalpindi-dha-phase-1' },
    { vendor: 4, model: 'kia-sportage', title: 'Kia Sportage 2023', year: 2023, mileage: 15000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Sunroof'], color: 'Black', citySlug: 'multan', townSlug: 'multan-gulgasht' },
    { vendor: 4, model: 'hyundai-tucson', title: 'Hyundai Tucson 2023', year: 2023, mileage: 14000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Sunroof'], color: 'White', citySlug: 'peshawar', townSlug: 'peshawar-hayatabad' },
    
    // Royal Fleet (vendor 5) - Premium & Luxury
    { vendor: 5, model: 'toyota-land-cruiser', title: 'Toyota Land Cruiser 2024', year: 2024, mileage: 5000, fuelType: 'DIESEL', transmission: 'AUTOMATIC', seats: 7, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', '4WD', 'Premium Sound'], color: 'White', citySlug: 'islamabad', townSlug: 'islamabad-f-7' },
    { vendor: 5, model: 'mercedes-benz-c-class', title: 'Mercedes-Benz C-Class 2024', year: 2024, mileage: 4000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound'], color: 'Black', citySlug: 'karachi', townSlug: 'karachi-clifton' },
    { vendor: 5, model: 'bmw-3-series', title: 'BMW 3 Series 2023', year: 2023, mileage: 12000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Premium Sound'], color: 'Blue', citySlug: 'lahore', townSlug: 'lahore-gulberg' },
    { vendor: 5, model: 'honda-cr-v', title: 'Honda CR-V 2023', year: 2023, mileage: 16000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Sunroof'], color: 'Silver', citySlug: 'rawalpindi', townSlug: 'rawalpindi-bahria-town' },
    { vendor: 5, model: 'nissan-x-trail', title: 'Nissan X-Trail 2023', year: 2023, mileage: 18000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 7, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Sunroof'], color: 'White', citySlug: 'quetta', townSlug: 'quetta-cantt' },
    
    // Quick Drive (vendor 6) - Variety
    { vendor: 6, model: 'suzuki-swift', title: 'Suzuki Swift 2024', year: 2024, mileage: 3000, fuelType: 'PETROL', transmission: 'MANUAL', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Power Steering'], color: 'Red', citySlug: 'gujranwala', townSlug: 'gujranwala-cantt' },
    { vendor: 6, model: 'toyota-corolla', title: 'Toyota Corolla 2023', year: 2023, mileage: 20000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera'], color: 'White', citySlug: 'sialkot', townSlug: 'sialkot-cantt' },
    { vendor: 6, model: 'honda-city', title: 'Honda City 2023', year: 2023, mileage: 22000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera'], color: 'Silver', citySlug: 'sargodha', townSlug: 'sargodha-cantt' },
    { vendor: 6, model: 'hyundai-accent', title: 'Hyundai Accent 2022', year: 2022, mileage: 30000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Power Steering'], color: 'White', citySlug: 'bahawalpur', townSlug: 'bahawalpur-cantt' },
    { vendor: 6, model: 'kia-picanto', title: 'Kia Picanto 2023', year: 2023, mileage: 15000, fuelType: 'PETROL', transmission: 'MANUAL', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Power Steering'], color: 'Red', citySlug: 'peshawar', townSlug: 'peshawar-university-town' },
    { vendor: 6, model: 'volkswagen-golf', title: 'Volkswagen Golf 2023', year: 2023, mileage: 13000, fuelType: 'PETROL', transmission: 'AUTOMATIC', seats: 5, features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera'], color: 'Black', citySlug: 'multan', townSlug: 'multan-bosan-road' },
  ]

  let vehicleIndex = 0
  for (const vehicleData of vehicles) {
    const vendor = vendorRecords[vehicleData.vendor]
    const model = modelRecords.find(m => m.slug === vehicleData.model)
    const city = cityRecords.find(c => c.slug === vehicleData.citySlug)
    const town = townRecords.find(t => t.slug === vehicleData.townSlug)
    
    if (!vendor || !model || !city) {
      console.log(`  ⚠️  Skipping vehicle: ${vehicleData.title} (vendor, model, or city not found)`)
      continue
    }

    // Generate unique slug by including vendor slug and index
    const baseSlug = vehicleData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const uniqueSlug = `${baseSlug}-${vendor.slug}-${vehicleIndex}`

    const vehicle = await prisma.vehicle.create({
      data: {
        vendorId: vendor.id,
        vehicleModelId: model.id,
        cityId: city.id,
        townId: town?.id || null,
        title: vehicleData.title,
        slug: uniqueSlug,
        description: `Well-maintained ${vehicleData.title} available for rent. ${vehicleData.features.join(', ')}.`,
        year: vehicleData.year,
        mileage: vehicleData.mileage,
        fuelType: vehicleData.fuelType as any,
        transmission: vehicleData.transmission as any,
        seats: vehicleData.seats,
        features: vehicleData.features,
        color: vehicleData.color,
        images: [
          `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop`,
          `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop`,
        ],
        isAvailable: true,
        isVerified: true,
        featured: vehicleData.vendor === 0, // Premium Car Rentals vehicles are featured
      },
    })

    vehicleIndex++
    const locationText = town ? `${town.name}, ${city.name}` : city.name
    console.log(`  ✅ ${vehicleData.title} - ${locationText}`)
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`   - ${cityRecords.length} cities`)
  console.log(`   - ${townRecords.length} towns`)
  console.log(`   - ${brandRecords.length} vehicle brands`)
  console.log(`   - ${modelRecords.length} vehicle models`)
  console.log(`   - ${vendorRecords.length} vendors`)
  console.log(`   - ${vehicles.length} vehicles`)
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
