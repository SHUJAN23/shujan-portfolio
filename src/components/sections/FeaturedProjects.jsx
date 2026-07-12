import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";
import GameCard from "../game/GameCard";
import gamesData from "../../data/games.json";

const featuredGames = gamesData.filter((g) => g.featured);
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
        {/* Header row — title only */}
        <div className="mb-12">
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

        {/* Bottom CTA — impossible to miss after scanning the cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 mb-2 flex justify-center"
        >
          <Link
            to="/games"
            className="
              group inline-flex items-center gap-4
              px-8 py-4 rounded-2xl
              bg-[#1F150C] border border-[rgba(225,220,201,0.15)]
              hover:border-[rgba(225,220,201,0.35)] hover:bg-[#1F150C]/80
              
              transition-all duration-300
            "
          >
            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="text-base font-bold text-[#E1DCC9] font-[Space_Grotesk] tracking-wide">
                View All Projects
              </span>
             
            </div>
            <span className="
              w-9 h-9 rounded-xl
              border border-[rgba(225,220,201,0.5)] text-[#E1DCC9]/60 flex items-center justify-center flex-shrink-0 group-hover:text-[#E1DCC9] group-hover:border-[rgba(225,220,201,0.5)] group-hover:translate-x-1 transition-all duration-300
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </motion.div>
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

