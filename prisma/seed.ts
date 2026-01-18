// Prisma 7: Set DATABASE_URL in process.env before importing
const DATABASE_URL = process.env.DATABASE_URL

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Prisma 7: Use adapter for Postgres connection
const pool = new Pool({ connectionString: DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // Create Pakistan country
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

  console.log('✅ Created country: Pakistan')

  // Major Pakistani cities with provinces
  const cities = [
    { name: 'Karachi', slug: 'karachi', province: 'Sindh' },
    { name: 'Lahore', slug: 'lahore', province: 'Punjab' },
    { name: 'Islamabad', slug: 'islamabad', province: 'Islamabad Capital Territory' },
    { name: 'Rawalpindi', slug: 'rawalpindi', province: 'Punjab' },
    { name: 'Faisalabad', slug: 'faisalabad', province: 'Punjab' },
    { name: 'Multan', slug: 'multan', province: 'Punjab' },
    { name: 'Peshawar', slug: 'peshawar', province: 'Khyber Pakhtunkhwa' },
    { name: 'Quetta', slug: 'quetta', province: 'Balochistan' },
    { name: 'Sialkot', slug: 'sialkot', province: 'Punjab' },
    { name: 'Gujranwala', slug: 'gujranwala', province: 'Punjab' },
    { name: 'Hyderabad', slug: 'hyderabad', province: 'Sindh' },
    { name: 'Sargodha', slug: 'sargodha', province: 'Punjab' },
    { name: 'Bahawalpur', slug: 'bahawalpur', province: 'Punjab' },
    { name: 'Sukkur', slug: 'sukkur', province: 'Sindh' },
    { name: 'Larkana', slug: 'larkana', province: 'Sindh' },
    { name: 'Sheikhupura', slug: 'sheikhupura', province: 'Punjab' },
    { name: 'Rahim Yar Khan', slug: 'rahim-yar-khan', province: 'Punjab' },
    { name: 'Gujrat', slug: 'gujrat', province: 'Punjab' },
    { name: 'Kasur', slug: 'kasur', province: 'Punjab' },
    { name: 'Mardan', slug: 'mardan', province: 'Khyber Pakhtunkhwa' },
    { name: 'Mingora', slug: 'mingora', province: 'Khyber Pakhtunkhwa' },
    { name: 'Nawabshah', slug: 'nawabshah', province: 'Sindh' },
    { name: 'Chiniot', slug: 'chiniot', province: 'Punjab' },
    { name: 'Kotri', slug: 'kotri', province: 'Sindh' },
    { name: 'Khanpur', slug: 'khanpur', province: 'Punjab' },
    { name: 'Hafizabad', slug: 'hafizabad', province: 'Punjab' },
    { name: 'Kohat', slug: 'kohat', province: 'Khyber Pakhtunkhwa' },
    { name: 'Jacobabad', slug: 'jacobabad', province: 'Sindh' },
    { name: 'Shikarpur', slug: 'shikarpur', province: 'Sindh' },
    { name: 'Muzaffarabad', slug: 'muzaffarabad', province: 'Azad Kashmir' },
  ]

  // Create cities
  for (const city of cities) {
    await prisma.city.upsert({
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
    console.log(`✅ Created city: ${city.name}`)
  }

  console.log(`\n🎉 Seed completed! Created ${cities.length} cities in Pakistan.`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

