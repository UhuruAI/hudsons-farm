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
  const [descOpen, setDescOpen] = useState(true);
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
    <section className="section" style={{ paddingTop: "clamp(32px,4vw,56px)" }}>
      <div className="container">
        <nav className="pdp-crumb">
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <Link href="/shop">{product.category}</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="pdp-grid">
          {/* Image */}
          <div className="pdp-media">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.name} />
            ) : (
              <div className="pdp-media-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--border)" }}><rect x="3" y="3" width="18" height="18" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pdp-info">
            <span className="pdp-eyebrow">{product.category}</span>
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-price">{fmt(product.price)}</p>

            <hr className="pdp-divider" />

            <div className="pdp-ship">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 3h13v13H1zM14 8h4l3 3v5h-7" /><circle cx="6" cy="18" r="1.6" /><circle cx="18" cy="18" r="1.6" />
              </svg>
              <span>Free delivery over R500 · R80 flat-rate nationwide</span>
            </div>

            <hr className="pdp-divider" />

            <span className="pdp-qty-label">Quantity</span>
            <div className="pdp-buy">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span className="qty-display">{qty}</span>
                <button className="qty-btn" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button className="btn btn-solid" style={{ width: "100%", marginTop: 16 }} onClick={handleAdd}>
              {added ? "Added to cart ✓" : "Add to cart"}
            </button>

            <hr className="pdp-divider" />

            <button className="pdp-accordion" onClick={() => setDescOpen((o) => !o)} aria-expanded={descOpen}>
              <span>Description</span>
              <span className="pdp-acc-icon">{descOpen ? "–" : "+"}</span>
            </button>
            {descOpen && <p className="pdp-desc">{product.description}</p>}

            <hr className="pdp-divider" />

            <Link href="/cart" className="pdp-cart-link">View cart →</Link>
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
