import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const url = new URL(request.url);

  // Redirect ?page= parameter only for the home page
  if (url.pathname === "/" && url.searchParams.has("page")) {
    return NextResponse.redirect(url.origin);
  }

  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  return response;
}
