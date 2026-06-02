import { proxyAuthActionToConvex } from "@convex-dev/auth/nextjs/server";
import { NextRequest } from "next/server";

async function handler(request: NextRequest) {
  return proxyAuthActionToConvex(request, {
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
  });
}

export { handler as GET, handler as POST };
