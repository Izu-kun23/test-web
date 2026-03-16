"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EVENT_TYPES = [
  "Birthday Celebrations",
  "Corporate Events",
  "Private Parties",
  "Wedding Receptions",
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl font-semibold text-white/92 md:text-5xl">
            Celebrate With Roots
          </h1>
        </motion.div>

        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="font-serif text-2xl font-semibold text-white/92 md:text-3xl">
            Events Designed Around You
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {EVENT_TYPES.map((type, i) => (
              <motion.li
                key={type}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
                className="rounded-lg border border-white/10 bg-surface/60 px-6 py-6"
              >
                <span className="font-serif text-lg text-white/90">{type}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="font-serif text-xl text-white/80">Let&apos;s Plan Something Special</p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-bronze px-8 py-4 font-semibold text-white transition hover:bg-bronze-light"
          >
            Start Your Event Enquiry
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
