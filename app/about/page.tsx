import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About | Hudson's Farm" };

export default function AboutPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="hero" style={{ minHeight: "clamp(280px, 45vh, 460px)" }}>
        <Image src="/images/mpcfvd99-11-about.png" alt="About Hudson's Farm" fill className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-eyebrow">Our Story</span>
          <h1>Organic. Regenerative. Rooted in Africa.</h1>
          <p className="hero-sub">Hudson&apos;s Farm is a working organic farm in the Magaliesberg valley, one of the oldest mountain ranges in the world.</p>
        </div>
      </section>

      {/* The Farm */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split-img">
              <Image src="/images/mpcfvd90-10-hero.png" alt="The farm fields" width={600} height={450} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="split-text">
              <span className="eyebrow">The Farm</span>
              <h2>6.8 hectares of purpose</h2>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.75 }}>Located in the Magaliesberg valley, between the Gauteng and North West borders, Hudson&apos;s Farm sits on 6.8 hectares of active, certified organic farmland.</p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.75 }}>We grow organic hemp, gourmet mushrooms, microgreens, and seasonal vegetables. A mature pecan orchard lines the eastern edge of the property, and two natural dams supply irrigation across all three cultivation zones.</p>
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.75 }}>Everything on this farm is built around one principle: stewardship of the soil. We farm as if the land will outlive us. Because it will.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div className="split reverse">
            <div className="split-img">
              <Image src="/images/mpcfvda0-14-dam.png" alt="Natural dam" width={600} height={450} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="split-text">
              <span className="eyebrow">Our Philosophy</span>
              <h2>Regenerative, not just organic</h2>
              <p style={{ color: "var(--muted)", fontSize: "1.0625rem" }}>Certified organic means no synthetic inputs. Regenerative means going further, actively building soil health, biodiversity, and water retention with every decision we make.</p>
              <p style={{ color: "var(--muted)", fontSize: "1.0625rem" }}>We don&apos;t till unnecessarily. We compost everything. We let the dams do the work. We rotate. We observe. We adapt.</p>
              <blockquote style={{ borderLeft: "3px solid var(--accent)", paddingLeft: "1.25rem", margin: "1rem 0 0" }}>
                <p style={{ fontStyle: "italic", fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--fg)" }}>&ldquo;Regenerative farming is farming as if the next generation matters. Because they do.&rdquo;</p>
                <cite style={{ display: "block", marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)", fontStyle: "normal" }}>Peter Hudson, Owner, Hudson&apos;s Farm</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Three Commitments */}
      <section className="section">
        <div className="container text-center">
          <span className="eyebrow">How We Farm</span>
          <h2>Three commitments we keep</h2>
          <p className="section-sub">These aren&apos;t marketing claims. They&apos;re the operating principles that govern every decision on the farm.</p>
          <div className="value-grid">
            <div className="value-item">
              <div className="value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>No synthetic inputs</h3>
              <p>No herbicides, no pesticides, no synthetic fertilisers. Ever. We use compost, cover crops, and beneficial insects instead.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3>Water stewardship</h3>
              <p>Two natural dams supply irrigation. Borehole water supplements dry periods. We track usage and minimise waste every season.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3>Radical transparency</h3>
              <p>Come and see the farm. Walk every zone. Ask every question. We have nothing to hide and everything to show.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Peter */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <span className="eyebrow">The Person Behind the Farm</span>
          <h2>Meet Peter Hudson</h2>
          <p className="section-sub">Hudson&apos;s Farm is a hands-on, owner-operated farm. There&apos;s no management team. No corporate structure. Just Peter and the land.</p>
          <div style={{ maxWidth: 560, background: "var(--surface-soft)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "1.75rem 2rem", marginTop: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.375rem", fontWeight: 700, flexShrink: 0 }}>PH</div>
              <div>
                <strong style={{ display: "block", fontSize: "1.0625rem" }}>Peter Hudson</strong>
                <span style={{ display: "inline-block", marginTop: "0.25rem", padding: "0.2rem 0.625rem", background: "rgba(45,90,39,0.1)", borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)" }}>Owner &amp; Farmer, Hudson&apos;s Farm</span>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>Peter started the farm with one idea: grow real food on living soil, in a place worth farming well. That idea became 6.8 hectares of certified organic land in the Magaliesberg.</p>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>He manages every booking personally, leads every farm tour himself, and makes every decision on the farm. If you call the number below, you&apos;ll reach him directly.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <a href="tel:0731615319" className="btn btn-secondary" style={{ minHeight: "auto", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>073 161 5319</a>
              <a href="mailto:mzanziprince@gmail.com" className="btn btn-secondary" style={{ minHeight: "auto", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>mzanziprince@gmail.com</a>
              <Link href="/experiences" className="btn btn-primary" style={{ minHeight: "auto", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Book a visit</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band">
        <div className="container">
          <h2>Come see the farm for yourself</h2>
          <p>Tours, produce pickups, and farm stays, all arranged directly with Peter.</p>
          <div className="cta-band-btns">
            <Link href="/experiences" className="btn btn-primary">Book a Visit</Link>
            <Link href="/services" className="btn btn-secondary">What We Grow</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
