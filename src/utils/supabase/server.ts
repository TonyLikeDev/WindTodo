import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient(isRememberMe?: boolean) {
  const cookieStore = await cookies()
  const rememberCookie = cookieStore.get('remember_me')?.value
  const remember = isRememberMe !== undefined ? isRememberMe : (rememberCookie !== 'false')

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (!remember) {
                delete options.maxAge
                delete options.expires
              }
              cookieStore.set(name, value, options)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
