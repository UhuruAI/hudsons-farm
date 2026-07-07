import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "What We Do | Revayah Sanctuary" };

const Check = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const mainServices = [
  {
    num: "01", tag: "Hemp Training Academy", img: "/images/mpcfvd9p-13-hemp.png", title: "Hemp Cultivation & Training Academy",
    paras: [
      "Revayah Sanctuary grows licensed industrial hemp (under 0.2% THC) without pesticides, herbicides, or synthetic fertilisers — and is building a Hemp Training Academy offering certified training in cultivation and processing for fibre, seed, and construction materials.",
      "Our cultivation permit is granted by DALRRD under the Plant Improvement Act, with processing registration through the dtic in process — fully aligned with South Africa's Cannabis Master Plan. We welcome students, research partnerships, and agri-processing collaborations.",
    ],
    details: ["DALRRD cultivation permit granted", "Legal industrial hemp only — under 0.2% THC", "Certified training in cultivation & processing", "Aligned with the SA Cannabis Master Plan"],
  },
  {
    num: "02", tag: "Harvest", img: "/images/mpcfvd9g-12-services.png", title: "Gourmet Mushroom Growing",
    paras: [
      "We grow oyster, shiitake, and seasonal gourmet mushrooms in dedicated tunnels on the farm. The substrate is sourced entirely from on-farm waste, a true closed loop.",
      "Mushrooms are available whole and dried, and we supply restaurants and traders on a batch booking basis. You can also book a harvest experience and pick your own.",
    ],
    details: ["Oyster, shiitake, and seasonal varieties", "Chemical-free substrate from farm waste", "Whole mushrooms and dried available", "Batch bookings for restaurants and traders"],
  },
  {
    num: "03", tag: "Microgreens", img: "/images/mpcfvda5-15-microgreens.png", title: "Microgreens Production",
    paras: [
      "Our microgreens nursery produces sunflower, radish, pea, broccoli, and brassica blends, harvested weekly and available fresh from the farm.",
      "Subscribe to a weekly tray, or arrange a one-off pickup. Grown without synthetic inputs on living-soil trays, every batch is cut to order.",
    ],
    details: ["Weekly subscription packs available", "Sunflower, radish, pea, broccoli, and brassica blends", "Grown without synthetic inputs", "Pickup from the farm or local delivery (enquire)"],
  },
  {
    num: "04", tag: "Fresh Produce", img: "/images/mpcfvda0-14-dam.png", title: "Organic Food Garden",
    paras: [
      "The central growing zone produces seasonal vegetables, herbs, and fruit grown in composted, living-soil beds. What's available changes with the seasons, always chemical-free.",
      "Fresh harvest pickups are scheduled in advance. Great for families, home cooks, and health-conscious buyers who want to know exactly where their food comes from.",
    ],
    details: ["Seasonal vegetables, herbs, and fruit", "Fresh harvest box pickups, scheduled in advance", "Composted, living-soil beds", "Great for families, home cooks, and health-conscious buyers"],
  },
];

const extras = [
  { title: "Farm Tours & Experiences", desc: "Guided walks through the hemp fields, mushroom tunnels, microgreens nursery, and dams. Book individually or in groups." },
  { title: "Fresh Harvest Bookings", desc: "Schedule your own fresh-harvest visit. Pick up seasonal vegetables, microgreens, and mushrooms direct from the source." },
  { title: "Agri-Tourism & Farm Stays", desc: "Stay on the farm and wake up to the Magaliesberg. Overnight stays by arrangement. Enquire for rates and availability." },
  { title: "The Revival Hub Shop", desc: "Hemp products, honey, crafts, and the farm kitchen range — everything made or grown at the sanctuary, in one shop." },
];

export default function ServicesPage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero compact">
        <Image src="/images/mpcfvd90-10-hero.png" alt="Revayah Sanctuary fields" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Revayah Sanctuary</span>
            <h1>Our offerings</h1>
            <p className="hero-sub">From hemp fields to mushroom houses to guided farm walks. Everything grown and offered on one regenerative farm.</p>
          </div>
        </div>
      </section>

      {/* MAIN SERVICES — alternating splits */}
      {mainServices.map(({ num, tag, img, title, paras, details }, i) => (
        <section className={`split${i % 2 === 1 ? " reverse" : ""}`} key={num}>
          <div className="split-media">
            <Image src={img} alt={title} fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div className={`split-body${i % 2 === 1 ? " plain" : ""}`}>
            <div className="split-inner" data-reveal>
              <span className="eyebrow">{num} · {tag}</span>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)" }}>{title}</h2>
              {paras.map((p, k) => <p key={k}>{p}</p>)}
              <ul className="feature-list">
                {details.map((d) => (
                  <li key={d}><span style={{ color: "var(--accent)", display: "flex" }}><Check /></span>{d}</li>
                ))}
              </ul>
              <p style={{ fontSize: 13, color: "var(--faint)", fontStyle: "italic", marginTop: 18 }}>Enquire for pricing</p>
              <div style={{ marginTop: 20 }}>
                <Link href="/contact" className="btn btn-ghost">Get in touch</Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* EXTRAS */}
      <section className="section alt">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">More from Revayah Sanctuary</span>
            <h2>Experiences &amp; agri-tourism</h2>
            <p className="section-sub">Beyond what we grow, the farm itself is a destination. Come and see for yourself.</p>
          </div>
          <div className="grid-cards cols-4">
            {extras.map(({ title, desc }) => (
              <div className="box-card" data-reveal key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
                <p style={{ fontSize: 13, color: "var(--faint)", fontStyle: "italic" }}>Enquire for pricing</p>
                <div><Link href="/contact" className="link-cta">Enquire</Link></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <Image src="/images/harvest-table.png" alt="Harvest table" fill sizes="100vw" className="hero-bg" />
        <div className="cta-overlay" />
        <div className="cta-inner">
          <div className="cta-box" data-reveal>
            <h2>Book your farm experience</h2>
            <p>Tours, harvest pickups, stays, and produce, all arranged directly with Peter.</p>
            <div className="hero-ctas">
              <Link href="/experiences" className="btn btn-on-dark" style={{ background: "#fff", color: "var(--dark)" }}>Book Now</Link>
              <Link href="/about" className="btn btn-on-dark muted">About the Farm</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
