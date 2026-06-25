import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Container from "../components/layout/Container";
import SectionTitle from "../components/common/SectionTitle";
import GameCard from "../components/game/GameCard";
import GameVideo from "../components/game/GameVideo";
import gamesData from "../data/games.json";

// Collect unique engines from data
const allEngines = ["All", ...new Set(gamesData.map((g) => g.engine))];
const videoGames = gamesData.filter((g) => g.video);

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Games() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return gamesData;
    return gamesData.filter((g) => g.engine === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Container>
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionTitle
            label="Portfolio"
            title="Games"
            subtitle={`${gamesData.length} project${gamesData.length !== 1 ? "s" : ""} built across game development and interactive experiences.`}
          />
        </motion.div>

        {/* Engine filter pills */}
        {allEngines.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-10"
            role="group"
            aria-label="Filter by engine"
          >
            {allEngines.map((engine) => (
              <button
                key={engine}
                onClick={() => setActiveFilter(engine)}
                aria-pressed={activeFilter === engine}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium font-[Inter] border transition-all duration-200 cursor-pointer
                  ${
                    activeFilter === engine
                      ? "bg-[#E1DCC9] text-[#000000] border-[#E1DCC9]"
                      : "text-[#E1DCC9]/50 border-[rgba(225,220,201,0.15)] hover:border-[rgba(225,220,201,0.35)] hover:text-[#E1DCC9]"
                  }
                `}
              >
                {engine}
              </button>
            ))}
          </motion.div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-[rgba(225,220,201,0.08)] mb-10" />

        {/* Project cards */}
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-[#E1DCC9]/30 text-sm font-[Inter]">
            No projects found for this filter.
          </div>
        ) : (
          <motion.div
            key={activeFilter}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filtered.map((game) => (
              <motion.div key={game.id} variants={itemVariants}>
                <GameCard game={game} featured={false} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Gameplay videos — only shown if any game has video data */}
        {videoGames.length > 0 && (
          <div className="mt-24">
            <div className="w-full h-px bg-[rgba(225,220,201,0.08)] mb-12" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <SectionTitle
                label="Gameplay Showcase"
                title="In Action"
                subtitle="Hover to preview. Click for full playback controls."
              />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoGames.map((game) => (
                <GameVideo key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
