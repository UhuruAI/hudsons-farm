"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const experiences = [
  { tag: "Individual", img: "/images/mpcfvd99-11-about.png", duration: "1.5 hours", title: "Guided Farm Tour", desc: "Walk all three cultivation zones with Peter: hemp fields, mushroom tunnels, microgreens nursery, dams, and orchard. Individual and small group sessions." },
  { tag: "Groups", img: "/images/mpcfvd90-10-hero.png", duration: "2 hours", title: "Group Farm Tour", desc: "Ideal for schools, corporate teams, and community groups. An extended guided walk with Q&A and a fresh produce tasting at the end." },
  { tag: "Workshop", img: "/images/mushroom-workshop.png", duration: "1.5 hours", title: "Mushroom Harvest Experience", desc: "Inside the growing tunnels, you'll learn how gourmet mushrooms are cultivated, identify varieties by sight, and harvest your own batch to take home." },
  { tag: "Producer Tour", img: "/images/mpcfvda5-15-microgreens.png", duration: "45 minutes", title: "Microgreens Nursery Walk", desc: "A focused walk through the microgreens growing beds. Learn varieties, nutrition, and how to grow your own. Take home a fresh tray." },
  { tag: "Direct Purchase", img: "/images/mpcfvda0-14-dam.png", duration: "30 min", title: "Fresh Harvest Pickup", desc: "Arrange a direct pickup of seasonal vegetables, microgreens, or mushrooms straight from the farm. Schedule in advance. What's available changes weekly." },
  { tag: "Farm Stay", img: "/images/harvest-table.png", duration: "Overnight", title: "Agri-Tourism Farm Stay", desc: "Wake up to the Magaliesberg valley. Stay on the farm, walk the grounds at sunrise, and leave with a fresh harvest box. Enquire for availability and rates." },
];

const events = [
  { title: "Mushroom Workshop", freq: "Monthly · Small groups", desc: "Learn to identify, harvest, and store gourmet mushrooms. Limited to 8 participants. Includes a take-home harvest." },
  { title: "Fresh Harvest Box Days", freq: "Weekly · Individual & subscription", desc: "Collect a seasonal box of whatever's fresh that week: vegetables, herbs, microgreens, and more." },
  { title: "Microgreens Subscription Pickup", freq: "Weekly · Subscription", desc: "Recurring weekly subscription for chefs, households, and health-conscious buyers. Consistent, seasonal, and freshly cut." },
  { title: "Farm Tour + Harvest Lunch", freq: "On request · Groups of 4+", desc: "A guided tour of the full property followed by a shared harvest lunch prepared with farm ingredients." },
];

export default function ExperiencesPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero compact">
        <Image src="/images/mpcfvd90-10-hero.png" alt="Hudson's Farm experiences" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Agri-Tourism</span>
            <h1>Come to the Farm</h1>
            <p className="hero-sub">Whether you&apos;re joining a guided tour, picking up a fresh harvest box, or staying overnight in the valley, every visit is arranged directly with Peter.</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Farm Experiences</span>
            <h2>How to visit</h2>
            <p className="section-sub">Book directly with Peter. No agencies, no packages. Just real access to a real working farm.</p>
          </div>
          <div className="grid-cards cols-3">
            {experiences.map(({ tag, img, duration, title, desc }) => (
              <article className="exp-card" data-reveal key={title}>
                <div className="ed-media"><Image src={img} alt={title} fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} /></div>
                <div className="exp-body">
                  <span className="ed-tag" style={{ marginTop: 0 }}>{tag} · {duration}</span>
                  <h3 style={{ marginTop: 8 }}>{title}</h3>
                  <p>{desc}</p>
                  <a href="#book" className="link-cta">Book now <Arrow /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEASONAL EVENTS */}
      <section className="section alt">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Seasonal Events</span>
            <h2>Events &amp; workshops</h2>
            <p className="section-sub">Recurring farm events open to individuals, families, and small groups throughout the year.</p>
          </div>
          <div className="grid-cards cols-2">
            {events.map(({ title, freq, desc }) => (
              <div className="box-card" data-reveal key={title}>
                <div>
                  <h3>{title}</h3>
                  <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 8 }}>{freq}</p>
                </div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section className="section" id="book">
        <div className="container">
          <div className="contact-layout">
            <div data-reveal>
              <span className="eyebrow">Make a Booking</span>
              <h2 style={{ marginTop: 14 }}>Book your experience</h2>
              <p style={{ color: "var(--muted)", margin: "16px 0 28px" }}>Peter Hudson manages all bookings personally. You&apos;ll receive a confirmation call or email within one business day.</p>
              {[
                { label: "Call Peter directly", value: "073 161 5319", href: "tel:0731615319" },
                { label: "Email", value: "mzanziprince@gmail.com", href: "mailto:mzanziprince@gmail.com" },
                { label: "Hours", value: "Mon–Sat, 7:00am – 5:00pm", href: null },
              ].map(({ label, value, href }) => (
                <div className="contact-detail" key={label}>
                  <div className="contact-detail-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 9.69 19.79 19.79 0 011.61 1 2 2 0 013.6.5h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8a16 16 0 006.29 6.29l.95-.95a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15.5v1.42z" /></svg>
                  </div>
                  <div className="contact-detail-text">
                    <strong>{label}</strong>
                    {href ? <a href={href}>{value}</a> : <p>{value}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="panel" data-reveal>
              {status === "sent" ? (
                <div className="booking-success">✓ Booking request sent! Peter will be in touch within one business day.</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ marginBottom: 20 }}>Booking request</h3>
                  <div className="form-grid">
                    <div className="form-group"><label>Name *</label><input type="text" required placeholder="Your full name" /></div>
                    <div className="form-group"><label>Phone</label><input type="tel" placeholder="e.g. 082 123 4567" /></div>
                    <div className="form-group full"><label>Email *</label><input type="email" required placeholder="you@example.com" /></div>
                    <div className="form-group full">
                      <label>Experience</label>
                      <select>
                        <option>Guided Farm Tour (Individual)</option>
                        <option>Group Farm Tour</option>
                        <option>Mushroom Harvest Experience</option>
                        <option>Microgreens Nursery Walk</option>
                        <option>Fresh Produce Pickup</option>
                        <option>Microgreens Subscription</option>
                        <option>Agri-Tourism Farm Stay</option>
                        <option>Farm Tour + Harvest Lunch</option>
                      </select>
                    </div>
                    <div className="form-group full"><label>Notes</label><textarea placeholder="Number of people, dates, or any questions…" /></div>
                  </div>
                  <button type="submit" className="btn btn-solid" style={{ width: "100%", marginTop: 20 }} disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send Booking Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <Image src="/images/harvest-table.png" alt="Harvest table" fill sizes="100vw" className="hero-bg" />
        <div className="cta-overlay" />
        <div className="cta-inner">
          <div className="cta-box" data-reveal>
            <h2>Not sure what to book?</h2>
            <p>Call Peter directly on 073 161 5319. He&apos;ll help you find the right experience.</p>
            <div className="hero-ctas">
              <a href="tel:0731615319" className="btn btn-on-dark" style={{ background: "#fff", color: "var(--dark)" }}>Call Peter</a>
              <Link href="/the-farm" className="btn btn-on-dark muted">See the Farm Layout</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
