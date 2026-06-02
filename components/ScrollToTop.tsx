"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getRouteScrollKey } from "@/lib/routeScroll.js";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = getRouteScrollKey(pathname, searchParams?.toString());

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [routeKey]);

  return null;
}
