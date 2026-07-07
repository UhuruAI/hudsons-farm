"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  };

  const details = [
    { label: "Phone", href: "tel:0731615319", value: "073 161 5319", icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 9.69 19.79 19.79 0 011.61 1 2 2 0 013.6.5h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8a16 16 0 006.29 6.29l.95-.95a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15.5v1.42z" /> },
    { label: "Email", href: "mailto:mzanziprince@gmail.com", value: "mzanziprince@gmail.com", icon: <><rect x="2" y="4" width="20" height="16" rx="0" /><path d="M2 9.5l10 6.5 10-6.5" /></> },
    { label: "Location", href: null, value: "Maanhaarrand, North West Province", sub: "GPS -25.890432, 27.449568 · Exact directions shared on booking confirmation.", icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></> },
    { label: "Response time", href: null, value: "Peter typically responds within one business day by phone or email.", icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="hero compact">
        <Image src="/images/mpcfvd90-10-hero.png" alt="Contact Revayah Sanctuary" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Get in Touch</span>
            <h1>Book a visit or enquire</h1>
            <p className="hero-sub">Farm tours, fresh harvest pickups, mushroom harvests, microgreens subscriptions, farm stays, all arranged directly with Peter.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Left: info */}
            <div data-reveal>
              <h2 style={{ marginBottom: 24 }}>Contact us</h2>
              {details.map(({ label, href, value, sub, icon }) => (
                <div className="contact-detail" key={label}>
                  <div className="contact-detail-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                  </div>
                  <div className="contact-detail-text">
                    <strong>{label}</strong>
                    {href ? <a href={href}>{value}</a> : <p>{value}</p>}
                    {sub && <p style={{ fontSize: 13, marginTop: 2 }}>{sub}</p>}
                  </div>
                </div>
              ))}

              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginTop: 24, marginBottom: 12 }}>Booking types available</p>
              <div className="tag-row">
                {["Farm Tours", "Heritage Trail / Museum", "Fresh Produce Pickup", "Mushroom Harvest", "Agri-Tourism Stay", "Hemp Academy Enquiry"].map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>

              <div className="map-embed">
                <iframe
                  src="https://maps.google.com/maps?q=-25.890432,27.449568&z=15&t=k&output=embed"
                  width="600" height="300" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Revayah Sanctuary map"
                />
              </div>
            </div>

            {/* Right: form */}
            <div data-reveal>
              <div className="panel" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 24, marginBottom: 8 }}>Make a booking request</h2>
                <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 24 }}>Fill in the details below and Peter will confirm your booking within one business day.</p>

                {status === "sent" ? (
                  <div className="booking-success">✓ Your booking request has been sent. Peter will be in touch shortly.</div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group"><label>Name *</label><input type="text" name="customer_name" required placeholder="Your full name" /></div>
                      <div className="form-group"><label>Phone number</label><input type="tel" name="customer_phone" placeholder="e.g. 082 123 4567" /></div>
                      <div className="form-group full"><label>Email address</label><input type="email" name="customer_email" placeholder="you@example.com" /></div>
                      <div className="form-group full">
                        <label>Booking type</label>
                        <select name="service">
                          <option>Farm Tours &amp; Experiences</option>
                          <option>Fresh Harvest Pickup</option>
                          <option>Mushroom Harvest</option>
                          <option>Microgreens Subscription</option>
                          <option>Agri-Tourism &amp; Farm Stay</option>
                          <option>Organic Hemp Cultivation Enquiry</option>
                          <option>Pecan Orchard / Nuts</option>
                          <option>General Enquiry</option>
                        </select>
                      </div>
                      <div className="form-group full"><label>Preferred date &amp; time *</label><input type="datetime-local" name="scheduled_at" required /></div>
                      <div className="form-group full"><label>Additional notes</label><textarea name="notes" placeholder="Number of people, dietary requirements, or any questions…" /></div>
                    </div>
                    <button type="submit" className="btn btn-solid" style={{ width: "100%", marginTop: 20 }} disabled={status === "sending"}>
                      {status === "sending" ? "Sending…" : "Send booking request"}
                    </button>
                    <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>By submitting you agree to be contacted by Revayah Sanctuary. No spam, ever.</p>
                  </form>
                )}
              </div>

              <div className="panel alt">
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>What happens after you book</h3>
                {[
                  { n: "1", title: "Peter confirms your booking", desc: "Usually within one business day by phone or email. He'll confirm the date and any special requirements." },
                  { n: "2", title: "You receive directions", desc: "Exact directions and parking instructions are shared on confirmation. Maanhaarrand is about 90 minutes from Johannesburg." },
                  { n: "3", title: "Arrive and enjoy", desc: "Walk the farm, pick your produce, or settle in for your stay. Come hungry. The valley is beautiful." },
                ].map(({ n, title, desc }) => (
                  <div className="step-row" key={n}>
                    <div className="step-num">{n}</div>
                    <div>
                      <strong>{title}</strong>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
