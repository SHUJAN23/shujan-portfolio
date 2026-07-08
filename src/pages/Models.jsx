import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/layout/Container";
import SectionTitle from "../components/common/SectionTitle";
import ModelCard from "../components/model/ModelCard";
import ModelViewer from "../components/model/ModelViewer";
import modelsData from "../data/models.json";

// Collect unique categories from data
const allCategories = ["All", ...new Set(modelsData.map((m) => m.category))];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Models() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeModel, setActiveModel] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return modelsData;
    return modelsData.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <div style={{ paddingTop: "96px" }} className="min-h-screen pb-20">
        <Container>
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <SectionTitle
              label="Asset Library"
              title="3D Models"
              subtitle={`${modelsData.length} asset${modelsData.length !== 1 ? "s" : ""} — game-ready models built in Blender with optimized topology and PBR materials.`}
            />
          </motion.div>

          {/* Category filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-4"
            role="group"
            aria-label="Filter by category"
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium font-[Inter] border transition-all duration-200 cursor-pointer
                  ${
                    activeCategory === cat
                      ? "bg-[#E1DCC9] text-[#000000] border-[#E1DCC9]"
                      : "text-[#E1DCC9]/50 border-[rgba(225,220,201,0.15)] hover:border-[rgba(225,220,201,0.35)] hover:text-[#E1DCC9]"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-4 pb-8 border-b border-[rgba(225,220,201,0.08)]"
          >
            <span className="text-xs text-[#E1DCC9]/25 font-[Inter]">
              Showing{" "}
              <span className="text-[#E1DCC9]/50">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "asset" : "assets"}
              {activeCategory !== "All" && (
                <> in <span className="text-[#E1DCC9]/50">{activeCategory}</span></>
              )}
            </span>
          </motion.div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-24 text-[#E1DCC9]/25 text-sm font-[Inter]">
              No models found for this category.
            </div>
          ) : (
            <motion.div
              key={activeCategory}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {filtered.map((model) => (
                <motion.div key={model.id} variants={itemVariants}>
                  <ModelCard
                    model={model}
                    onViewModel={setActiveModel}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </Container>
      </div>

      {/* Viewer modal */}
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
