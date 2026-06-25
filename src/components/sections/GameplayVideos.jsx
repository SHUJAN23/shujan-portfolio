import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";
import GameVideo from "../game/GameVideo";
import gamesData from "../../data/games.json";

// Only show games that have a video object defined
const videoGames = gamesData.filter((g) => g.video);

export default function GameplayVideos() {
  if (videoGames.length === 0) return null;

  return (
    <section
      id="gameplay"
      aria-labelledby="gameplay-heading"
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
            label="Gameplay Showcase"
            title="In Action"
            subtitle="Hover a card to preview. Click for full playback controls."
            align="left"
          />
        </motion.div>

        {/* Video cards grid — 2-col on md+, staggered by intersection in each card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoGames.map((game) => (
            <GameVideo key={game.id} game={game} />
          ))}
        </div>

        {/* Cloudinary note — subtle attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-[10px] text-[#E1DCC9]/15 font-[Inter] tracking-wide"
        >
          Videos hosted on Cloudinary · Loaded on demand
        </motion.p>
      </Container>
    </section>
  );
}
