"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";

function fmt(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCart();
  const settings = useQuery(api.settings.get);
  const DELIVERY_FEE = settings?.deliveryFee ?? 8000;
  const FREE_THRESHOLD = settings?.freeThreshold ?? 50000;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Farm Kitchen</span>
          <h1>Your Cart</h1>
          {items.length > 0 && (
            <p>{items.reduce((n, i) => n + i.quantity, 0)} item{items.reduce((n, i) => n + i.quantity, 0) !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Your cart is empty.</p>
              <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr min(380px, 100%)", gap: "3rem", alignItems: "start" }}>
              {/* Items */}
              <div>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "1.25rem", padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
                    <Link href={`/product?id=${item.id}`} style={{ flexShrink: 0 }}>
                      {item.image ? (
                        <div style={{ width: 88, height: 88, borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ width: 88, height: 88, borderRadius: "var(--r-sm)", background: "var(--surface-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--border)" }}>
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </Link>
                    <div style={{ flex: 1 }}>
                      <Link href={`/product?id=${item.id}`} style={{ fontWeight: 600, textDecoration: "none", color: "var(--fg)", marginBottom: "0.25rem", display: "block" }}>{item.name}</Link>
                      <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{fmt(item.price)} each</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ padding: "0.3rem 0.625rem", background: "none", border: "none", cursor: "pointer", color: "var(--fg)", fontSize: "1rem" }}>−</button>
                          <span style={{ padding: "0.3rem 0.625rem", minWidth: "2rem", textAlign: "center", fontWeight: 600, fontSize: "0.9375rem" }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ padding: "0.3rem 0.625rem", background: "none", border: "none", cursor: "pointer", color: "var(--fg)", fontSize: "1rem" }}>+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.8125rem", padding: 0 }}>Remove</button>
                      </div>
                    </div>
                    <p style={{ fontWeight: 700, flexShrink: 0, paddingTop: "0.125rem" }}>{fmt(item.price * item.quantity)}</p>
                  </div>
                ))}
                <button onClick={clearCart} style={{ marginTop: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.8125rem", padding: 0 }}>
                  Clear cart
                </button>
              </div>

              {/* Summary */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.5rem", position: "sticky", top: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>Order summary</h2>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
                  <span style={{ color: "var(--muted)" }}>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
                  <span style={{ color: "var(--muted)" }}>Delivery</span>
                  <span style={{ color: deliveryFee === 0 ? "var(--accent)" : "inherit" }}>{deliveryFee === 0 ? "Free" : fmt(deliveryFee)}</span>
                </div>

                {subtotal > 0 && subtotal < FREE_THRESHOLD && (
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)", background: "var(--surface-soft)", padding: "0.5rem 0.75rem", borderRadius: "var(--r-sm)", marginBottom: "0.75rem" }}>
                    Add {fmt(FREE_THRESHOLD - subtotal)} more for free delivery
                  </p>
                )}

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.125rem", marginBottom: "1.25rem" }}>
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>

                <Link href="/checkout" className="btn btn-primary" style={{ width: "100%", display: "block", textAlign: "center" }}>
                  Proceed to checkout
                </Link>
                <Link href="/shop" style={{ display: "block", textAlign: "center", marginTop: "0.875rem", color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>
                  Continue shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
