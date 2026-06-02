"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

function fmt(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

const PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const TIMELINE_STEPS = ["pending", "confirmed", "shipped", "delivered"] as const;

function getStepState(step: string, orderStatus: string): "completed" | "current" | "inactive" {
  if (orderStatus === "cancelled") return "inactive";
  const statusIdx = TIMELINE_STEPS.indexOf(orderStatus as typeof TIMELINE_STEPS[number]);
  const stepIdx = TIMELINE_STEPS.indexOf(step as typeof TIMELINE_STEPS[number]);
  if (statusIdx === -1) return "inactive";
  if (stepIdx < statusIdx) return "completed";
  if (stepIdx === statusIdx) return "current";
  return "inactive";
}

const STEP_LABELS: Record<string, string> = {
  pending: "Placed", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered",
};

type DashTab = "orders" | "profile" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isAdmin = useQuery(api.users.isAdmin);
  const orders = useQuery(api.orders.listMine);
  const profile = useQuery(api.users.getProfile);
  const viewer = useQuery(api.users.getViewer);
  const updateProfile = useMutation(api.users.updateProfile);

  const [tab, setTab] = useState<DashTab>("orders");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const [profileForm, setProfileForm] = useState({
    name: "", phone: "", street: "", suburb: "", city: "", province: "Gauteng", postalCode: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [settingsForm, setSettingsForm] = useState({ displayName: "", notifications: false });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        street: profile.address?.street ?? "",
        suburb: profile.address?.suburb ?? "",
        city: profile.address?.city ?? "",
        province: profile.address?.province ?? "Gauteng",
        postalCode: profile.address?.postalCode ?? "",
      });
      setSettingsForm({
        displayName: profile.name ?? "",
        notifications: profile.notifications ?? false,
      });
    }
  }, [profile]);

  if (isLoading) {
    return <main><div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Loading…</div></main>;
  }
  if (!isAuthenticated) return null;

  const toggleOrder = (id: string) =>
    setExpandedOrders((prev) => { const s = new Set(prev); if (s.has(id)) { s.delete(id); } else { s.add(id); } return s; });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile({
        name: profileForm.name || undefined,
        phone: profileForm.phone || undefined,
        address: {
          street: profileForm.street || undefined,
          suburb: profileForm.suburb || undefined,
          city: profileForm.city || undefined,
          province: profileForm.province || undefined,
          postalCode: profileForm.postalCode || undefined,
        },
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally { setProfileSaving(false); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await updateProfile({
        name: settingsForm.displayName || undefined,
        notifications: settingsForm.notifications,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } finally { setSettingsSaving(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const viewerEmail = (viewer as { email?: string } | null)?.email ?? "";
  const displayName = profile?.name ?? viewerEmail;

  return (
    <main>
      <div className="page-hero">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="eyebrow">My Account</span>
            <h1>Welcome, {displayName.split("@")[0] || "back"}</h1>
            {isAdmin && (
              <p style={{ marginTop: "0.5rem" }}>
                <Link href="/admin" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9375rem" }}>Go to Admin Panel →</Link>
              </p>
            )}
          </div>
          <button onClick={handleSignOut} className="btn btn-secondary" style={{ minHeight: "auto", padding: "0.5rem 1.25rem" }}>
            Sign out
          </button>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
            {(["orders", "profile", "settings"] as DashTab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "0.75rem 1.375rem", background: "none", border: "none", cursor: "pointer",
                fontSize: "0.9375rem", fontWeight: 600,
                color: tab === t ? "var(--accent)" : "var(--muted)",
                borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: "-1px", transition: "color 0.15s, border-color 0.15s",
              }}>
                {t === "orders" ? "My Orders" : t === "profile" ? "My Profile" : "Settings"}
              </button>
            ))}
          </div>

          {/* ── MY ORDERS ──────────────────────────────────────────────── */}
          {tab === "orders" && (
            <div style={{ maxWidth: 680 }}>
              {orders === undefined ? (
                <p style={{ color: "var(--muted)" }}>Loading orders…</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <p style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>No orders yet</p>
                  <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Browse the shop and place your first order.</p>
                  <Link href="/shop" className="btn btn-primary" style={{ minHeight: "auto", padding: "0.625rem 1.5rem" }}>Shop now</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {orders.map((order) => (
                    <div key={order._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.25rem 1.5rem" }}>
                      {/* Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.875rem" }}>
                        <div>
                          <p style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.9375rem" }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "0.125rem" }}>
                            {new Date(order._creationTime).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "1.0625rem" }}>{fmt(order.total)}</span>
                          <button onClick={() => toggleOrder(order._id)} className="action-btn">
                            {expandedOrders.has(order._id) ? "Hide ↑" : "Details ↓"}
                          </button>
                        </div>
                      </div>

                      {/* Timeline or cancelled badge */}
                      {order.status === "cancelled" ? (
                        <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "var(--r-full)", fontSize: "0.8125rem", fontWeight: 700, background: "#fee2e2", color: "#991b1b", marginBottom: "0.25rem" }}>
                          Cancelled
                        </span>
                      ) : (
                        <div className="order-timeline">
                          {TIMELINE_STEPS.map((step) => {
                            const state = getStepState(step, order.status);
                            return (
                              <div key={step} className={`timeline-step${state === "completed" ? " completed" : state === "current" ? " current" : ""}`}>
                                <div className="timeline-dot" />
                                <span className="timeline-label">{STEP_LABELS[step]}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Expandable details */}
                      {expandedOrders.has(order._id) && (
                        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "grid", gap: "1rem" }}>
                          <div>
                            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.5rem" }}>Items</p>
                            {order.items.map((item) => (
                              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", padding: "0.3rem 0", borderBottom: "1px solid var(--border)" }}>
                                <span style={{ color: "var(--muted)" }}>{item.name} × {item.quantity}</span>
                                <span style={{ fontWeight: 600 }}>{fmt(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginTop: "0.5rem", color: "var(--muted)" }}>
                              <span>Delivery</span>
                              <span>{order.deliveryFee === 0 ? "Free" : fmt(order.deliveryFee)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.9375rem", marginTop: "0.375rem" }}>
                              <span>Total</span>
                              <span>{fmt(order.total)}</span>
                            </div>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.375rem" }}>Delivery address</p>
                            <address style={{ fontStyle: "normal", fontSize: "0.875rem", lineHeight: 1.7 }}>
                              {order.delivery.fullName}<br />
                              {order.delivery.address}, {order.delivery.suburb}<br />
                              {order.delivery.city}, {order.delivery.province} {order.delivery.postalCode}
                            </address>
                          </div>
                          {order.paystackRef && (
                            <div>
                              <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.25rem" }}>Payment reference</p>
                              <p style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{order.paystackRef}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MY PROFILE ─────────────────────────────────────────────── */}
          {tab === "profile" && (
            <form onSubmit={handleSaveProfile} style={{ maxWidth: 560 }}>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "1.25rem" }}>Personal details</p>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full name</label>
                    <input type="text" placeholder="Your name" value={profileForm.name}
                      onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Email address</label>
                    <input type="email" value={viewerEmail} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                  </div>
                  <div className="form-group full">
                    <label>Phone number</label>
                    <input type="tel" placeholder="e.g. 082 123 4567" value={profileForm.phone}
                      onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <p style={{ fontWeight: 600, marginBottom: "1.25rem" }}>Default delivery address</p>
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Street address</label>
                    <input type="text" placeholder="e.g. 12 Oak Street" value={profileForm.street}
                      onChange={(e) => setProfileForm((f) => ({ ...f, street: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Suburb</label>
                    <input type="text" placeholder="e.g. Sandton" value={profileForm.suburb}
                      onChange={(e) => setProfileForm((f) => ({ ...f, suburb: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" placeholder="e.g. Johannesburg" value={profileForm.city}
                      onChange={(e) => setProfileForm((f) => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Province</label>
                    <select value={profileForm.province} onChange={(e) => setProfileForm((f) => ({ ...f, province: e.target.value }))}>
                      {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Postal code</label>
                    <input type="text" placeholder="e.g. 2196" value={profileForm.postalCode}
                      onChange={(e) => setProfileForm((f) => ({ ...f, postalCode: e.target.value }))} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                {profileSaved ? "Saved ✓" : profileSaving ? "Saving…" : "Save profile"}
              </button>
            </form>
          )}

          {/* ── SETTINGS ───────────────────────────────────────────────── */}
          {tab === "settings" && (
            <div style={{ maxWidth: 480 }}>
              <form onSubmit={handleSaveSettings}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontWeight: 600, marginBottom: "1.25rem" }}>Account preferences</p>
                  <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                    <label>Display name</label>
                    <input type="text" placeholder="How you'd like to be addressed" value={settingsForm.displayName}
                      onChange={(e) => setSettingsForm((f) => ({ ...f, displayName: e.target.value }))} />
                  </div>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={settingsForm.notifications}
                      onChange={(e) => setSettingsForm((f) => ({ ...f, notifications: e.target.checked }))}
                      style={{ width: "auto", marginTop: "0.125rem" }} />
                    <span>
                      <span style={{ fontWeight: 500, display: "block", marginBottom: "0.125rem" }}>Order notifications</span>
                      <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>Receive updates when your order status changes</span>
                    </span>
                  </label>
                </div>
                <button type="submit" className="btn btn-primary" disabled={settingsSaving} style={{ marginBottom: "2rem" }}>
                  {settingsSaved ? "Saved ✓" : settingsSaving ? "Saving…" : "Save settings"}
                </button>
              </form>

              <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0 0 1.5rem" }} />

              <div>
                <p style={{ fontWeight: 600, marginBottom: "0.375rem" }}>Sign out</p>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1rem" }}>You&apos;ll be signed out on this device.</p>
                <button onClick={handleSignOut} className="btn btn-secondary" style={{ minHeight: "auto", padding: "0.5rem 1.25rem" }}>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
