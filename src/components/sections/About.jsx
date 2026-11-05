import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";
// Profile photo served from public/assets — no JS import needed
const profilePhoto = "/assets/images/ShujanDP.jpeg";

// Skills/technologies organized by category
const expertise = [
  {
    category: "Technical Art",
    items: ["Unity", "Unreal Engine", "C# Scripting", "Asset Integration", "Materials & Collider Setup", "Particle Systems"],
  },
  {
    category: "3D & Environment Art",
    items: ["Blender", "Hard-Surface Modeling", "Environment & Prop Modeling", "UV Mapping", "Texturing", "Scene Composition"],
  },
];

// Fade-up animation for stagger effect
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative pt-10 pb-8 lg:pt-14 lg:pb-10 bg-[#000000]"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ── Left: Text Content ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="flex flex-col gap-6"
          >
            {/* Profile Photo */}
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
              <div className="relative">

                {/* Rotating dashed ring — outermost */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-full border border-dashed border-[rgba(225,220,201,0.15)] animate-spin-slow"
                />

                {/* Static gradient ring */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-[6px] rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(225,220,201,0.5), rgba(65,45,21,0.8), rgba(225,220,201,0.1), rgba(65,45,21,0.6), rgba(225,220,201,0.5))",
                    padding: "1.5px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />

                {/* Warm glow bloom */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-full opacity-50 blur-xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(65,45,21,0.9) 0%, rgba(31,21,12,0.5) 60%, transparent 100%)",
                  }}
                />

                {/* Photo */}
                <div className="relative w-52 h-52 rounded-full overflow-hidden ring-2 ring-[rgba(225,220,201,0.2)] ring-offset-2 ring-offset-[#000000]">
                  <img
                    src={profilePhoto}
                    alt="Shujan — Unity Game Developer & Technical Artist"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top scale-105"
                  />
                  {/* Subtle vignette over photo */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.35) 100%)",
                    }}
                  />
                </div>

                {/* Status dot — available for work */}
                <span className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#000000]/80 border border-[rgba(225,220,201,0.15)] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-[#E1DCC9]/60 font-[Inter] tracking-wide">
                    {/* Available */}
                  </span>
                </span>

              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <SectionTitle
                label="Introduction"
                title="About Me"
                align="left"
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-4 text-base text-[#E1DCC9]/60 font-[Inter] leading-relaxed"
            >
              <p>
                I'm an <strong className="text-[#E1DCC9]/80">MCA graduate</strong> and 
                aspiring <strong className="text-[#E1DCC9]/80">Technical Artist</strong> passionate 
                about game development. I'm interested in bridging the gap between art and 
                engineering to create optimized, visually compelling interactive experiences.
              </p>

              <p>
                My journey started with <strong className="text-[#E1DCC9]/80">Unity</strong> and{" "}
                <strong className="text-[#E1DCC9]/80">C#</strong>, and I later expanded into{" "}
                <strong className="text-[#E1DCC9]/80">3D art</strong> with Blender, where I create 
                game-ready assets and integrate them into game engines.
              </p>

             
            </motion.div>

            {/* CTA removed — already on About page */}
          </motion.div>

          {/* ── Right: Expertise Grid ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {expertise.map((category) => (
              <motion.div
                key={category.category}
                variants={fadeUp}
                className="bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-xl p-6 hover:border-[rgba(225,220,201,0.3)] transition-colors"
              >
                <h3 className="text-sm font-semibold tracking-[0.1em] uppercase text-[#E1DCC9]/40 mb-4 font-[Inter]">
                  {category.category}
                </h3>
                <ul className="flex flex-col gap-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-[#E1DCC9]/70 font-[Inter]"
                    >
                      <span
                        aria-hidden="true"
                        className="w-1 h-1 rounded-full bg-[#E1DCC9]/40 flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
