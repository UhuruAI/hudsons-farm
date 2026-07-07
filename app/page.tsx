import Image from "next/image";
import Link from "next/link";

const Check = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const pillars = [
  { title: "Heritage Interpretation", desc: "An interpretation centre, heritage trails, oral history archive, and open-air amphitheatre honouring Chief Mogale and the Sekhukhune Wars.", href: "/heritage", cta: "Explore our heritage" },
  { title: "Integrated Farming System", desc: "A closed-loop farm of vegetables, fruit, and livestock powered by compost and biogas. Nothing leaves the loop.", href: "/the-farm", cta: "See the farm" },
  { title: "Hemp Training Academy", desc: "Certified training in legal industrial hemp cultivation and processing, permitted by DALRRD and aligned with the Cannabis Master Plan.", href: "/services", cta: "Learn more" },
  { title: "Eco-Resort", desc: "Fifteen eco-lodge units, a 200-seat event venue, and a 180-seat restaurant, designed to sit lightly on the land.", href: "/experiences", cta: "Plan a stay" },
  { title: "The Revival Hub", desc: "Reception, retail shop, and multimedia museum — hemp products, honey, crafts, and fresh produce, with the story of the land all around you.", href: "/shop", cta: "Visit the shop", accent: true },
];

const produce = [
  { tag: "Cultivation", img: "/images/mpcfvd9p-13-hemp.png", title: "Organic Hemp", desc: "Responsibly grown industrial hemp, cultivated without pesticides on the upper hectare." },
  { tag: "Harvest", img: "/images/mpcfvd9g-12-services.png", title: "Gourmet Mushrooms", desc: "Oyster, shiitake, and seasonal varieties grown in our on-site mushroom tunnels." },
  { tag: "Microgreens", img: "/images/mpcfvda5-15-microgreens.png", title: "Microgreens", desc: "Nutrient-dense sunflower, radish, pea, and brassica microgreens harvested weekly." },
  { tag: "Garden", img: "/images/mpcfvda0-14-dam.png", title: "Organic Food Garden", desc: "Seasonal vegetables, herbs, and fruit grown in living-soil composted beds." },
];

const loop = [
  { title: "Natural Dams", desc: "Two permanent on-site dams supply irrigation across all three growing zones." },
  { title: "Living Soil", desc: "Crop residues, hemp stalks, and mushroom substrate return as compost to build the soil." },
  { title: "Zero Waste", desc: "Hemp stalks return to compost. Mushroom substrate feeds the garden beds. Nothing leaves the loop." },
  { title: "Chemical-Free. Always.", desc: "No herbicides, no pesticides, no synthetic fertilisers. Ever. That's not a claim; it's the operating model.", accent: true },
];

