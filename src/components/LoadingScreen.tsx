"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="h-10 w-10 rounded-full border-2 border-bronze/40 border-t-bronze"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-6 text-sm tracking-tight text-white/50">Loading…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
