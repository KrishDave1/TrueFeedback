/** @format */

import { NextRequest, NextResponse } from "next/server";
// The most simple usage is when you want to require authentication for your entire site.You can add a middleware.js file with the following:
export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt"; // Used to get the JWT token

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// config is all the locations where this middleware should be applied before running the backend code for the page
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
