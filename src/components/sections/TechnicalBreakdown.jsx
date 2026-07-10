import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";
import { getBreakdownIcon } from "../../utils/breakdownIcons";
import gamesData from "../../data/games.json";

// Only games that have breakdown data
const gamesWithBreakdown = gamesData.filter(
  (g) => g.breakdown?.length > 0
);

export default function TechnicalBreakdown() {
  // Track which game tab is active and which accordion item is open
  const [activeGame, setActiveGame] = useState(gamesWithBreakdown[0]?.id ?? null);
  const [openItem, setOpenItem] = useState(null);

  const currentGame = gamesWithBreakdown.find((g) => g.id === activeGame);

  const handleTabChange = useCallback((id) => {
    setActiveGame(id);
    setOpenItem(null); // collapse accordion when switching tabs
  }, []);

  const handleToggle = useCallback((id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  }, []);

  if (gamesWithBreakdown.length === 0) return null;

  return (
    <section
      id="behind-the-build"
      aria-labelledby="breakdown-heading"
      className="py-20 lg:py-32 bg-[#000000]"
    >
      {/* Section divider */}
      <div
        aria-hidden="true"
        className="w-full border-t border-[rgba(225,220,201,0.06)] mb-20 lg:mb-32"
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionTitle
            label="Behind the Build"
            title="Technical Breakdown"
            subtitle="The systems, decisions, and trade-offs behind each project."
            align="left"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
        >
          {/* ── Left: Project tabs ── */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 lg:w-56 flex-shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {gamesWithBreakdown.map((game) => (
              <GameTab
                key={game.id}
                game={game}
                isActive={activeGame === game.id}
                onClick={handleTabChange}
              />
            ))}
          </div>

          {/* ── Right: Accordion ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {currentGame && (
                <motion.div
                  key={currentGame.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col gap-3"
                  role="list"
                  aria-label={`Technical breakdown for ${currentGame.title}`}
                >
                  {currentGame.breakdown.map((item, index) => (
                    <AccordionItem
                      key={item.id}
                      item={item}
                      index={index}
                      isOpen={openItem === item.id}
                      onToggle={handleToggle}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

const GameTab = memo(function GameTab({ game, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(game.id)}
      aria-pressed={isActive}
      className={`
        relative flex-shrink-0 px-4 py-3 rounded-xl text-left text-sm font-medium font-[Inter]
        border transition-all duration-200 cursor-pointer
        lg:w-full
        ${
          isActive
            ? "bg-[#1F150C] border-[rgba(225,220,201,0.3)] text-[#E1DCC9]"
            : "border-[rgba(225,220,201,0.08)] text-[#E1DCC9]/40 hover:text-[#E1DCC9]/70 hover:border-[rgba(225,220,201,0.15)]"
        }
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.span
          layoutId="activeTabBar"
          className="absolute left-0 top-3 bottom-3 w-0.5 bg-[#E1DCC9]/60 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="pl-1">{game.title}</span>
      <span className="block text-[10px] font-normal text-[#E1DCC9]/25 mt-0.5 pl-1 font-[Inter]">
        {game.breakdown.length} systems
      </span>
    </button>
  );
});

const AccordionItem = memo(function AccordionItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`
        border rounded-xl overflow-hidden transition-colors duration-200
        ${isOpen
          ? "border-[rgba(225,220,201,0.25)] bg-[#1F150C]"
          : "border-[rgba(225,220,201,0.1)] bg-[#1F150C]/40 hover:border-[rgba(225,220,201,0.18)]"
        }
      `}
    >
      {/* Accordion header */}
      <button
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        aria-controls={`breakdown-panel-${item.id}`}
        id={`breakdown-trigger-${item.id}`}
        className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer group"
      >
        {/* Icon */}
        <span
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
            border transition-colors duration-200
            ${isOpen
              ? "bg-[#412D15]/60 border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/80"
              : "bg-[#412D15]/20 border-[rgba(225,220,201,0.08)] text-[#E1DCC9]/35 group-hover:text-[#E1DCC9]/60"
            }
          `}
        >
          {getBreakdownIcon(item.icon)}
        </span>

        {/* Label + summary */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold font-[Space_Grotesk] transition-colors ${isOpen ? "text-[#E1DCC9]" : "text-[#E1DCC9]/70"}`}>
            {item.label}
          </p>
          {!isOpen && (
            <p className="text-xs text-[#E1DCC9]/35 font-[Inter] mt-0.5 truncate">
              {item.summary}
            </p>
          )}
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`flex-shrink-0 transition-colors ${isOpen ? "text-[#E1DCC9]/60" : "text-[#E1DCC9]/20"}`}
          aria-hidden="true"
        >
          <ChevronIcon />
        </motion.span>
      </button>

      {/* Accordion panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`breakdown-panel-${item.id}`}
            role="region"
            aria-labelledby={`breakdown-trigger-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              {/* Divider */}
              <div className="w-full h-px bg-[rgba(225,220,201,0.08)] mb-4" />
              <p className="text-sm text-[#E1DCC9]/55 font-[Inter] leading-relaxed">
                {item.details}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
