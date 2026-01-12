// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth();

  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/profile", "/projects", "/admin"];

  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
