"use client";

import Link from "next/link";
import { useTransform, motion } from "framer-motion";
import { useScrollProgress } from "./ChipScroll";

const SECTIONS = [
  {
    progress: 0,
    title: "A Taste of Culture. A Home of Flavour.",
    subtitle:
      "Experience bold Caribbean-inspired cuisine, handcrafted cocktails, and unforgettable hospitality.",
    cta: true,
  },
  {
    progress: 0.3,
    title: "Where Tradition Meets Modern Dining.",
    cta: false,
  },
  {
    progress: 0.6,
    title: "More Than a Meal — It's an Experience.",
    cta: false,
  },
  {
    progress: 0.9,
    title: "Ready to Join Us?",
    subtitle: "Reserve your table.",
    cta: false,
  },
] as const;

function SectionOpacity({ at, children }: { at: number; children: React.ReactNode }) {
  const { scrollYProgress } = useScrollProgress();
  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, at - 0.12),
      at - 0.02,
      at,
      at + 0.02,
      Math.min(1, at + 0.12),
    ],
    [0, 0.4, 1, 0.4, 0]
  );
  const y = useTransform(scrollYProgress, [at - 0.08, at, at + 0.08], [12, 0, -12]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  );
}

export default function StoryOverlays() {
  return (
    <>
      {SECTIONS.map((section, i) => (
        <SectionOpacity key={i} at={section.progress}>
          <div className={section.cta ? "pointer-events-auto" : "pointer-events-none"}>
            {"subtitle" in section && section.subtitle ? (
              <>
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-white/92 min-[480px]:text-5xl md:text-6xl lg:text-7xl">
                  {section.title}
                </h1>
                <p className="mt-3 text-lg tracking-tight text-white/75 min-[480px]:text-xl md:text-2xl">
                  {section.subtitle}
                </p>
                {section.cta && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link
                      href="/reservations"
                      className="rounded-full bg-bronze px-8 py-3.5 font-semibold text-white transition hover:bg-bronze-light"
                    >
                      Book a Table
                    </Link>
                    <Link
                      href="/restaurants"
                      className="rounded-full border border-white/40 px-8 py-3.5 font-semibold text-white/90 transition hover:bg-white/10"
                    >
                      View Menu
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-white/92 min-[480px]:text-4xl md:text-5xl lg:text-6xl">
                {section.title}
              </h2>
            )}
          </div>
        </SectionOpacity>
      ))}
    </>
  );
}
