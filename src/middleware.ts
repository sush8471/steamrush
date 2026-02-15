import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Only protect /admin routes (except /admin/login)
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // Allow access to login page
        if (request.nextUrl.pathname === "/admin/login") {
            return response;
        }

        // Create Supabase client
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet: any) {
                        cookiesToSet.forEach(({ name, value, options }: any) =>
                            request.cookies.set(name, value)
                        );
                        cookiesToSet.forEach(({ name, value, options }: any) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Check if user is authenticated
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // If not authenticated, redirect to login
        if (!user) {
            const loginUrl = new URL("/admin/login", request.url);
            loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
