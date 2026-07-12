import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";
import ModelCard from "../model/ModelCard";
import ModelViewer from "../model/ModelViewer";
import modelsData from "../../data/models.json";

const featuredModels = modelsData.filter((m) => m.featured);

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Showcase() {
  const [activeModel, setActiveModel] = useState(null);

  return (
    <>
      <section
        id="asset-library"
        aria-labelledby="showcase-heading"
        className="py-20 lg:py-32 bg-[#000000]"
      >
        {/* Top divider with label */}
        <div aria-hidden="true" className="w-full border-t border-[rgba(225,220,201,0.06)] mb-20 lg:mb-32" />

        <Container>
          {/* Header row — title only */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionTitle
                label="Asset Library"
                title="3D Models"
                subtitle="Game-ready assets built in Blender — optimized for real-time rendering."
                align="left"
              />
            </motion.div>
          </div>

          {/* Cards grid */}
          {featuredModels.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredModels.map((model) => (
                <motion.div key={model.id} variants={itemVariants}>
                  <ModelCard
                    model={model}
                    onViewModel={setActiveModel}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-32 py-6 flex justify-center"
          >
            <Link
              to="/models"
              className="
                group inline-flex items-center gap-2
                px-6 py-3 rounded-lg
                bg-[#E1DCC9] text-[#000000]
                font-semibold text-sm font-[Inter]
                hover:bg-[#E1DCC9]/80
                transition-all duration-300
              "
            >
              View Full Asset Library
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Viewer modal — outside section so it overlays everything */}
      <AnimatePresence>
        {activeModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ModelViewer
              model={activeModel}
              onClose={() => setActiveModel(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[rgba(225,220,201,0.08)] rounded-2xl gap-4">
      <span className="text-[#E1DCC9]/15 text-4xl" aria-hidden="true">⬡</span>
      <p className="text-sm text-[#E1DCC9]/25 font-[Inter] tracking-wide">
        No featured models yet
      </p>
    </div>
  );
}

