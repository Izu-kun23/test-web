"use client";

import { motion } from "framer-motion";

const OFFERS = [
  "2-for-1 Cocktails",
  "Weekend Specials",
  "Birthday Packages",
  "Group Discounts",
];

export default function OffersPage() {
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
            Exclusive Offers &amp; Promotions
          </h1>
        </motion.div>

        <motion.ul
          className="mt-16 grid gap-6 sm:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {OFFERS.map((offer, i) => (
            <motion.li
              key={offer}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="rounded-xl border border-white/10 bg-surface/60 px-8 py-8 text-center"
            >
              <span className="font-serif text-xl text-white/90">{offer}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          className="mt-12 text-center text-white/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Ask in-restaurant or sign up to our newsletter for current terms and availability.
        </motion.p>
      </div>
    </main>
  );
}
