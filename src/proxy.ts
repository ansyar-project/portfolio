import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers for better SEO ranking
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Add caching headers for better performance
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/_next/static/")
  ) {
    // Cache static assets for 1 year
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  } else if (pathname === "/" || pathname.startsWith("/#")) {
    // Cache main page for 1 hour with revalidation
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, must-revalidate"
    );
  }

  // Add preload hints for critical resources
  if (pathname === "/") {
    response.headers.set(
      "Link",
      [
        "</images/og-image.png>; rel=preload; as=image",
        "<https://fonts.googleapis.com>; rel=preconnect",
        "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
      ].join(", ")
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
