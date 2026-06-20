import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About | Hudson's Farm" };

const commitments = [
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "No synthetic inputs", desc: "No herbicides, no pesticides, no synthetic fertilisers. Ever. We use compost, cover crops, and beneficial insects instead." },
  { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, title: "Water stewardship", desc: "Two natural dams supply irrigation. Borehole water supplements dry periods. We track usage and minimise waste every season." },
  { icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>, title: "Radical transparency", desc: "Come and see the farm. Walk every zone. Ask every question. We have nothing to hide and everything to show." },
];

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero compact">
        <Image src="/images/mpcfvd99-11-about.png" alt="About Hudson's Farm" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Our Story</span>
            <h1>Organic. Regenerative. Rooted in Africa.</h1>
            <p className="hero-sub">Hudson&apos;s Farm is a working organic farm in the Magaliesberg valley, one of the oldest mountain ranges in the world.</p>
          </div>
        </div>
      </section>

      {/* THE FARM (split) */}
      <section className="split">
        <div className="split-media">
          <Image src="/images/mpcfvd90-10-hero.png" alt="The farm fields" fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="split-body plain">
          <div className="split-inner" data-reveal>
            <span className="eyebrow">The Farm</span>
            <h2>12 hectares of purpose</h2>
            <p>Located in the Magaliesberg valley, between the Gauteng and North West borders, Hudson&apos;s Farm sits on 12 hectares of active, certified organic farmland.</p>
            <p>We grow organic hemp, gourmet mushrooms, microgreens, and seasonal vegetables. A mature pecan orchard lines the eastern edge of the property, and two natural dams supply irrigation across all three cultivation zones.</p>
            <p>Everything on this farm is built around one principle: stewardship of the soil. We farm as if the land will outlive us. Because it will.</p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY (split reverse) */}
      <section className="split reverse">
        <div className="split-media">
          <Image src="/images/mpcfvda0-14-dam.png" alt="Natural dam" fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="split-body">
          <div className="split-inner" data-reveal>
            <span className="eyebrow">Our Philosophy</span>
            <h2>Regenerative, not just organic</h2>
            <p>Certified organic means no synthetic inputs. Regenerative means going further, actively building soil health, biodiversity, and water retention with every decision we make.</p>
            <p>We don&apos;t till unnecessarily. We compost everything. We let the dams do the work. We rotate. We observe. We adapt.</p>
            <blockquote className="pull-quote">
              <p>&ldquo;Regenerative farming is farming as if the next generation matters. Because they do.&rdquo;</p>
              <cite>Peter Hudson, Owner, Hudson&apos;s Farm</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* THREE COMMITMENTS */}
      <section className="section">
        <div className="container">
          <div className="section-head text-center" style={{ margin: "0 auto" }} data-reveal>
            <span className="eyebrow">How We Farm</span>
            <h2>Three commitments we keep</h2>
            <p className="section-sub">These aren&apos;t marketing claims. They&apos;re the operating principles that govern every decision on the farm.</p>
          </div>
          <div className="value-grid">
            {commitments.map(({ icon, title, desc }) => (
              <div className="value-item" data-reveal key={title}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET PETER */}
      <section className="section alt">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">The Person Behind the Farm</span>
            <h2>Meet Peter Hudson</h2>
            <p className="section-sub">Hudson&apos;s Farm is a hands-on, owner-operated farm. There&apos;s no management team. No corporate structure. Just Peter and the land.</p>
          </div>
          <div className="panel" data-reveal style={{ maxWidth: 620, marginTop: "clamp(28px,3vw,40px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                <Image src="/images/mpcfvd99-11-about.png" alt="Peter Hudson" fill sizes="72px" style={{ objectFit: "cover", objectPosition: "center 15%" }} />
              </div>
              <div>
                <strong style={{ display: "block", fontFamily: "var(--font-head)", fontSize: 20 }}>Peter Hudson</strong>
                <span style={{ display: "inline-block", marginTop: 6, padding: "4px 12px", border: "1px solid var(--accent)", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>Owner &amp; Farmer, Hudson&apos;s Farm</span>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>Peter started the farm with one idea: grow real food on living soil, in a place worth farming well. That idea became 12 hectares of certified organic land in the Magaliesberg.</p>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>He manages every booking personally, leads every farm tour himself, and makes every decision on the farm. If you call the number below, you&apos;ll reach him directly.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="tel:0731615319" className="btn btn-ghost" style={{ padding: "11px 20px" }}>073 161 5319</a>
              <a href="mailto:mzanziprince@gmail.com" className="btn btn-ghost" style={{ padding: "11px 20px" }}>mzanziprince@gmail.com</a>
              <Link href="/experiences" className="btn btn-solid" style={{ padding: "11px 20px" }}>Book a visit</Link>
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
            <h2>Come see the farm for yourself</h2>
            <p>Tours, produce pickups, and farm stays, all arranged directly with Peter.</p>
            <div className="hero-ctas">
              <Link href="/experiences" className="btn btn-on-dark" style={{ background: "#fff", color: "var(--dark)" }}>Book a Visit</Link>
              <Link href="/services" className="btn btn-on-dark muted">What We Grow</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
