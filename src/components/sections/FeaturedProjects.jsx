import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "../layout/Container";

// ── Each image's fixed position in the scattered layout ──────────────────────
// x/y are offsets from the viewport center in px, rotate in deg
const CARDS = [
  {
    id: "demolition-derby-survival",
    name: "Scrap Wars",
    engine: "Unity 3D",
    src: "/assets/images/models/ScrapWars.png",
    href: "/games#demolition-derby-survival",
    // top-left quadrant — large hero image
    style: { left: "4%",  top: "6%",  width: "28vw", rotate: "-4deg", zIndex: 3 },
  },
  {
    id: "hell-drive",
    name: "Hell Drive",
    engine: "Unity 3D",
    src: "/assets/images/models/HellDrive.png",
    href: "/games#hell-drive",
    // top-right
    style: { right: "5%", top: "4%",  width: "24vw", rotate: "5deg",  zIndex: 2 },
  },
  {
    id: "airborne-bling",
    name: "Airborne Bling",
    engine: "Three.js",
    src: "/assets/images/models/Abb1.png",
    href: "/games#airborne-bling",
    // bottom-left
    style: { left: "6%",  bottom: "6%", width: "22vw", rotate: "3deg",  zIndex: 2 },
  },
  {
    id: "clash-of-champions",
    name: "Clash of Champions",
    engine: "Python / Pygame",
    src: "/assets/images/models/COC.png",
    href: "/games#clash-of-champions",
    // bottom-right
    style: { right: "4%", bottom: "4%", width: "26vw", rotate: "-3deg", zIndex: 3 },
  },
];

export default function FeaturedProjects() {
  const sectionRef = useRef(null);

  // Parallax spring values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 50, damping: 18 });
  const py = useSpring(rawY, { stiffness: 50, damping: 18 });

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left - rect.width  / 2) / rect.width  * 24);
    rawY.set((e.clientY - rect.top  - rect.height / 2) / rect.height * 16);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <>
      {/* ── DESKTOP scattered composition ── */}
      <section
        id="projects"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-labelledby="projects-heading"
        className="hidden lg:block relative bg-[#000000] overflow-hidden select-none"
        style={{ height: "100vh", minHeight: "640px", maxHeight: "900px" }}
      >
        {/* Atmospheric glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(65,45,21,0.22) 0%, transparent 70%)",
          }}
        />

        {/* Scattered images */}
        {CARDS.map((card, i) => (
          <ScatteredCard
            key={card.id}
            card={card}
            index={i}
            px={px}
            py={py}
          />
        ))}

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          {/* Small label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#E1DCC9]/35 font-[Inter] mb-4"
          >
            Selected Work
          </motion.p>

          {/* Giant heading */}
          <motion.h2
            id="projects-heading"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-[Space_Grotesk] font-bold text-[#E1DCC9] text-center leading-none tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
          >
            Featured
            <br />
            Projects
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-[#E1DCC9]/35 font-[Inter] mt-4 text-center"
          >
            Games &amp; interactive experiences
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 pointer-events-auto"
          >
            <Link
              to="/games"
              aria-label="Explore all my game projects"
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#E1DCC9] text-[#000000] text-sm font-bold font-[Inter] tracking-[0.06em] uppercase shadow-[0_0_40px_rgba(225,220,201,0.12)] hover:bg-white hover:shadow-[0_0_60px_rgba(225,220,201,0.25)] transition-all duration-300"
            >
              Explore My Games
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="group-hover:translate-x-1 transition-transform duration-200">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE layout ── */}
      <section
        id="projects-mobile"
        aria-labelledby="projects-heading-mobile"
        className="lg:hidden bg-[#000000] py-20"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#E1DCC9]/35 font-[Inter]">
              Selected Work
            </span>
            <h2
              id="projects-heading-mobile"
              className="text-3xl font-bold text-[#E1DCC9] font-[Space_Grotesk] mt-2"
            >
              Featured Projects
            </h2>
          </motion.div>

          {/* 2-col grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link
                  to={card.href}
                  aria-label={`View ${card.name}`}
                  className="group block relative overflow-hidden rounded-xl"
                >
                  <div className="aspect-video">
                    <img
                      src={card.src}
                      alt={`${card.name} screenshot`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <p className="absolute bottom-2 left-2.5 text-[11px] font-semibold text-[#E1DCC9]/90 font-[Space_Grotesk] leading-snug">
                      {card.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="flex justify-center">
            <Link to="/games" className="btn btn-primary btn-lg group">
              Explore My Games
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

// ── ScatteredCard ─────────────────────────────────────────────────────────────

function ScatteredCard({ card, index, px, py }) {
  const depth = 0.3 + index * 0.15; // each card moves at different parallax depth

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: parseFloat(card.style.rotate) * 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: 0.1 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: "absolute",
        zIndex: card.style.zIndex,
        width: card.style.width,
        ...(card.style.left   !== undefined && { left:   card.style.left }),
        ...(card.style.right  !== undefined && { right:  card.style.right }),
        ...(card.style.top    !== undefined && { top:    card.style.top }),
        ...(card.style.bottom !== undefined && { bottom: card.style.bottom }),
        x: useParallaxValue(px, depth),
        y: useParallaxValue(py, depth),
      }}
    >
      <Link
        to={card.href}
        aria-label={`View ${card.name} project`}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(225,220,201,0.5)] rounded-xl"
      >
        <motion.div
          style={{ rotate: card.style.rotate }}
          whileHover={{ rotate: "0deg", scale: 1.06, zIndex: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.7)]"
        >
          {/* Aspect ratio */}
          <div className="aspect-video">
            <img
              src={card.src}
              alt={`${card.name} screenshot`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
            />
          </div>

          {/* Permanent subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-300" />

          {/* Hover overlay — name + view hint */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-sm font-bold text-[#E1DCC9] font-[Space_Grotesk]">{card.name}</p>
            <p className="text-[10px] text-[#E1DCC9]/50 font-[Inter] mt-0.5 flex items-center justify-between">
              <span>{card.engine}</span>
              <span className="text-[#E1DCC9]/70 tracking-wider uppercase text-[9px]">View →</span>
            </p>
          </div>

          {/* Edge highlight on hover */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(225,220,201,0.18)" }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Small hook to compute parallax transform value
function useParallaxValue(spring, depth) {
  return useTransform(spring, (v) => v * depth);
}
