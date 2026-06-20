"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";
import type { Id } from "@/convex/_generated/dataModel";
import { getProductImage } from "@/lib/productImage.js";

function fmt(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

function ProductDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const product = useQuery(api.products.get, id ? { id: id as Id<"products"> } : "skip");

  if (!id) {
    return (
      <div className="empty-cart">
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>No product selected.</p>
        <Link href="/shop" className="btn btn-solid">Browse the shop</Link>
      </div>
    );
  }
  if (product === undefined) {
    return <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>Loading…</div>;
  }
  if (product === null) {
    return (
      <div className="empty-cart">
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Product not found.</p>
        <Link href="/shop" className="btn btn-solid">Browse the shop</Link>
      </div>
    );
  }

  const image = getProductImage(product);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product._id, name: product.name, price: product.price, image });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <section className="section">
      <div className="container">
        <nav style={{ marginBottom: 28, fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
          <Link href="/shop" style={{ color: "var(--muted)" }}>Shop</Link> · {product.category} · <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </nav>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(28px,4vw,56px)" }} className="product-detail-grid">
          <div style={{ position: "relative", aspectRatio: "1", background: "var(--bg-alt)", border: "1px solid var(--border-soft)", overflow: "hidden" }}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--border)" }}><rect x="3" y="3" width="18" height="18" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              </div>
            )}
          </div>
          <div>
            <span className="eyebrow">{product.category}</span>
            <h1 style={{ fontSize: "clamp(28px,4vw,42px)", margin: "12px 0 16px" }}>{product.name}</h1>
            <p style={{ fontSize: 16.5, color: "var(--muted)", lineHeight: 1.7 }}>{product.description}</p>
            <p style={{ fontFamily: "var(--font-head)", fontWeight: 400, fontSize: 32, color: "var(--ink)", margin: "20px 0" }}>{fmt(product.price)}</p>

            <div style={{ display: "flex", alignItems: "stretch", gap: 14, marginBottom: 24 }}>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span className="qty-display">{qty}</span>
                <button className="qty-btn" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
              <button className="btn btn-solid" style={{ flex: 1 }} onClick={handleAdd}>
                {added ? "Added to cart ✓" : "Add to cart"}
              </button>
            </div>

            <ul className="feature-list" style={{ marginTop: 0 }}>
              {["Free delivery on orders over R500", "R80 flat-rate delivery", "Secure payment via Paystack"].map((t) => (
                <li key={t}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  {t}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 24 }}>
              <Link href="/cart" className="btn btn-ghost">View cart</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
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
