"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/reservations", label: "Reservations" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-[150] border-b border-white/5 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-wide text-white/95 md:text-2xl"
        >
          Roots
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm font-medium tracking-wide text-white/75 transition hover:text-bronze"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/reservations"
            className="rounded-full bg-bronze px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-bronze-light"
          >
            Book a Table
          </Link>
          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-2 text-white/80"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-6 bg-current transition ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-6 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-current transition ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border-t border-white/5 md:hidden overflow-hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-2 text-white/80 hover:text-bronze"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/reservations"
                  className="inline-block rounded-full bg-bronze px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Book a Table
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
