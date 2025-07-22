import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
// const publicRoutes = [
//   '/',
//   '/login',
//   '/signup',
//   '/auth/callback',
//   '/auth/reset-password',
//   '/about',
//   '/contact',
//   '/privacy',
//   '/terms',
// ]

// Define auth routes that should redirect authenticated users
const authRoutes = [
  '/login',
  '/signup',
]

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Block test pages in production
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/test-')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Check if the current route is public
  // const isPublicRoute = publicRoutes.some(route =>
  //   pathname === route || pathname.startsWith(`${route}/`)
  // )

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // For protected routes, we'll let the client-side auth handle redirects
  // This is a simpler approach that works well with the AuthProvider
  if (isProtectedRoute) {
    // Add a header to indicate this is a protected route
    const response = NextResponse.next()
    response.headers.set('x-protected-route', 'true')
    return response
  }

  // For auth routes, add a header to indicate guest-only
  if (isAuthRoute) {
    const response = NextResponse.next()
    response.headers.set('x-guest-route', 'true')
    return response
  }

  // For all other routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
