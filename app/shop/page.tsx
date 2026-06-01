"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";
import type { Id } from "@/convex/_generated/dataModel";

const CATEGORIES = ["All", "Baked Goods", "Pantry", "Jam Range", "Spice Range", "Chai"];

function fmt(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [adding, setAdding] = useState<string | null>(null);
  const { addItem } = useCart();

  const products = useQuery(api.products.list, {
    category: activeCategory === "All" ? undefined : activeCategory,
  });

  const handleAdd = (product: {
    _id: Id<"products">;
    name: string;
    price: number;
    image?: string;
  }) => {
    setAdding(product._id);
    addItem({ id: product._id, name: product.name, price: product.price, image: product.image });
    setTimeout(() => setAdding(null), 1200);
  };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Farm Kitchen</span>
          <h1>The Farm Shop</h1>
          <p>Baked goods, condiments, spices, jams, and chai. Made with real ingredients, no shortcuts.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="category-filter">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {products === undefined ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>Loading products…</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>No products found.</div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <div className="product-card" key={p._id}>
                  <Link href={`/product?id=${p._id}`} className="product-img" style={{ display: "block", textDecoration: "none" }}>
                    {p.image ? (
                      <Image src={p.image} alt={p.name} width={300} height={300} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-soft)" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--border)" }}>
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </Link>
                  <div className="product-body">
                    <p className="product-category">{p.category}</p>
                    <Link href={`/product?id=${p._id}`} className="product-name" style={{ textDecoration: "none" }}>{p.name}</Link>
                    <p className="product-desc">{p.description}</p>
                    <div className="product-footer">
                      <span className="product-price">{fmt(p.price)}</span>
                      <button
                        className={`add-to-cart-btn${adding === p._id ? " added" : ""}`}
                        onClick={() => handleAdd(p)}
                      >
                        {adding === p._id ? "Added ✓" : "+ Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
          <span>🚚 Free delivery on orders over R500</span>
          <span>·</span>
          <span>📦 R80 flat-rate delivery</span>
          <span>·</span>
          <span>🔒 Secure payment via Paystack</span>
        </div>
      </div>
    </main>
  );
}
