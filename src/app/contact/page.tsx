"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-bg pt-24 pb-16">
      <div className="mx-auto max-w-xl px-4 md:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl font-semibold text-white/92 md:text-5xl">
            Get in Touch
          </h1>
        </motion.div>

        <motion.div
          className="mt-12 rounded-xl border border-white/10 bg-surface/80 p-6 md:p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {sent ? (
            <p className="text-center text-white/80">Thank you. We&apos;ll get back to you soon.</p>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white/70">Name</span>
                <input
                  type="text"
                  required
                  className="w-full rounded border border-white/20 bg-charcoal/60 px-4 py-3 text-white placeholder:text-white/40 focus:border-bronze focus:outline-none"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white/70">Email</span>
                <input
                  type="email"
                  required
                  className="w-full rounded border border-white/20 bg-charcoal/60 px-4 py-3 text-white placeholder:text-white/40 focus:border-bronze focus:outline-none"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white/70">Phone</span>
                <input
                  type="tel"
                  className="w-full rounded border border-white/20 bg-charcoal/60 px-4 py-3 text-white placeholder:text-white/40 focus:border-bronze focus:outline-none"
                  placeholder="+44"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white/70">Message</span>
                <textarea
                  required
                  rows={5}
                  className="w-full rounded border border-white/20 bg-charcoal/60 px-4 py-3 text-white placeholder:text-white/40 focus:border-bronze focus:outline-none resize-none"
                  placeholder="How can we help?"
                />
              </label>
              <button
                type="submit"
                className="mt-2 rounded-full bg-bronze px-6 py-4 font-semibold text-white transition hover:bg-bronze-light"
              >
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}
