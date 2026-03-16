"use client";

import { motion } from "framer-motion";

export default function RestaurantsPage() {
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
            Roots Manchester
          </h1>
          <p className="mt-4 text-lg text-white/65">
            518 Hyde Road<br />
            Gorton, Manchester<br />
            M18 7AA
          </p>
          <p className="mt-6">
            <a href="tel:+441614788135" className="text-bronze hover:text-bronze-light">
              +44 161 478 8135
            </a>
          </p>
          <p className="mt-2">
            <a href="mailto:liverpool@rootsrestaurants.co.uk" className="text-bronze hover:text-bronze-light">
              liverpool@rootsrestaurants.co.uk
            </a>
          </p>
        </motion.div>

        <motion.div
          className="mt-16 overflow-hidden rounded-xl border border-white/10 bg-charcoal/40"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <iframe
            src="https://maps.google.com/maps?q=518+Hyde+Road,+Gorton,+Manchester+M18+7AA&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Roots Manchester — 518 Hyde Road, Gorton"
            className="block"
          />
        </motion.div>
      </div>
    </main>
  );
}
