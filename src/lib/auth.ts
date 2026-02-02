import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Server-side function to get the current user session
 *
 * It supports two ways of receiving the access token:
 * - Cookie: `sb-access-token` (classic Supabase SSR flow)
 * - Authorization header: `Authorization: Bearer <token>`
 *
 * This makes it work both with our client-side auth (where we pass the token
 * explicitly in the Authorization header) and with any future cookie-based flow.
 */
function getAccessTokenFromRequest(request?: { headers: Headers }): string | undefined {
  if (!request?.headers) return undefined
  const authHeader =
    request.headers.get('authorization') ??
    request.headers.get('Authorization') ??
    (request.headers as unknown as Record<string, string>)?.authorization
  if (authHeader && typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim()
  }
  return undefined
}

export async function getServerSession(request?: { headers: Headers }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  let accessToken: string | undefined = getAccessTokenFromRequest(request)

  // Fallback to cookie-based token
  if (!accessToken) {
    const cookieStore = await cookies()
    accessToken = cookieStore.get('sb-access-token')?.value
  }

  if (!accessToken) {
    return { user: null, session: null }
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // We don't have full session info from getUser in this simplified setup.
  // Treat a non-null user as an authenticated session.
  const session = user ? { user } as any : null

  return { user, session }
}

/**
 * Server-side function to require authentication
 * Throws an error if user is not authenticated
 */
export async function requireAuth(request?: { headers: Headers }) {
  const { user, session } = await getServerSession(request)

  if (!user || !session) {
    throw new Error('Unauthorized')
  }

  return { user, session }
}

/**
 * Server-side function to require admin role
 * Throws an error if user is not authenticated or not an admin
 */
export async function requireAdmin(request?: { headers: Headers }) {
  const { user, session } = await requireAuth(request)

  // Check if user has admin role in metadata
  const role = user.user_metadata?.role
  if (role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  return { user, session }
}

/**
 * Check if current user is admin (non-throwing)
 */
export async function isAdmin(request?: { headers: Headers }): Promise<boolean> {
  try {
    await requireAdmin(request)
    return true
  } catch {
    return false
  }
}