const experiences = [
  { tag: "Experiences", img: "/images/mpcfvd99-11-about.png", title: "Farm Tours & Experiences", desc: "Walk the fields, the tunnels, and the dam. A guided tour through all three zones with Peter." },
  { tag: "Events", img: "/images/harvest-table.png", title: "Seasonal Events & Workshops", desc: "Mushroom harvest workshops, fresh produce days, and group experiences, bookable in advance." },
  { tag: "Farm Stays", img: "/images/mpcfvda0-14-dam.png", title: "Agri-Tourism & Farm Stays", desc: "Spend a night in the valley. Wake up to the farm before the rest of the world does." },
];

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <Image src="/images/revayah-aerial.jpg" alt="Aerial concept view of Revayah Sanctuary at golden hour" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Revayah Sanctuary · Maanhaarrand, North West</span>
            <h1>Where heritage meets living soil.</h1>
            <p className="hero-sub">
              A heritage eco-resort and regenerative farm at the foot of the Magaliesberg — five pillars on 12 hectares, honouring the land and the people who shaped it.
            </p>
            <div className="hero-ctas">
              <Link href="/experiences" className="btn btn-on-dark">Book a Visit</Link>
              <Link href="/the-farm" className="btn btn-on-dark muted">Explore the Sanctuary</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-item"><Check size={20} /><span>12 ha of regenerative land</span></div>
          <div className="trust-item"><Check size={20} /><span>5 integrated pillars</span></div>
          <div className="trust-item"><Check size={20} /><span>DALRRD hemp permit granted</span></div>
          <div className="trust-item"><Check size={20} /><span>100% chemical-free, regenerative</span></div>
        </div>
      </section>

      {/* THE FIVE PILLARS */}
      <section className="section">
        <div className="container">
          <div className="section-head text-center" style={{ margin: "0 auto" }} data-reveal>
            <span className="eyebrow">The Five Pillars</span>
            <h2>One sanctuary, five living systems</h2>
            <p className="section-sub">
              Revayah Sanctuary weaves heritage, farming, education, hospitality, and craft into a single regenerative whole.
            </p>
          </div>
          <div className="grid-cards cols-3">
            {pillars.map(({ title, desc, href, cta, accent }) => (
              <div className={`box-card${accent ? " accent" : " alt"}`} data-reveal key={title}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 0 0 3 5 3 9a7 7 0 0 1-5 7Z" /><path d="M11 20c0-4 2-7.5 5-9.5" /></svg>
                <h3>{title}</h3>
                <p>{desc}</p>
                <Link href={href} className="link-cta" style={{ marginTop: 12 }}>{cta} <Arrow /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HERITAGE TEASER */}
      <section className="split">
        <div className="split-media">
          <Image src="/images/revayah-heritage.jpg" alt="The planned stone amphitheatre and heritage interpretation centre" fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="split-body">
          <div className="split-inner" data-reveal>
            <span className="eyebrow">Heritage</span>
            <h2>A landscape that remembers</h2>
            <p>The Magaliesberg carries the name of Chief Mogale, and these hills witnessed the upheavals of the Sekhukhune Wars. Revayah Sanctuary honours that history with an interpretation centre, walking trails, an oral history archive, and an open-air stone amphitheatre.</p>
            <p>Local schools will have free access to the museum on weekdays — because this story belongs to everyone.</p>
            <div style={{ marginTop: 32 }}>
              <Link href="/heritage" className="btn btn-ghost">Explore our heritage</Link>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PRODUCE */}
      <section className="section alt">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">What We Grow</span>
            <h2>Our produce</h2>
            <p className="section-sub">
              Everything we grow is nurtured without synthetic chemicals: no herbicides, no pesticides, no synthetic fertilisers.
            </p>
          </div>
          <div className="grid-cards cols-4">
            {produce.map(({ tag, img, title, desc }) => (
              <article className="ed-card" data-reveal key={title}>
                <div className="ed-media"><Image src={img} alt={title} fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} /></div>
                <span className="ed-tag">{tag}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
          <div data-reveal style={{ marginTop: "clamp(36px,4vw,52px)" }}>
            <Link href="/services" className="btn btn-ghost">View all offerings</Link>
          </div>
        </div>
      </section>

      {/* THE LAND (split) */}
      <section className="split">
        <div className="split-media">
          <Image src="/images/mpcfvda0-14-dam.png" alt="A natural dam on the farm" fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="split-body">
          <div className="split-inner" data-reveal>
            <span className="eyebrow">The Land</span>
            <h2>12 hectares of living soil</h2>
            <p>Nestled beneath the Magaliesberg in Maanhaarrand, North West Province, Revayah Sanctuary sits on 12 hectares of active, living farmland.</p>
            <p>Two permanent natural dams supply irrigation. A mature pecan orchard lines the eastern edge. The Integrated Farming System keeps vegetables, fruit, and livestock in one closed, self-feeding loop.</p>
            <div className="chip-row">
              {["No synthetic chemicals", "Two natural dams", "Pecan orchards"].map((f) => (
                <span className="chip-check" key={f}><Check />{f}</span>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link href="/about" className="btn btn-ghost">Our story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE CLOSED LOOP */}
      <section className="section">
        <div className="container">
          <div className="section-head text-center" style={{ margin: "0 auto" }} data-reveal>
            <span className="eyebrow">The Integrated Farming System</span>
            <h2>Every part of the farm feeds another</h2>
            <p className="section-sub">Hemp residue feeds the compost. The compost feeds the soil. The soil feeds every crop on the farm — and biogas closes the loop.</p>
          </div>
          <div className="grid-cards cols-4">
            {loop.map(({ title, desc, accent }) => (
              <div className={`box-card${accent ? " accent" : " alt"}`} data-reveal key={title}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 0 0 3 5 3 9a7 7 0 0 1-5 7Z" /><path d="M11 20c0-4 2-7.5 5-9.5" /></svg>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center" data-reveal style={{ marginTop: "clamp(36px,4vw,52px)" }}>
            <Link href="/the-farm" className="btn btn-ghost">See how the sanctuary is laid out</Link>
          </div>
        </div>
      </section>

      {/* EXPERIENCE THE FARM */}
      <section className="section alt">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Agri-Tourism</span>
            <h2>Experience the sanctuary</h2>
            <p className="section-sub">Come and walk the land. Revayah Sanctuary opens its gates for tours, heritage trails, seasonal gatherings and overnight stays.</p>
          </div>
          <div className="grid-cards cols-3">
            {experiences.map(({ tag, img, title, desc }) => (
              <article className="exp-card" data-reveal key={title}>
                <div className="ed-media"><Image src={img} alt={title} fill sizes="(max-width: 880px) 100vw, 33vw" style={{ objectFit: "cover" }} /></div>
                <div className="exp-body">
                  <span className="ed-tag" style={{ marginTop: 0 }}>{tag}</span>
                  <h3 style={{ marginTop: 8 }}>{title}</h3>
                  <p>{desc}</p>
                  <Link href="/experiences" className="link-cta">Book now <Arrow /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <Image src="/images/harvest-table.png" alt="A harvest table on the farm" fill sizes="100vw" className="hero-bg" />
        <div className="cta-overlay" />
        <div className="cta-inner">
          <div className="cta-box" data-reveal>
            <h2>Ready to visit Revayah Sanctuary?</h2>
            <p>Book a tour, arrange a fresh harvest pickup, or enquire about a farm stay. Peter manages all bookings personally.</p>
            <div className="hero-ctas">
              <Link href="/experiences" className="btn btn-on-dark" style={{ background: "#fff", color: "var(--dark)" }}>Book Now</Link>
              <Link href="/services" className="btn btn-on-dark muted">See All Services</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
