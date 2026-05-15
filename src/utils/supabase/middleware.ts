import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const rememberCookie = request.cookies.get('remember_me')?.value
  const remember = rememberCookie !== 'false'

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
          cookiesToSet.forEach(({ name, value, options }) => {
            if (!remember) {
              delete options.maxAge
              delete options.expires
            }
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()
if (
  !user &&
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
