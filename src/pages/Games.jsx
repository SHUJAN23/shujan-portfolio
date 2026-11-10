import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/layout/Container";
import projectsData from "../data/projects.json";

// ── Category definitions ──────────────────────────────────────────────────────
// bg images use real project thumbnails that already exist on disk.

const CATEGORIES = [
  {
    id: "Environment Art",
    title: "Environment Art",
    description: "I create real-time environments.",
    skills: ["Landscape", "Foliage", "Lighting", "Composition"],
    // Ruins thumbnail — a strong environment hero shot
    bgImage: "/assets/images/Projects/Ruins1/Shot1.png",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17l4-8 4 4 3-5 4 9H3z" />
        <path d="M3 20h18" />
      </svg>
    ),
  },
  {
    id: "Game Development",
    title: "Games",
    description: "I connect assets and systems to create playable experiences.",
    skills: ["Gameplay", "C#", "Physics", "AI"],
    // Scrap Wars thumbnail — an actual game screenshot
    bgImage: "/assets/images/models/ScrapWars.png",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path d="M12 10v4M10 12h4" />
        <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="10" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

// ── Animation variants ─────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Projects() {
  // null = landing (no category selected yet)
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filtered = useMemo(
    () =>
      selectedCategory
        ? projectsData.filter((p) => p.category === selectedCategory)
        : [],
    [selectedCategory]
  );

  const otherCategory = CATEGORIES.find((c) => c.id !== selectedCategory);

  return (
    <div className="min-h-screen pb-24">
      <Container>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-12 pb-10 border-b border-[rgba(225,220,201,0.07)]"
        >
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#E1DCC9]/35 font-[Inter]">
            Projects
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#E1DCC9] font-[Space_Grotesk] mt-2 leading-tight">
            Projects &amp; Creative Work
          </h1>
          <p className="text-base text-[#E1DCC9]/50 font-[Inter] mt-3 max-w-[52ch] leading-[1.75]">
            A collection of my environment art, 3D assets and game development work.
          </p>
        </motion.div>

        {/* ── Category cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = projectsData.filter((p) => p.category === cat.id).length;
            return (
              <CategoryCard
                key={cat.id}
                cat={cat}
                isActive={isActive}
                count={count}
                onClick={() =>
                  setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))
                }
              />
            );
          })}
        </motion.div>

        {/* ── Selected category section ── */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Section header row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[rgba(225,220,201,0.07)]">
                <div className="flex items-center gap-3">
                  {/* Category icon (amber tinted) */}
                  <span className="text-amber-400/80">
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.icon}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#E1DCC9] font-[Space_Grotesk]">
                    {selectedCategory}
                  </h2>
                  <span className="text-sm text-[#E1DCC9]/30 font-[Inter]">
                    {filtered.length} {filtered.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Switch to the other category */}
                  {otherCategory && (
                    <button
                      onClick={() => setSelectedCategory(otherCategory.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium font-[Inter] border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/50 hover:border-[rgba(225,220,201,0.35)] hover:text-[#E1DCC9] transition-all duration-200 cursor-pointer"
                    >
                      <span className="scale-75 opacity-70">
                        {otherCategory.icon}
                      </span>
                      View {otherCategory.title}
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Back to landing */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium font-[Inter] text-[#E1DCC9]/30 hover:text-[#E1DCC9]/60 transition-colors duration-200 cursor-pointer"
                    aria-label="Deselect category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Clear
                  </button>
                </div>
              </div>

              {/* Project grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8"
              >
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Landing prompt (no category selected) ── */}
        <AnimatePresence>
          {!selectedCategory && (
            <motion.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="text-center text-sm text-[#E1DCC9]/20 font-[Inter] pb-10 mt-2"
            >
              Select a category above to explore projects.
            </motion.p>
          )}
        </AnimatePresence>

      </Container>
    </div>
  );
}

// ── CategoryCard ──────────────────────────────────────────────────────────────

function CategoryCard({ cat, isActive, count, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      initial="rest"
      animate="rest"
      aria-pressed={isActive}
      className={`group relative text-left rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
        isActive
          ? "ring-2 ring-amber-400/70 shadow-[0_0_40px_rgba(251,191,36,0.12)]"
          : "ring-1 ring-[rgba(225,220,201,0.1)] hover:ring-[rgba(225,220,201,0.25)]"
      }`}
      style={{ minHeight: "200px" }}
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={cat.bgImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Gradient overlay — always dark, deepens on active */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isActive
            ? "opacity-90"
            : "opacity-85 group-hover:opacity-80"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(15,10,5,0.70) 55%, rgba(0,0,0,0.60) 100%)",
        }}
      />

      {/* Amber left accent bar on active */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "linear-gradient(to bottom, #f59e0b, #d97706)" }}
      />

      {/* Card content */}
      <div className="relative z-10 p-6 flex flex-col h-full" style={{ minHeight: "200px" }}>
        {/* Top row: icon + title + count */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`transition-colors duration-200 ${
                isActive ? "text-amber-400" : "text-[#E1DCC9]/55 group-hover:text-[#E1DCC9]/80"
              }`}
            >
              {cat.icon}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-tight">
              {cat.title}
            </h3>
          </div>
          {/* Project count badge */}
          <span className="shrink-0 mt-0.5 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/35 font-[Inter]">
            {count}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[#E1DCC9]/55 font-[Inter] leading-relaxed mb-4">
          {cat.description}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {cat.skills.map((s) => (
            <span
              key={s}
              className={`text-[11px] px-2.5 py-1 rounded-md border font-[Inter] transition-colors duration-200 ${
                isActive
                  ? "border-amber-400/25 text-amber-300/70 bg-amber-400/5"
                  : "border-[rgba(225,220,201,0.1)] text-[#E1DCC9]/35 group-hover:border-[rgba(225,220,201,0.18)] group-hover:text-[#E1DCC9]/50"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow — bottom right */}
      <div
        className={`absolute bottom-5 right-5 w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${
          isActive
            ? "bg-amber-400/15 border-amber-400/40 text-amber-400"
            : "bg-[#000]/40 border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/40 group-hover:border-[rgba(225,220,201,0.35)] group-hover:text-[#E1DCC9]/75"
        }`}
      >
        <motion.span
          variants={{ rest: { x: 0 }, hover: { x: 2 } }}
          transition={{ duration: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.span>
      </div>
    </motion.button>
  );
}

// ── ProjectCard ───────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        to={`/games/${project.id}`}
        aria-label={`View ${project.title} project`}
        className="group block bg-[#1F150C] border border-[rgba(225,220,201,0.1)] rounded-2xl overflow-hidden hover:border-[rgba(225,220,201,0.28)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-[#412D15]/20" style={{ height: "200px" }}>
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={`${project.title} screenshot`}
              loading="eager"
              decoding="sync"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold text-[#E1DCC9]/10 font-[Space_Grotesk]">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#000000]/80 text-[#E1DCC9]/70 border border-[rgba(225,220,201,0.15)] rounded-md font-[Inter] backdrop-blur-sm">
            {project.category}
          </span>

          {/* WIP badge */}
          {project.status === "wip" && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold bg-amber-500/20 text-amber-400/80 border border-amber-500/20 rounded-md font-[Inter] backdrop-blur-sm">
              WIP
            </span>
          )}

          {/* Arrow on hover */}
          <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#000000]/70 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-snug group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-[#E1DCC9]/35 font-[Inter] mt-1">
            {project.engine}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
