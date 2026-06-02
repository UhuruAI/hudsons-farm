import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <Image src="/images/mpcfvd90-10-hero.png" alt="Hudson's Farm aerial view" fill className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-eyebrow">Hudson&apos;s Farm · Magaliesburg, South Africa</span>
          <h1>Grown with purpose, rooted in Africa.</h1>
          <p className="hero-sub">
            6.8 hectares of organic hemp, gourmet mushrooms, microgreens, and fresh produce, farmed regeneratively in the heart of the Magaliesberg valley.
          </p>
          <div className="hero-ctas">
            <Link href="/experiences" className="btn btn-primary">Book a Farm Visit</Link>
            <Link href="/shop" className="btn btn-ghost">Our Produce</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="container">
          <div className="stats-bar">
            <div className="stat"><div className="stat-value">6.8 ha</div><div className="stat-label">Certified organic land</div></div>
            <div className="stat"><div className="stat-value">8</div><div className="stat-label">Produce &amp; experience offerings</div></div>
            <div className="stat"><div className="stat-value">2</div><div className="stat-label">Natural dams on the property</div></div>
            <div className="stat"><div className="stat-value">100%</div><div className="stat-label">Chemical-free, regenerative</div></div>
          </div>
        </div>
      </section>

      {/* Our Produce */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">What We Grow</span>
          <h2>Our produce</h2>
          <p className="section-sub">
            Everything we grow is nurtured without synthetic chemicals: no herbicides, no pesticides, no synthetic fertilisers.
          </p>
          <div className="grid-4">
            {[
              { tag: "Cultivation", img: "/images/mpcfvd9p-13-hemp.png", title: "Organic Hemp", desc: "Responsibly grown industrial hemp, cultivated without pesticides on the upper hectare." },
              { tag: "Harvest", img: "/images/mpcfvd9g-12-services.png", title: "Gourmet Mushrooms", desc: "Oyster, shiitake, and seasonal varieties grown in our on-site mushroom tunnels." },
              { tag: "Microgreens", img: "/images/mpcfvda5-15-microgreens.png", title: "Microgreens", desc: "Nutrient-dense sunflower, radish, pea, and brassica microgreens harvested weekly." },
              { tag: "Garden", img: "/images/mpcfvda0-14-dam.png", title: "Organic Food Garden", desc: "Seasonal vegetables, herbs, and fruit grown in living-soil composted beds." },
            ].map(({ tag, img, title, desc }) => (
              <div className="card" key={title}>
                <div className="card-photo">
                  <Image src={img} alt={title} width={400} height={300} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="card-body">
                  <span className="card-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/services" className="btn btn-secondary">View all offerings</Link>
          </div>
        </div>
      </section>

      {/* The Land */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div className="split">
            <div className="split-img">
              <Image src="/images/mpcfvda0-14-dam.png" alt="The natural dam" width={600} height={450} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="split-text">
              <span className="eyebrow">The Land</span>
              <h2>6.8 hectares of living soil</h2>
              <p>Nestled in the Magaliesberg valley between the Gauteng and North West borders, Hudson&apos;s Farm sits on six-point-eight hectares of active, living farmland.</p>
              <p>Two permanent natural dams supply irrigation. A mature pecan orchard lines the eastern edge. Three cultivation zones keep the soil productive year-round.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                {["No synthetic chemicals", "Two natural dams", "Pecan orchards"].map((f) => (
                  <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.75rem", background: "var(--surface-soft)", border: "1px solid var(--border)", borderRadius: "var(--r-full)", fontSize: "0.875rem", color: "var(--fg)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </span>
                ))}
              </div>
              <Link href="/about" className="btn btn-secondary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>Our story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closed Loop */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <span className="eyebrow">The Closed Loop</span>
            <h2>Every part of the farm feeds another</h2>
            <p className="section-sub">Hemp residue feeds the compost. The compost feeds the soil. The soil feeds every crop on the farm.</p>
          </div>
          <div className="grid-4" style={{ marginTop: "2rem" }}>
            {[
              { title: "Natural Dams", desc: "Two permanent on-site dams supply irrigation across all three growing zones." },
              { title: "Living Soil", desc: "Crop residues, hemp stalks, and mushroom substrate return as compost to build the soil." },
              { title: "Zero Waste", desc: "Hemp stalks return to compost. Mushroom substrate feeds the garden beds. Nothing leaves the loop." },
              { title: "Chemical-Free. Always.", desc: "No herbicides, no pesticides, no synthetic fertilisers. Ever. That&apos;s not a claim; it&apos;s the operating model." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)" }} dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/the-farm" className="btn btn-secondary">See how the farm is laid out →</Link>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <span className="eyebrow">Agri-Tourism</span>
          <h2>Experience the farm</h2>
          <div className="grid-3" style={{ marginTop: "1.5rem" }}>
            {[
              { tag: "Experiences", img: "/images/mpcfvd99-11-about.png", title: "Farm Tours & Experiences", desc: "Walk the fields, the tunnels, and the dam. A guided tour through all three zones with Peter." },
              { tag: "Events", img: "/images/harvest-table.png", title: "Seasonal Events & Workshops", desc: "Mushroom harvest workshops, fresh produce days, and group experiences, bookable in advance." },
              { tag: "Farm Stays", img: "/images/mpcfvda0-14-dam.png", title: "Agri-Tourism & Farm Stays", desc: "Spend a night in the valley. Wake up to the farm before the rest of the world does." },
            ].map(({ tag, img, title, desc }) => (
              <div className="card" key={title}>
                <div className="card-photo">
                  <Image src={img} alt={title} width={400} height={300} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="card-body">
                  <span className="card-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <Link href="/experiences" className="card-cta">Book now →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to visit Hudson&apos;s Farm?</h2>
          <p>Book a tour, arrange a fresh harvest pickup, or enquire about a farm stay. Peter manages all bookings personally.</p>
          <div className="cta-band-btns">
            <Link href="/experiences" className="btn btn-primary">Book Now</Link>
            <Link href="/services" className="btn btn-secondary">See All Services</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
