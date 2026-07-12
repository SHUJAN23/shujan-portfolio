import { motion } from "framer-motion";
import Button from "../common/Button";
import HeroCanvas from "./HeroCanvas";

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Roles that define the hero tagline
const roles = ["Unity Game Developer", "Technical Artist", "3D Artist"];

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Hero section"
      className="relative min-h-[calc(100vh-4rem)] w-full flex items-center overflow-hidden"
    >
      {/* Subtle background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(225,220,201,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,220,201,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial glow — bottom right (R3F scene side) */}
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 80%, rgba(65,45,21,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Radial glow — top left (content side) */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(31,21,12,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-4rem)] py-12">
          {/* ── Left: Text Content ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Label */}
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#E1DCC9]/40 font-[Inter]"
            >
              <span
                aria-hidden="true"
                className="w-8 h-px bg-[rgba(225,220,201,0.3)]"
              />
              Available for Work
            </motion.span>

            {/* Heading */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-[1.05] tracking-tight">
                Hi, I'm{" "}
                <span className="text-[#E1DCC9]">Shujan</span>
              </h1>
            </motion.div>

            {/* Roles */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row sm:flex-wrap gap-2"
            >
              {roles.map((role, i) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-2 text-base text-[#E1DCC9]/70 font-[Inter]"
                >
                  {i !== 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden sm:block w-1 h-1 rounded-full bg-[rgba(225,220,201,0.3)]"
                    />
                  )}
                  {role}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-[#E1DCC9]/50 font-[Inter] leading-relaxed max-w-lg"
            >
              I design and develop interactive 3D game experiences by combining
              gameplay programming in Unity with optimized 3D asset creation in
              Blender.
            </motion.p>

            {/* CTAs — View Projects hidden, only Download Resume shown */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 pt-2"
            >
              {/* <Button as="a" href="/games" variant="primary" size="lg">
                View Projects
                <ArrowRightIcon />
              </Button> */}
              <Button
                as="a"
                href="/SHUJANJul.pdf"
                variant="primary"
                size="lg"
                external
              >
                Download Resume
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              className="flex gap-8 pt-4 border-t border-[rgba(225,220,201,0.1)]"
            >
              {[
                // { value: "3+", label: "Years Experience" },  // uncomment when ready
                // { value: "10+", label: "Projects Built" },   // uncomment when ready
                { value: "Unity", label: "Primary Engine" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#E1DCC9] font-[Space_Grotesk]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#E1DCC9]/40 font-[Inter] tracking-wide">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: R3F Scene ── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="relative h-[260px] sm:h-[340px] lg:h-full lg:min-h-[560px] flex items-center justify-center"
          >
            {/* Scene container — corner accents frame the canvas */}
            <div className="relative w-full h-full min-h-[400px] rounded-2xl border border-[rgba(225,220,201,0.1)] bg-[#1F150C]/20 overflow-hidden">
              {/* Corner accents */}
              <CornerAccent position="top-0 left-0" />
              <CornerAccent position="top-0 right-0" rotate />
              <CornerAccent position="bottom-0 left-0" flipY />
              <CornerAccent position="bottom-0 right-0" rotate flipY />

              {/* R3F canvas — fills the container */}
              <HeroCanvas />

              {/* Inner vignette — keeps edges dark, floats the scene */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#E1DCC9]/20 font-[Inter]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[rgba(225,220,201,0.3)] to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ── Internal sub-components ──────────────────────────────────────────────────

function CornerAccent({ position, rotate = false, flipY = false }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute ${position} w-6 h-6 pointer-events-none`}
      style={{
        transform: `${rotate ? "scaleX(-1)" : ""} ${flipY ? "scaleY(-1)" : ""}`,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 22 L2 2 L22 2"
          stroke="rgba(225,220,201,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
