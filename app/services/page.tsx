import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Services | Hudson's Farm" };

const mainServices = [
  {
    num: "01", tag: "Cultivation", img: "/images/mpcfvd9p-13-hemp.png", flip: false,
    title: "Organic Hemp Cultivation",
    paras: [
      "Hudson's Farm grows licensed industrial hemp on the upper hectare. Every plant is cultivated without pesticides, herbicides, or synthetic fertilisers, irrigated by the on-site natural dam and managed on a seasonal rotation.",
      "Our hemp is grown under full regulatory compliance. We welcome research partnerships, bulk enquiries, and agri-processing collaborations.",
    ],
    details: [
      "100% pesticide-free cultivation",
      "Licensed and compliant with South African hemp regulations",
      "Natural dam irrigation, minimal water footprint",
      "Available for bulk enquiry and research partnerships",
    ],
  },
  {
    num: "02", tag: "Harvest", img: "/images/mpcfvd9g-12-services.png", flip: true,
    title: "Gourmet Mushroom Growing",
    paras: [
      "We grow oyster, shiitake, and seasonal gourmet mushrooms in dedicated tunnels on the farm. The substrate is sourced entirely from on-farm waste, a true closed loop.",
      "Mushrooms are available whole and dried, and we supply restaurants and traders on a batch booking basis. You can also book a harvest experience and pick your own.",
    ],
    details: [
      "Oyster, shiitake, and seasonal varieties",
      "Chemical-free substrate from farm waste",
      "Whole mushrooms and dried available",
      "Batch bookings for restaurants and traders",
    ],
  },
  {
    num: "03", tag: "Microgreens", img: "/images/mpcfvda5-15-microgreens.png", flip: false,
    title: "Microgreens Production",
    paras: [
      "Our microgreens nursery produces sunflower, radish, pea, broccoli, and brassica blends, harvested weekly and available fresh from the farm.",
      "Subscribe to a weekly tray, or arrange a one-off pickup. Grown without synthetic inputs on living-soil trays, every batch is cut to order.",
    ],
    details: [
      "Weekly subscription packs available",
      "Sunflower, radish, pea, broccoli, and brassica blends",
      "Grown without synthetic inputs",
      "Pickup from the farm or local delivery (enquire)",
    ],
  },
  {
    num: "04", tag: "Fresh Produce", img: "/images/mpcfvda0-14-dam.png", flip: true,
    title: "Organic Food Garden",
    paras: [
      "The central growing zone produces seasonal vegetables, herbs, and fruit grown in composted, living-soil beds. What&apos;s available changes with the seasons, always chemical-free.",
      "Fresh harvest pickups are scheduled in advance. Great for families, home cooks, and health-conscious buyers who want to know exactly where their food comes from.",
    ],
    details: [
      "Seasonal vegetables, herbs, and fruit",
      "Fresh harvest box pickups, scheduled in advance",
      "Composted, living-soil beds",
      "Great for families, home cooks, and health-conscious buyers",
    ],
  },
];

const extras = [
  { title: "Farm Tours & Experiences", desc: "Guided walks through the hemp fields, mushroom tunnels, microgreens nursery, and dams. Book individually or in groups." },
  { title: "Fresh Harvest Bookings", desc: "Schedule your own fresh-harvest visit. Pick up seasonal vegetables, microgreens, and mushrooms direct from the source." },
  { title: "Agri-Tourism & Farm Stays", desc: "Stay on the farm and wake up to the Magaliesberg. Overnight stays by arrangement. Enquire for rates and availability." },
  { title: "Pecan Tree Orchard", desc: "Our mature pecan orchard lines the eastern edge of the property. Seasonal pecan availability. Enquire for harvest dates." },
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero" style={{ minHeight: "clamp(280px, 45vh, 460px)" }}>
        <Image src="/images/mpcfvd90-10-hero.png" alt="Hudson's Farm" fill className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-eyebrow">Hudson&apos;s Farm</span>
          <h1>Our offerings</h1>
          <p className="hero-sub">From hemp fields to mushroom houses to guided farm walks. Everything grown and offered on one regenerative farm.</p>
        </div>
      </section>

      {/* Main Services */}
      {mainServices.map(({ num, tag, img, flip, title, paras, details }) => (
        <section key={num} className="section" style={{ background: parseInt(num) % 2 === 0 ? "var(--surface)" : undefined }}>
          <div className="container">
            <div className={`split${flip ? " reverse" : ""}`}>
              <div className="split-img">
                <Image src={img} alt={title} width={600} height={450} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="split-text">
                <div>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>{num} · {tag}</span>
                </div>
                <span className="eyebrow">{tag}</span>
                <h2 style={{ fontSize: "clamp(1.375rem, 3vw, 2rem)" }}>{title}</h2>
                {paras.map((p, i) => (
                  <p key={i} style={{ color: "var(--muted)", fontSize: "1.0625rem" }} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
                  {details.map((d) => (
                    <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9375rem", color: "var(--muted)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.2rem" }}><polyline points="20 6 9 17 4 12"/></svg>
                      {d}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", fontStyle: "italic" }}>Enquire for pricing</p>
                <Link href="/contact" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Get in touch</Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Extras */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">More from Hudson&apos;s Farm</span>
          <h2>Experiences &amp; agri-tourism</h2>
          <p className="section-sub">Beyond what we grow, the farm itself is a destination. Come and see for yourself.</p>
          <div className="grid-4" style={{ marginTop: "1.5rem" }}>
            {extras.map(({ title, desc }) => (
              <div key={title} style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>{desc}</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "0.75rem" }}>Enquire for pricing</p>
                <Link href="/contact" className="btn btn-secondary" style={{ minHeight: "auto", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Enquire</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <h2>Book your farm experience</h2>
          <p>Tours, harvest pickups, stays, and produce, all arranged directly with Peter.</p>
          <div className="cta-band-btns">
            <Link href="/experiences" className="btn btn-primary">Book Now</Link>
            <Link href="/about" className="btn btn-secondary">About the Farm</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
