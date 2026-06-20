import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "The Farm | Hudson's Farm" };

const Check = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const zones = [
  { num: "1", position: "Top · 1 hectare", title: "Hemp Cultivation", desc: "The upper hectare is dedicated to licensed industrial hemp cultivation. Grown without pesticides, irrigated from the upper dam, and harvested on a seasonal rotation.", tags: ["Industrial hemp", "No-till", "Rotational", "Licensed"] },
  { num: "2", position: "Centre · 2.5 hectares", title: "Food Garden & Microgreens", desc: "The central zone houses the food garden, mushroom tunnels, and microgreens nursery. The most active zone on the farm, harvested multiple times per week.", tags: ["Seasonal vegetables", "Herbs", "Microgreens", "Direct supply"] },
  { num: "3", position: "South · 3.3 hectares", title: "Hemp & Organic Production", desc: "The southern zone combines additional hemp rows with organic food production and borders the mature pecan orchard on the eastern edge.", tags: ["Hemp", "Organic food", "Pecan orchard", "Seasonal"] },
];

const infra = ["Main House", "Staff House", "2× Storage Buildings", "Sheep Pen", "2× Natural Dams", "Borehole & Pump", "Pecan Tree Border", "Grazing Area A", "Grazing Area B", "Mushroom Tunnels"];

export default function TheFarmPage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero compact">
        <Image src="/images/farm-zones-aerial.png" alt="Aerial view of Hudson's Farm" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">The Land</span>
            <h1>12 Hectares of Living Soil</h1>
            <p className="hero-sub">Three cultivation zones, two natural dams, and a closed loop that returns everything the land gives back to itself.</p>
          </div>
        </div>
      </section>

      {/* CULTIVATION ZONES */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Cultivation Zones</span>
            <h2>What grows where</h2>
            <p className="section-sub">Hudson&apos;s Farm is divided into three active growing zones, each with its own purpose, crops, and rotation schedule.</p>
          </div>
          <div className="grid-cards cols-3">
            {zones.map(({ num, position, title, desc, tags }) => (
              <div className="box-card alt" data-reveal key={num}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontSize: 18, flexShrink: 0 }}>{num}</div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)" }}>Zone {num} · {position}</p>
                    <h3 style={{ fontSize: 20, marginTop: 2 }}>{title}</h3>
                  </div>
                </div>
                <p>{desc}</p>
                <div className="tag-row">
                  {tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROPERTY */}
      <section className="section alt">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">The Property</span>
            <h2>Built for farming</h2>
            <p className="section-sub">Every structure on the property serves the farm. There&apos;s no wasted space, only purposeful land use.</p>
          </div>
          <div data-reveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: "clamp(32px,4vw,48px)" }}>
            {infra.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 18px", background: "var(--bg)", border: "1px solid var(--border)" }}>
                <span style={{ color: "var(--accent)", display: "flex", flexShrink: 0 }}><Check /></span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-strip">
        <div className="stats-strip-inner">
          <div className="stat-block"><div className="stat-value">12 ha</div><div className="stat-label">Total farm area</div></div>
          <div className="stat-block"><div className="stat-value">3</div><div className="stat-label">Cultivation zones</div></div>
          <div className="stat-block"><div className="stat-value">2</div><div className="stat-label">Natural dams on site</div></div>
          <div className="stat-block"><div className="stat-value">100%</div><div className="stat-label">Chemical-free growing</div></div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <Image src="/images/harvest-table.png" alt="Harvest table" fill sizes="100vw" className="hero-bg" />
        <div className="cta-overlay" />
        <div className="cta-inner">
          <div className="cta-box" data-reveal>
            <h2>Come walk the farm</h2>
            <p>Guided tours take you through each cultivation zone: hemp fields, mushroom tunnels, microgreens nursery, and the dams.</p>
            <div className="hero-ctas">
              <Link href="/experiences" className="btn btn-on-dark" style={{ background: "#fff", color: "var(--dark)" }}>Book a Farm Tour</Link>
              <Link href="/services" className="btn btn-on-dark muted">What We Grow</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
