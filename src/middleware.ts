import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isProtectedRoute(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/notes") || pathname.startsWith("/tags");
}

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}

function isInvalidSessionError(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";
  return normalizedMessage.includes("jwt issued at future") || normalizedMessage.includes("invalid jwt");
}

function clearSupabaseCookies(request: NextRequest, response: NextResponse) {
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-")) {
      response.cookies.set(cookie.name, "", {
        maxAge: 0,
        path: "/"
      });
    }
  });

  return response;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        }
      }
    }
  );

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const hasInvalidSession = isInvalidSessionError(error?.message);

  if (hasInvalidSession && isProtectedRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("session", "expired");
    return clearSupabaseCookies(request, NextResponse.redirect(url));
  }

  if (hasInvalidSession && isAuthRoute(pathname)) {
    return clearSupabaseCookies(request, response);
  }

  if (isProtectedRoute(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthRoute(pathname) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/notes/:path*", "/tags", "/login", "/register"]
};
