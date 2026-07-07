import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "The Sanctuary | Revayah Sanctuary" };

const Check = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const zones = [
  { num: "1", position: "Heritage Precinct", title: "Heritage Interpretation", desc: "The interpretation centre, walking trails, oral history archive, and open-air stone amphitheatre honouring Chief Mogale and the history of the Sekhukhune Wars.", tags: ["Interpretation centre", "Trails", "Amphitheatre", "Oral archive"] },
  { num: "2", position: "2–3 hectares", title: "Integrated Farming System", desc: "A closed-loop farm of vegetable beds, fruit orchards, and livestock kept at the furthest boundary, with biogas and compost returning everything to the soil.", tags: ["Vegetables & fruit", "Livestock", "Biogas", "Closed loop"] },
  { num: "3", position: "Training Fields", title: "Hemp Training Academy", desc: "Certified training in legal industrial hemp (under 0.2% THC) cultivation and processing — DALRRD permitted and aligned with the Cannabis Master Plan.", tags: ["Industrial hemp", "DALRRD permit", "Training", "<0.2% THC"] },
  { num: "4", position: "15 units", title: "Eco-Resort", desc: "Fifteen eco-lodge units, a 200-seat event venue, and a 180-seat restaurant, arranged around the dams and built to sit lightly on the land.", tags: ["15 eco-units", "200-seat venue", "180-seat restaurant"] },
  { num: "5", position: "Arrival & Retail", title: "The Revival Hub", desc: "Reception, retail shop, multimedia museum, and activity booking centre — the flowing space that greets every guest and tells the story of the sanctuary.", tags: ["Reception", "Retail shop", "Museum", "Bookings"] },
];

const infra = ["Interpretation Centre", "Open-Air Amphitheatre", "The Revival Hub", "Event Venue", "Restaurant", "2× Natural Dams", "Borehole & Pump", "Pecan Tree Border", "Mushroom Tunnels", "Grazing Areas"];

export default function TheFarmPage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero compact">
        <Image src="/images/revayah-aerial.jpg" alt="Aerial concept view of Revayah Sanctuary" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">The Sanctuary</span>
            <h1>12 Hectares, Five Pillars</h1>
            <p className="hero-sub">Heritage, farming, education, hospitality, and craft — one regenerative landscape at the foot of the Magaliesberg.</p>
          </div>
        </div>
      </section>

      {/* MASTERPLAN ZONES */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">The Master Plan</span>
            <h2>What lives where</h2>
            <p className="section-sub">Revayah Sanctuary is organised into five interdependent zones, each feeding the others — produce to the kitchen, guests to the trails, stories to everyone.</p>
          </div>
          <div className="grid-cards cols-3">
            {zones.map(({ num, position, title, desc, tags }) => (
              <div className="box-card alt" data-reveal key={num}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontSize: 18, flexShrink: 0 }}>{num}</div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)" }}>Pillar {num} · {position}</p>
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
            <h2>Built with purpose</h2>
            <p className="section-sub">Every structure on the property serves the sanctuary. There&apos;s no wasted space, only purposeful land use.</p>
          </div>
          <div data-reveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: "clamp(32px,4vw,48px)" }}>
            {infra.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 18px", background: "var(--bg-alt)", border: "1px solid var(--border)" }}>
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
          <div className="stat-block"><div className="stat-value">12 ha</div><div className="stat-label">Regenerative land</div></div>
          <div className="stat-block"><div className="stat-value">5</div><div className="stat-label">Integrated pillars</div></div>
          <div className="stat-block"><div className="stat-value">15</div><div className="stat-label">Eco-lodge units planned</div></div>
          <div className="stat-block"><div className="stat-value">2</div><div className="stat-label">Natural dams on site</div></div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <Image src="/images/harvest-table.png" alt="Harvest table" fill sizes="100vw" className="hero-bg" />
        <div className="cta-overlay" />
        <div className="cta-inner">
          <div className="cta-box" data-reveal>
            <h2>Come walk the sanctuary</h2>
            <p>Guided tours take you through the farm, the hemp fields, the heritage trail, and the dams.</p>
            <div className="hero-ctas">
              <Link href="/experiences" className="btn btn-on-dark" style={{ background: "#fff", color: "var(--dark)" }}>Book a Tour</Link>
              <Link href="/heritage" className="btn btn-on-dark muted">Explore Our Heritage</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
