import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/layout/Container";
import projectsData from "../data/projects.json";

// ── Category definitions ──────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "Environment Art",
    icon: "",
    title: "Environment Art",
    description: "I create real-time environments.",
    skills: ["Landscape", "Foliage", "Lighting", "Composition"],
  },
  {
    id: "Game Development",
    icon: "",
    title: "Game Development",
    description: "I connect assets and systems to create playable experiences.",
    skills: ["Gameplay", "C#", "Physics", "AI"],
    comingSoon: false,
  },
];

const FILTERS = ["All Projects", "Environment Art", "Game Development"];

// ── Animation ─────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filtered = useMemo(() => {
    if (activeFilter === "All Projects") return projectsData;
    return projectsData.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen pb-24">
      <Container>

        {/* ── Header ── */}
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
            Projects & Creative Work
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`group text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                activeFilter === cat.id
                  ? "bg-[#2A1C0E] border-[rgba(225,220,201,0.35)]"
                  : "bg-[#1F150C] border-[rgba(225,220,201,0.1)] hover:border-[rgba(225,220,201,0.25)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="text-base font-bold text-[#E1DCC9] font-[Space_Grotesk]">
                    {cat.title}
                  </h3>
                </div>
                {cat.comingSoon && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(225,220,201,0.08)] text-[#E1DCC9]/40 font-[Inter] tracking-wide uppercase">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-[#E1DCC9]/45 font-[Inter] mb-3">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((s) => (
                  <span key={s} className="text-[11px] px-2.5 py-1 rounded-md border border-[rgba(225,220,201,0.1)] text-[#E1DCC9]/40 font-[Inter]">
                    {s}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </motion.div>

        {/* ── Filter pills ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 pb-8 border-b border-[rgba(225,220,201,0.07)]"
          role="group"
          aria-label="Filter projects"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              aria-pressed={activeFilter === f}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-[Inter] border transition-all duration-200 cursor-pointer ${
                activeFilter === f
                  ? "bg-[#E1DCC9] text-[#000000] border-[#E1DCC9]"
                  : "text-[#E1DCC9]/50 border-[rgba(225,220,201,0.15)] hover:border-[rgba(225,220,201,0.35)] hover:text-[#E1DCC9]"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#E1DCC9]/25 font-mono">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          </span>
        </motion.div>

        {/* ── Project grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <span className="text-5xl text-[#E1DCC9]/10" aria-hidden="true">⬡</span>
              <p className="text-sm text-[#E1DCC9]/30 font-[Inter]">No projects in this category yet.</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8"
            >
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
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
              onError={(e) => console.error("IMG FAILED:", project.thumbnail, e)}
              onLoad={() => console.log("IMG OK:", project.thumbnail)}
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

          {/* Status badge */}
          {project.status === "wip" && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold bg-amber-500/20 text-amber-400/80 border border-amber-500/20 rounded-md font-[Inter] backdrop-blur-sm">
              WIP
            </span>
          )}

          {/* Arrow indicator */}
          <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#000000]/70 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            {project.technologies?.slice(0, 2).map((t) => ` • ${t}`)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
