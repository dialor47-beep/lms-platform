import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Check if the route is an admin route
    if (req.nextUrl.pathname.startsWith('/admin')) {
        // If no session, redirect to login
        if (!session) {
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }

        // Get user profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        // If not admin, redirect to dashboard
        if (profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/admin/:path*'],
}
