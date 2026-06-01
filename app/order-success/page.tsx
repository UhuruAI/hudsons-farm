"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const id = searchParams.get("id");
  const { clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>
          ✓
        </div>

        <span className="eyebrow">Order placed</span>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>Payment successful!</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.0625rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          Your order has been confirmed. We&apos;ll get it packed and on its way. You&apos;ll receive an email confirmation once it ships.
        </p>

        {ref && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1rem 1.5rem", marginBottom: "2rem", fontSize: "0.9375rem" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "0.25rem" }}>Payment reference</p>
            <p style={{ fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.05em" }}>{ref}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {id && (
            <Link href="/dashboard" className="btn btn-primary">View my orders</Link>
          )}
          <Link href="/shop" className="btn btn-secondary">Continue shopping</Link>
        </div>

        <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "var(--muted)" }}>
          Questions? Call Peter on <a href="tel:0731615319" style={{ color: "var(--accent)" }}>073 161 5319</a>
        </p>
      </div>
    </section>
  );
}

export default function OrderSuccessPage() {
  return (
    <main>
      <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Loading…</div>}>
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
