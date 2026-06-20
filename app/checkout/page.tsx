"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/context/CartContext";
import type { Id } from "@/convex/_generated/dataModel";

declare global {
  interface Window {
    PaystackPop: {
      setup(options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }): { openIframe(): void };
    };
  }
}

function fmt(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

const PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

type DeliveryForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { items, clearCart } = useCart();
  const settings = useQuery(api.settings.get);
  const DELIVERY_FEE = settings?.deliveryFee ?? 8000;
  const FREE_THRESHOLD = settings?.freeThreshold ?? 50000;
  const viewer = useQuery(api.users.getViewer);

  const createOrder = useMutation(api.orders.create);
  const confirmPayment = useMutation(api.orders.confirmPayment);
  const cancelOrder = useMutation(api.orders.cancel);

  const orderIdRef = useRef<Id<"orders"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const [form, setForm] = useState<DeliveryForm>({
    fullName: "", phone: "", email: "",
    address: "", suburb: "", city: "",
    province: "Gauteng", postalCode: "",
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  if (isLoading) {
    return <main><div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Loading…</div></main>;
  }

  if (!isAuthenticated) {
    return (
      <main>
        <div className="page-hero"><div className="container"><h1>Checkout</h1></div></div>
        <section className="section">
          <div className="container" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
            <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Please sign in to complete your purchase.</p>
            <Link href="/auth" className="btn btn-primary">Sign in / Create account</Link>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main>
        <div className="page-hero"><div className="container"><h1>Checkout</h1></div></div>
        <section className="section">
          <div className="container" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Your cart is empty.</p>
            <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
          </div>
        </section>
      </main>
    );
  }

  const set = (field: keyof DeliveryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptReady || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const orderId = await createOrder({
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        subtotal,
        deliveryFee,
        total,
        email: form.email,
        delivery: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          suburb: form.suburb,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
      });

      orderIdRef.current = orderId;
      const paystackRef = `HF-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
        email: form.email,
        amount: total,
        currency: "ZAR",
        ref: paystackRef,
        callback: (response) => {
          void (async () => {
            try {
              await confirmPayment({ id: orderId, paystackRef: response.reference });
              clearCart();
              router.push(`/order-success?ref=${response.reference}&id=${orderId}`);
            } catch (err) {
              console.error("Failed to confirm payment:", err);
              alert(`Payment received but confirmation failed. Please contact us with reference: ${response.reference}`);
              setIsSubmitting(false);
            }
          })();
        },
        onClose: () => {
          void (async () => {
            const oid = orderIdRef.current;
            if (oid) {
              try { await cancelOrder({ id: oid }); } catch {}
              orderIdRef.current = null;
            }
            setIsSubmitting(false);
          })();
        },
      }).openIframe();
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Failed to start checkout. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />

      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Farm Kitchen</span>
          <h1>Checkout</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <form onSubmit={handleSubmit} className="checkout-layout">
            {/* Delivery details */}
            <div className="checkout-section">
              <h3>Delivery details</h3>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full name *</label>
                  <input type="text" required placeholder="Your full name" value={form.fullName} onChange={set("fullName")} />
                </div>
                <div className="form-group">
                  <label>Phone number *</label>
                  <input type="tel" required placeholder="e.g. 082 123 4567" value={form.phone} onChange={set("phone")} />
                </div>
                <div className="form-group">
                  <label>Email address *</label>
                  <input type="email" required placeholder="you@example.com" value={form.email || viewer?.email || ""} onChange={set("email")} />
                </div>
                <div className="form-group full">
                  <label>Street address *</label>
                  <input type="text" required placeholder="e.g. 12 Oak Street" value={form.address} onChange={set("address")} />
                </div>
                <div className="form-group">
                  <label>Suburb *</label>
                  <input type="text" required placeholder="e.g. Sandton" value={form.suburb} onChange={set("suburb")} />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" required placeholder="e.g. Johannesburg" value={form.city} onChange={set("city")} />
                </div>
                <div className="form-group">
                  <label>Province *</label>
                  <select required value={form.province} onChange={set("province")}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Postal code *</label>
                  <input type="text" required placeholder="e.g. 2196" value={form.postalCode} onChange={set("postalCode")} />
                </div>
              </div>
            </div>

            {/* Order summary + pay */}
            <div>
              <div className="order-summary">
                <h3>Order summary</h3>

                {items.map((item) => (
                  <div key={item.id} className="summary-row">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12 }}>
                  <div className="summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                  <div className={`summary-row${deliveryFee === 0 ? " free" : ""}`}>
                    <span>Delivery</span><span>{deliveryFee === 0 ? "Free" : fmt(deliveryFee)}</span>
                  </div>
                  <div className="summary-row total"><span>Total</span><span>{fmt(total)}</span></div>
                </div>

                <button type="submit" className="btn btn-solid" style={{ width: "100%", marginTop: 20 }} disabled={isSubmitting || !scriptReady}>
                  {isSubmitting ? "Processing…" : `Pay ${fmt(total)} via Paystack`}
                </button>

                <p className="summary-note">Secure payment via Paystack</p>

                <Link href="/cart" style={{ display: "block", textAlign: "center", marginTop: 8, color: "var(--muted)", fontSize: 14 }}>← Back to cart</Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
