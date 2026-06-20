"use client";

export default function NewsletterForm() {
  return (
    <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
      <input type="email" aria-label="Email address" placeholder="Your email" />
      <button type="submit">Subscribe</button>
    </form>
  );
}
