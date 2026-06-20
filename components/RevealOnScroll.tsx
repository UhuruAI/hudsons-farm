"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((e) => {
      // already in view on load → reveal immediately
      const r = e.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        e.classList.add("in");
      } else {
        io.observe(e);
      }
    });

    // safety: ensure nothing stays hidden
    const t = window.setTimeout(() => {
      els.forEach((e) => {
        if (getComputedStyle(e).opacity === "0") e.classList.add("in");
      });
    }, 2200);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
