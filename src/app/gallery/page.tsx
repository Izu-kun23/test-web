"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = ["All", "Food", "Drinks", "Interior", "Events"] as const;

const PLACEHOLDERS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  filter: (["Food", "Drinks", "Interior", "Events"] as const)[i % 4],
  alt: `Gallery image ${i + 1}`,
}));

export default function GalleryPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const items =
    active === "All"
      ? PLACEHOLDERS
      : PLACEHOLDERS.filter((p) => p.filter === active);

  return (
    <main className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl font-semibold text-white/92 md:text-5xl">
            Gallery
          </h1>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                active === f
                  ? "bg-bronze text-white"
                  : "bg-charcoal/60 text-white/70 hover:text-white hover:bg-charcoal/80"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="aspect-[4/5] overflow-hidden rounded-lg bg-charcoal/60"
              >
                <div className="h-full w-full bg-deep-green/40 flex items-center justify-center text-white/40 text-sm">
                  {item.alt}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
