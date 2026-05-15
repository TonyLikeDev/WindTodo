import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verify the JWT locally via cached JWKS — no HTTP roundtrip to Supabase
  // Auth. `getClaims()` returns null claims for an unauthenticated request and
  // returns an error if the JWT is invalid/expired.
  const { data, error } = await supabase.auth.getClaims()
  const hasAuth = !error && !!data?.claims
if (
  !hasAuth &&
  !request.nextUrl.pathname.startsWith('/login') &&
  !request.nextUrl.pathname.startsWith('/signup') &&
  !request.nextUrl.pathname.startsWith('/auth') &&
  request.nextUrl.pathname !== '/'
) {
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('error', 'Please log in to access the site.')
  return NextResponse.redirect(url)
}

  return supabaseResponse
}
