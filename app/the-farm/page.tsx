import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "The Farm | Hudson's Farm" };

const zones = [
  {
    num: "1", position: "Top · 1 hectare", title: "Hemp Cultivation",
    desc: "The upper hectare is dedicated to licensed industrial hemp cultivation. Grown without pesticides, irrigated from the upper dam, and harvested on a seasonal rotation.",
    tags: ["Industrial hemp", "No-till", "Rotational", "Licensed"],
  },
  {
    num: "2", position: "Centre · 2.5 hectares", title: "Food Garden & Microgreens",
    desc: "The central zone houses the food garden, mushroom tunnels, and microgreens nursery. The most active zone on the farm, harvested multiple times per week.",
    tags: ["Seasonal vegetables", "Herbs", "Microgreens", "Direct supply"],
  },
  {
    num: "3", position: "South · 3.3 hectares", title: "Hemp & Organic Production",
    desc: "The southern zone combines additional hemp rows with organic food production and borders the mature pecan orchard on the eastern edge.",
    tags: ["Hemp", "Organic food", "Pecan orchard", "Seasonal"],
  },
];

const infra = [
  "Main House", "Staff House", "2× Storage Buildings", "Sheep Pen",
  "2× Natural Dams", "Borehole & Pump", "Pecan Tree Border",
  "Grazing Area A", "Grazing Area B", "Mushroom Tunnels",
];

export default function TheFarmPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero" style={{ minHeight: "clamp(280px, 45vh, 460px)" }}>
        <Image src="/images/farm-zones-aerial.png" alt="Aerial view of Hudson's Farm" fill className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-eyebrow">The Land</span>
          <h1>12 Hectares of Living Soil</h1>
          <p className="hero-sub">Three cultivation zones, two natural dams, and a closed loop that returns everything the land gives back to itself.</p>
        </div>
      </section>

      {/* Cultivation Zones */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">Cultivation Zones</span>
          <h2>What grows where</h2>
          <p className="section-sub">Hudson&apos;s Farm is divided into three active growing zones, each with its own purpose, crops, and rotation schedule.</p>
          <div className="grid-3">
            {zones.map(({ num, position, title, desc, tags }) => (
              <div key={num} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.0625rem", flexShrink: 0 }}>{num}</div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Zone {num} · {position}</p>
                    <h3 style={{ fontSize: "1.0625rem", marginTop: "0.125rem" }}>{title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--muted)", lineHeight: 1.65 }}>{desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {tags.map((t) => (
                    <span key={t} style={{ padding: "0.2rem 0.625rem", background: "var(--surface-soft)", border: "1px solid var(--border)", borderRadius: "var(--r-full)", fontSize: "0.75rem", color: "var(--muted)" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <span className="eyebrow">The Property</span>
          <h2>Built for farming</h2>
          <p className="section-sub">Every structure on the property serves the farm. There&apos;s no wasted space, only purposeful land use.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            {infra.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.875rem 1rem", background: "var(--surface-soft)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)", flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="container">
          <div className="stats-bar">
            <div className="stat"><div className="stat-value">12 ha</div><div className="stat-label">Total farm area</div></div>
            <div className="stat"><div className="stat-value">3</div><div className="stat-label">Cultivation zones</div></div>
            <div className="stat"><div className="stat-value">2</div><div className="stat-label">Natural dams on site</div></div>
            <div className="stat"><div className="stat-value">100%</div><div className="stat-label">Chemical-free growing</div></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <h2>Come walk the farm</h2>
          <p>Guided tours take you through each cultivation zone: hemp fields, mushroom tunnels, microgreens nursery, and the dams.</p>
          <div className="cta-band-btns">
            <Link href="/experiences" className="btn btn-primary">Book a Farm Tour</Link>
            <Link href="/services" className="btn btn-secondary">What We Grow</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
