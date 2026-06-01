import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Convex auth is handled client-side via useConvexAuth.
// This middleware is a no-op pass-through.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
