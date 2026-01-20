import { prisma } from '@/lib/prisma'
import type { User } from '@supabase/supabase-js'

/**
 * Get or create a vendor from Supabase user
 * This links the Supabase auth user to a Vendor record
 */
export async function getOrCreateVendor(user: User) {
  // Check if vendor already exists
  let vendor = await prisma.vendor.findUnique({
    where: { supabaseUserId: user.id },
  })

  if (!vendor) {
    // Create new vendor from user data
    const email = user.email || ''
    const name = (user.user_metadata?.full_name as string) || email.split('@')[0] || 'Vendor'
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).substring(2, 9)

    vendor = await prisma.vendor.create({
      data: {
        name,
        slug,
        email,
        supabaseUserId: user.id,
        verificationStatus: 'PENDING',
        isActive: true,
      },
    })
  }

  return vendor
}

/**
 * Get vendor by Supabase user ID
 */
export async function getVendorByUserId(userId: string) {
  return await prisma.vendor.findUnique({
    where: { supabaseUserId: userId },
  })
}

