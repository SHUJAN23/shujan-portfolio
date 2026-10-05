import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "../layout/Container";

// ── Showcase slides — curated hero renders ────────────────────────────────────
const SLIDES = [
  { id: 1, label: "Asset Collection",   src: "/assets/images/models/HomePageAssetDisplay.webp" },
  { id: 2, label: "Ambassador Vehicle", src: "/assets/images/models/Ambassdor.webp" },
  { id: 3, label: "Medieval Table",     src: "/assets/images/models/Table.webp" },
  { id: 4, label: "Warplane",           src: "/assets/images/models/Airplane.webp" },
  { id: 5, label: "Child Character",    src: "/assets/images/models/Child.png" },
  { id: 6, label: "Medieval Thick Mug", src: "/assets/images/models/Mug_Thick.webp" },
];

export default function Showcase() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1); // 1 = next, -1 = prev

  const go = useCallback((next) => {
    setDir(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  const prev = useCallback(() => go((current - 1 + SLIDES.length) % SLIDES.length), [current, go]);
  const next = useCallback(() => go((current + 1) % SLIDES.length), [current, go]);

  // Auto-advance every 5s
  useEffect(() => {
    const t = setTimeout(() => next(), 5000);
    return () => clearTimeout(t);
  }, [current, next]);

  const slide = SLIDES[current];

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <section
      id="asset-library"
      aria-label="3D Asset Showcase"
      className="py-20 lg:py-32 bg-[#000000]"
    >
      <div aria-hidden="true" className="w-full border-t border-[rgba(225,220,201,0.06)] mb-20 lg:mb-32" />

      <Container>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#E1DCC9]/35 font-[Inter]">
            Asset Library
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-[1.1] mt-2">
            3D Assets
          </h2>
          <p className="text-base text-[#E1DCC9]/50 font-[Inter] mt-3 max-w-[44ch] leading-[1.75]">
            Game-ready assets crafted in Blender.
          </p>
        </motion.div>

        {/* ── Main image stage ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-[#1F150C] group"
          style={{ aspectRatio: "16/7" }}
        >
          <AnimatePresence custom={dir} mode="wait">
            <motion.img
              key={slide.id}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              src={slide.src}
              alt={slide.label}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
          </AnimatePresence>

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.35) 100%), linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Slide label — bottom left */}
          <div className="absolute bottom-5 left-6 flex items-end gap-3">
            <span className="text-[11px] font-mono text-[#E1DCC9]/30 leading-none">
              {String(current + 1).padStart(2, "0")}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={slide.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold text-[#E1DCC9]/80 font-[Space_Grotesk] tracking-wide uppercase"
              >
                {slide.label}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Arrow buttons — sides */}
          <button
            onClick={prev}
            aria-label="Previous asset"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#000000]/50 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:bg-[#000000]/80 hover:border-[rgba(225,220,201,0.4)] transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            aria-label="Next asset"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#000000]/50 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:bg-[#000000]/80 hover:border-[rgba(225,220,201,0.4)] transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight />
          </button>
        </motion.div>

        {/* ── Navigation bar ── */}
        <div className="mt-5 flex items-center justify-between">

          {/* Dot indicators + counter */}
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-[#E1DCC9]/70"
                      : "w-3 bg-[rgba(225,220,201,0.2)] hover:bg-[rgba(225,220,201,0.4)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-[#E1DCC9]/25 tracking-widest">
              {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          {/* CTA */}
          <Link to="/models" className="btn btn-primary group">
            Explore Asset Library
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </Container>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
