import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/layout/Container";
import SectionTitle from "../components/common/SectionTitle";
import GameCard from "../components/game/GameCard";
import GameVideo from "../components/game/GameVideo";
import { getBreakdownIcon } from "../utils/breakdownIcons";
import gamesData from "../data/games.json";

// ── Animation helpers ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Games() {
  return (
    <div className="min-h-screen pt-8 pb-20">
      <Container>
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionTitle
            label="Portfolio"
            title="Games"
            subtitle={`${gamesData.length} project${gamesData.length !== 1 ? "s" : ""} — from concept to playable experience.`}
          />
        </motion.div>

        {/* One full section per project */}
        <div className="flex flex-col gap-24">
          {gamesData.map((game, index) => (
            <ProjectSection key={game.id} game={game} index={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}

// ── ProjectSection — card + video + breakdown for one game ────────────────────

const ProjectSection = memo(function ProjectSection({ game, index }) {
  const hasVideo     = Boolean(game.video?.youtubeId || game.video?.url);
  const hasBreakdown = game.breakdown?.length > 0;

  return (
    <motion.div
      id={game.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="flex flex-col gap-8 scroll-mt-24"
    >
      {/* ── Project number label ── */}
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <span className="text-xs font-mono text-[#E1DCC9]/20 tracking-[0.2em]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 h-px bg-[rgba(225,220,201,0.08)]" />
      </motion.div>

      {/* ── Game card (full width) ── */}
      <motion.div variants={fadeUp}>
        <GameCard game={game} featured={false} />
      </motion.div>

      {/* ── Video + Breakdown side by side on lg ── */}
      {(hasVideo || hasBreakdown) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Video — left column */}
          {hasVideo ? (
            <motion.div variants={fadeUp}>
              <GameVideo game={game} />
            </motion.div>
          ) : (
            /* Empty spacer so breakdown stays right-aligned when no video */
            <div />
          )}

          {/* Breakdown accordion — right column */}
          {hasBreakdown && (
            <motion.div variants={fadeUp}>
              <BreakdownPanel breakdown={game.breakdown} />
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
});

// ── BreakdownPanel — self-contained accordion ─────────────────────────────────

const BreakdownPanel = memo(function BreakdownPanel({ breakdown }) {
  const [openItem, setOpenItem] = useState(null);

  const handleToggle = useCallback(
    (id) => setOpenItem((prev) => (prev === id ? null : id)),
    []
  );

  return (
    <div
      className="flex flex-col gap-2 h-full"
      aria-label="Technical breakdown"
    >
      {/* Panel heading */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-4 rounded-full bg-[rgba(225,220,201,0.2)]" aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#E1DCC9]/30 font-[Inter]">
          Behind the Build
        </p>
      </div>

      {breakdown.map((item, index) => (
        <BreakdownItem
          key={item.id}
          item={item}
          index={index}
          isOpen={openItem === item.id}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
});

// ── BreakdownItem — single accordion row ──────────────────────────────────────

const BreakdownItem = memo(function BreakdownItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        border rounded-xl overflow-hidden transition-colors duration-200
        ${isOpen
          ? "border-[rgba(225,220,201,0.22)] bg-[#1F150C]"
          : "border-[rgba(225,220,201,0.09)] bg-[#1F150C]/50 hover:border-[rgba(225,220,201,0.16)]"
        }
      `}
    >
      {/* Header */}
      <button
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        aria-controls={`bp-panel-${item.id}`}
        id={`bp-trigger-${item.id}`}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer group"
      >
        {/* Icon */}
        <span
          className={`
            flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border
            transition-colors duration-200
            ${isOpen
              ? "bg-[#412D15]/60 border-[rgba(225,220,201,0.18)] text-[#E1DCC9]/75"
              : "bg-[#412D15]/20 border-[rgba(225,220,201,0.07)] text-[#E1DCC9]/30 group-hover:text-[#E1DCC9]/55"
            }
          `}
        >
          {getBreakdownIcon(item.icon)}
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold font-[Space_Grotesk] transition-colors ${
            isOpen ? "text-[#E1DCC9]" : "text-[#E1DCC9]/65"
          }`}>
            {item.label}
          </p>
          {!isOpen && (
            <p className="text-xs text-[#E1DCC9]/30 font-[Inter] truncate mt-0.5">
              {item.summary}
            </p>
          )}
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 transition-colors ${isOpen ? "text-[#E1DCC9]/50" : "text-[#E1DCC9]/15"}`}
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`bp-panel-${item.id}`}
            role="region"
            aria-labelledby={`bp-trigger-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="w-full h-px bg-[rgba(225,220,201,0.07)] mb-3" />
              <p className="text-sm text-[#E1DCC9]/50 font-[Inter] leading-relaxed">
                {item.details}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
