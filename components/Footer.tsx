import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

const Leaf = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 0 0 3 5 3 9a7 7 0 0 1-5 7Z" />
    <path d="M11 20c0-4 2-7.5 5-9.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-crest">
        <Leaf />
        <span>REVAYAH SANCTUARY</span>
      </div>

      <div className="footer-dark">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="fb-name">REVAYAH SANCTUARY</span>
            <p>Heritage. Regeneration. Rooted in Africa.</p>
            <div className="footer-contact">
              <span>Maanhaarrand, North West Province, South Africa</span>
              <a href="tel:0731615319">073 161 5319</a>
              <a href="mailto:mzanziprince@gmail.com">mzanziprince@gmail.com</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigate</h4>
            <div className="fc-links">
              <Link href="/">Home</Link>
              <Link href="/the-farm">The Sanctuary</Link>
              <Link href="/heritage">Heritage</Link>
              <Link href="/experiences">Experiences</Link>
              <Link href="/services">Services</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Visit</h4>
            <div className="fc-links">
              <Link href="/experiences">Book a Farm Tour</Link>
              <Link href="/heritage">Heritage Trails &amp; Museum</Link>
              <Link href="/experiences">Farm Stays</Link>
              <Link href="/shop">The Revival Hub Shop</Link>
              <Link href="/auth">My Account</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Seasonal news from the valley — produce, events and farm stays.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-legal">
          <span>
            © 2026 Revayah Sanctuary. All rights reserved.{" "}
            <a href="https://uhuruai.co.za/" target="_blank" rel="noopener noreferrer">Built by Uhuru AI</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
