"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ChipScroll from "@/components/ChipScroll";
import StoryOverlays from "@/components/StoryOverlays";
import LoadingScreen from "@/components/LoadingScreen";

const DISHES = [
  { name: "Jerk Lamb Cutlets" },
  { name: "Seafood Boil" },
  { name: "Plantain Stack" },
  { name: "Signature Rum Punch" },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <LoadingScreen show={loading} />
      <motion.main
        className="min-h-screen bg-bg"
        initial={false}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pt-[72px]">
          <ChipScroll onReady={() => setLoading(false)}>
            <StoryOverlays />
          </ChipScroll>
        </div>

        {/* Signature Experience */}
        <section className="border-t border-white/10 bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
            <motion.h2
              className="font-serif text-3xl font-semibold text-white/92 md:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              Where Tradition Meets Modern Dining
            </motion.h2>
            <motion.p
              className="mt-6 text-lg text-white/65 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              At Roots, every dish tells a story. Inspired by heritage recipes and elevated with contemporary flair, we bring the warmth of the Caribbean to Manchester.
            </motion.p>
          </div>
        </section>

        {/* Featured Dishes */}
        <section className="border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <motion.h2
              className="font-serif text-center text-2xl font-semibold text-white/92 md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Dishes
            </motion.h2>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DISHES.map((dish, i) => (
                <motion.li
                  key={dish.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-lg border border-white/10 bg-charcoal/60 px-6 py-8 text-center transition hover:border-bronze/40 hover:bg-charcoal/80"
                >
                  <span className="font-serif text-lg font-medium text-white/90">{dish.name}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Atmosphere */}
        <section className="border-t border-white/10 bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
            <motion.h2
              className="font-serif text-3xl font-semibold text-white/92 md:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              More Than a Meal — It&apos;s an Experience
            </motion.h2>
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/reservations"
                className="inline-block rounded-full bg-bronze px-8 py-4 font-semibold text-white transition hover:bg-bronze-light"
              >
                Reserve Your Table
              </Link>
            </motion.div>
          </div>
        </section>
      </motion.main>
      <div className="grain-overlay" aria-hidden />
    </>
  );
}
