"use client";

import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/reservations", label: "Reservations" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-serif text-2xl font-semibold text-white/95">
              Roots
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/55">
              A taste of culture. A home of flavour. Caribbean-inspired cuisine and handcrafted cocktails in Manchester.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white/80">
              Quick links
            </h4>
            <ul className="mt-4 flex flex-col gap-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/55 transition hover:text-bronze">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white/80">
              Opening hours
            </h4>
            <p className="mt-4 text-sm text-white/55">
              Mon – Thu: 12:00 – 22:00<br />
              Fri – Sat: 12:00 – 23:00<br />
              Sun: 12:00 – 21:00
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white/80">
              Connect
            </h4>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-white/55 hover:text-bronze" aria-label="Instagram">IG</a>
              <a href="#" className="text-white/55 hover:text-bronze" aria-label="Facebook">FB</a>
              <a href="#" className="text-white/55 hover:text-bronze" aria-label="Twitter">X</a>
            </div>
            <p className="mt-4 text-sm text-white/55">
              Subscribe for offers & news
            </p>
            <form className="mt-2 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded border border-white/20 bg-charcoal/50 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-bronze focus:outline-none"
              />
              <button
                type="submit"
                className="rounded bg-bronze px-4 py-2 text-sm font-medium text-white hover:bg-bronze-light"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/45">
          © {new Date().getFullYear()} Roots Manchester. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
