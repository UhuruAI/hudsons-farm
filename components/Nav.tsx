"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/the-farm", label: "The Sanctuary" },
  { href: "/heritage", label: "Heritage" },
  { href: "/experiences", label: "Experiences" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Leaf = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 0 0 3 5 3 9a7 7 0 0 1-5 7Z" />
    <path d="M11 20c0-4 2-7.5 5-9.5" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <>
      <div className="announce">Now booking sanctuary visits · Maanhaarrand, North West</div>

      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        {/* Desktop */}
        <div className="nav-desktop">
          <Link href="/" className="wordmark" aria-label="Revayah Sanctuary home">
            <Leaf size={26} />
            <span>REVAYAH SANCTUARY</span>
          </Link>
          <nav className="mainnav" aria-label="Primary">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={current(href)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="nav-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {mounted && resolvedTheme === "dark" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <Link href="/auth" className="nav-icon" aria-label="My Account">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </Link>
            <Link href="/cart" className="nav-icon" aria-label="Cart">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
                <path d="M2 3h2.2l2.4 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
              </svg>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="nav-mobile">
          <button className="icon-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <Link href="/" className="wordmark" aria-label="Revayah Sanctuary home">
            <Leaf size={20} />
            <span>REVAYAH SANCTUARY</span>
          </Link>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="nav-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {mounted && resolvedTheme === "dark" ? (
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>
            <Link href="/cart" className="nav-icon" aria-label="Cart">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h2.2l2.4 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" /></svg>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div className="drawer-scrim" onClick={() => setMenuOpen(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <span>REVAYAH SANCTUARY</span>
              <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={current(href)} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/auth" className="accent" onClick={() => setMenuOpen(false)}>
              My Account
            </Link>
          </aside>
        </>
      )}
    </>
  );
}
