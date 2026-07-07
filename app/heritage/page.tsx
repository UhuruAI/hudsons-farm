import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Heritage | Revayah Sanctuary" };

const keepers = [
  { title: "Interpretation Centre", desc: "A stone-and-timber centre where the history of the Magaliesberg, its people, and its wars is told with care — exhibits, artefacts, and guided storytelling." },
  { title: "Heritage Trails", desc: "Walking trails across the property trace the old landscape, with interpretive markers connecting what you see to what happened here." },
  { title: "Oral History Archive", desc: "Recorded voices of elders and descendants, preserved and played back in the museum so the story is told by the people who carry it." },
  { title: "Open-Air Amphitheatre", desc: "A stone amphitheatre for performances, ceremonies, school visits, and storytelling under the highveld sky.", accent: true },
];

export default function HeritagePage() {
  return (
    <main>
      {/* HERO */}
      <section className="hero compact">
        <Image src="/images/revayah-heritage.jpg" alt="Concept view of the Revayah Sanctuary heritage amphitheatre and interpretation centre" fill sizes="100vw" className="hero-bg" priority />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Heritage</span>
            <h1>A Landscape That Remembers</h1>
            <p className="hero-sub">The Magaliesberg is one of the oldest mountain ranges on Earth, and its foothills hold stories that deserve to be kept alive.</p>
          </div>
        </div>
      </section>

      {/* CHIEF MOGALE */}
      <section className="split">
        <div className="split-media">
          <Image src="/images/mpcfvd99-11-about.png" alt="The Magaliesberg landscape" fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="split-body">
          <div className="split-inner" data-reveal>
            <span className="eyebrow">Chief Mogale</span>
            <h2>The mountains that carry his name</h2>
            <p>The Magaliesberg is named for Chief Mogale wa Mogale of the Po people, who led his community through one of the most turbulent chapters of Southern African history. Long before colonial borders, these valleys were home, pasture, and refuge.</p>
            <p>Revayah Sanctuary stands on that ground. Our heritage pillar exists to honour it — not as a footnote, but as the beginning of the story we tell every visitor who walks through the Revival Hub.</p>
          </div>
        </div>
      </section>

      {/* SEKHUKHUNE WARS */}
      <section className="split reverse">
        <div className="split-media">
          <Image src="/images/farm-zones-aerial.png" alt="Aerial view of the sanctuary landscape" fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="split-body">
          <div className="split-inner" data-reveal>
            <span className="eyebrow">The Sekhukhune Wars</span>
            <h2>Remembering the wars that shaped this land</h2>
            <p>In the late nineteenth century, the Sekhukhune Wars between the Bapedi kingdom, the Boer republics, and the British Empire redrew the map of the interior. Communities across the old Transvaal — including these foothills — were swept into the upheaval.</p>
            <p>The interpretation centre will set that history out honestly: the resistance, the loss, and the resilience of the people who remained. It is history told in place, on the land where it happened.</p>
          </div>
        </div>
      </section>

      {/* KEEPING THE STORY ALIVE */}
      <section className="section">
        <div className="container">
          <div className="section-head text-center" style={{ margin: "0 auto" }} data-reveal>
            <span className="eyebrow">Living Heritage</span>
            <h2>How we keep the story alive</h2>
            <p className="section-sub">Four spaces, one purpose: to make sure the history of this landscape is seen, heard, and passed on.</p>
          </div>
          <div className="grid-cards cols-4">
            {keepers.map(({ title, desc, accent }) => (
              <div className={`box-card${accent ? " accent" : " alt"}`} data-reveal key={title}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 0 0 3 5 3 9a7 7 0 0 1-5 7Z" /><path d="M11 20c0-4 2-7.5 5-9.5" /></svg>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MUSEUM AT THE REVIVAL HUB */}
      <section className="split">
        <div className="split-media">
          <Image src="/images/revayah-hub.jpg" alt="Concept view of the multimedia museum inside the Revival Hub" fill sizes="(max-width: 880px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="split-body">
          <div className="split-inner" data-reveal>
            <span className="eyebrow">The Revival Hub</span>
            <h2>The museum at the heart of the sanctuary</h2>
            <p>Inside the Revival Hub, a multimedia museum runs a looping historical documentary, interactive maps of the region, and recordings from the oral history archive — alongside the retail shop selling hemp products, honey, crafts, and fresh produce.</p>
            <p style={{ fontWeight: 600, color: "var(--accent)" }}>Local schools visit the museum free of charge, every weekday.</p>
            <div style={{ marginTop: 32 }}>
              <Link href="/shop" className="btn btn-ghost">Visit the Revival Hub Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <Image src="/images/revayah-heritage.jpg" alt="The heritage amphitheatre at golden hour" fill sizes="100vw" className="hero-bg" />
        <div className="cta-overlay" />
        <div className="cta-inner">
          <div className="cta-box" data-reveal>
            <h2>Walk the heritage trail</h2>
            <p>Book a guided heritage walk or a museum visit — and let the landscape tell you its story.</p>
            <div className="hero-ctas">
              <Link href="/experiences" className="btn btn-on-dark" style={{ background: "#fff", color: "var(--dark)" }}>Book a Visit</Link>
              <Link href="/contact" className="btn btn-on-dark muted">Ask a Question</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
