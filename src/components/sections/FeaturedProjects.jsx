import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";
import GameCard from "../game/GameCard";
import gamesData from "../../data/games.json";

const featuredGames = gamesData.filter((g) => g.featured);

// Stagger container
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturedProjects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-20 lg:py-32 bg-[#000000]"
    >
      <Container>
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <SectionTitle
              label="Selected Work"
              title="Featured Projects"
              subtitle="Games I've built — from concept to playable experience."
              align="left"
            />
          </motion.div>

          {/* View all link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Link
              to="/games"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#E1DCC9]/50 hover:text-[#E1DCC9] transition-colors font-[Inter] group"
            >
              View all projects
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
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Cards grid — uniform size, 2-col on lg */}
        {featuredGames.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {featuredGames.map((game) => (
              <motion.div key={game.id} variants={itemVariants}>
                <GameCard game={game} featured={false} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[rgba(225,220,201,0.1)] rounded-2xl gap-4">
      <span className="text-[#E1DCC9]/20 text-4xl" aria-hidden="true">
        ⬡
      </span>
      <p className="text-sm text-[#E1DCC9]/30 font-[Inter] tracking-wide">
        No featured projects yet
      </p>
    </div>
  );
}
