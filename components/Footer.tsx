import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="logo">
            Hudson&apos;s <em>Farm</em>
          </Link>
          <p>Organic. Regenerative. Rooted in Africa.</p>
          <address>
            Magaliesburg, South Africa<br />
            <a href="tel:0731615319">073 161 5319</a><br />
            <a href="mailto:mzanziprince@gmail.com">mzanziprince@gmail.com</a>
          </address>
        </div>

        <div className="footer-col">
          <h4>Navigate</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/the-farm">The Farm</Link></li>
            <li><Link href="/experiences">Experiences</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Visit</h4>
          <ul>
            <li><Link href="/experiences">Book a Farm Tour</Link></li>
            <li><Link href="/experiences">Fresh Harvest Pickup</Link></li>
            <li><Link href="/experiences">Farm Stays</Link></li>
            <li><Link href="/experiences">Microgreens Subscription</Link></li>
            <li><Link href="/auth">My Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-legal">
        <p>© 2025 Hudson&apos;s Farm. All rights reserved.</p>
      </div>
    </footer>
  );
}
