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
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Farm Kitchen</span>
          <h1>Your Cart</h1>
          {items.length > 0 && <p>{count} item{count !== 1 ? "s" : ""}</p>}
        </div>
      </div>

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Browse the farm shop and add something good.</p>
              <Link href="/shop" className="btn btn-solid">Continue shopping</Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Items */}
              <div>
                <table className="cart-table">
                  <thead>
                    <tr><th>Product</th><th>Quantity</th><th>Total</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="cart-product-cell">
                          <div className="cart-product-info">
                            <Link href={`/product?id=${item.id}`} className="cart-product-image-link">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img className="cart-item-img" src={item.image} alt={item.name} />
                              ) : (
                                <div className="cart-item-img" style={{ background: "var(--bg-alt)" }} />
                              )}
                            </Link>
                            <div className="cart-product-copy">
                              <Link href={`/product?id=${item.id}`} className="cart-item-name" style={{ color: "var(--ink)" }}>{item.name}</Link>
                              <div className="cart-item-cat">{fmt(item.price)} each</div>
                            </div>
                          </div>
                        </td>
                        <td className="cart-quantity-cell">
                          <div className="cart-item-controls">
                            <div className="qty-control" style={{ height: 36 }}>
                              <button className="qty-btn" style={{ height: 34, width: 32, fontSize: 16 }} onClick={() => updateQty(item.id, item.quantity - 1)} aria-label="Decrease">−</button>
                              <span className="qty-display" style={{ height: 34, lineHeight: "34px", width: 38 }}>{item.quantity}</span>
                              <button className="qty-btn" style={{ height: 34, width: 32, fontSize: 16 }} onClick={() => updateQty(item.id, item.quantity + 1)} aria-label="Increase">+</button>
                            </div>
                            <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                          </div>
                        </td>
                        <td className="cart-total-cell"><strong>{fmt(item.price * item.quantity)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="cart-remove-btn" style={{ marginTop: 16, paddingLeft: 0 }} onClick={clearCart}>Clear cart</button>
              </div>

              {/* Summary */}
              <div className="order-summary">
                <h3>Order summary</h3>
                <div className="summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className={`summary-row${deliveryFee === 0 ? " free" : ""}`}><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : fmt(deliveryFee)}</span></div>
                {subtotal > 0 && subtotal < FREE_THRESHOLD && (
                  <p className="summary-note" style={{ background: "var(--bg)", border: "1px solid var(--border-soft)", padding: "8px 12px", margin: "8px 0" }}>
                    Add {fmt(FREE_THRESHOLD - subtotal)} more for free delivery
                  </p>
                )}
                <div className="summary-row total"><span>Total</span><span>{fmt(total)}</span></div>
                <Link href="/checkout" className="btn btn-solid" style={{ width: "100%", marginTop: 20 }}>Proceed to checkout</Link>
                <Link href="/shop" style={{ display: "block", textAlign: "center", marginTop: 14, color: "var(--muted)", fontSize: 14 }}>Continue shopping</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
