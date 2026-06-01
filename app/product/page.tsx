"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";
import type { Id } from "@/convex/_generated/dataModel";

function fmt(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

function ProductDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const product = useQuery(
    api.products.get,
    id ? { id: id as Id<"products"> } : "skip"
  );

  if (!id) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <p style={{ color: "var(--muted)" }}>No product selected.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>Browse the shop</Link>
      </div>
    );
  }
  if (product === undefined) {
    return <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>Loading…</div>;
  }
  if (product === null) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <p style={{ color: "var(--muted)" }}>Product not found.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>Browse the shop</Link>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product._id, name: product.name, price: product.price, image: product.image });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div>
      <div className="container" style={{ paddingTop: "2rem" }}>
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>
          ← Back to shop
        </Link>
      </div>
      <section className="section" style={{ paddingTop: "1.5rem" }}>
        <div className="container">
          <div className="split">
            <div className="split-img" style={{ borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--surface-soft)" }}>
              {product.image ? (
                <Image src={product.image} alt={product.name} width={600} height={500} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--border)" }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="split-text">
              <span className="eyebrow">{product.category}</span>
              <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>{product.name}</h1>
              <p style={{ fontSize: "1.0625rem", color: "var(--muted)", lineHeight: 1.7 }}>{product.description}</p>
              <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--fg)", marginTop: "0.5rem" }}>{fmt(product.price)}</p>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    style={{ padding: "0.5rem 0.875rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.125rem", color: "var(--fg)" }}
                  >−</button>
                  <span style={{ padding: "0.5rem 0.75rem", minWidth: "2.5rem", textAlign: "center", fontWeight: 600 }}>{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    style={{ padding: "0.5rem 0.875rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.125rem", color: "var(--fg)" }}
                  >+</button>
                </div>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>
                  {added ? "Added to cart ✓" : "Add to cart"}
                </button>
              </div>

              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--surface-soft)", borderRadius: "var(--r-md)", fontSize: "0.875rem", color: "var(--muted)" }}>
                <p style={{ marginBottom: "0.25rem" }}>🚚 Free delivery on orders over R500</p>
                <p style={{ marginBottom: "0.25rem" }}>📦 R80 flat-rate delivery</p>
                <p>🔒 Secure payment via Paystack</p>
              </div>

              <Link href="/cart" className="btn btn-secondary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>View cart</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductPage() {
  return (
    <main>
      <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Loading…</div>}>
        <ProductDetail />
      </Suspense>
    </main>
  );
}
