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
      <div className="success-card">
        <div className="success-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <span className="eyebrow">Order placed</span>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "12px 0 16px" }}>Thank you, your order is confirmed</h1>
        <p style={{ color: "var(--muted)", fontSize: 16.5, lineHeight: 1.7 }}>
          Your order has been confirmed. We&apos;ll get it packed and on its way. You&apos;ll receive an email confirmation once it ships.
        </p>

        {ref && (
          <div className="success-ref">
            <span style={{ color: "var(--muted)", fontWeight: 400, marginRight: 8 }}>Reference</span>
            <span style={{ fontFamily: "monospace" }}>{ref}</span>
          </div>
        )}

        <div className="success-actions">
          {id && <Link href="/dashboard" className="btn btn-solid">View my orders</Link>}
          <Link href="/shop" className="btn btn-ghost">Continue shopping</Link>
        </div>

        <p style={{ marginTop: "2rem", fontSize: 14, color: "var(--muted)" }}>
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
