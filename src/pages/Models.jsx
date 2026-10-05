import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/layout/Container";
import ModelViewer from "../components/model/ModelViewer";
import modelsData from "../data/models.json";

const RAW_CATEGORIES = [...new Set(modelsData.map((m) => m.category))];
const ALL_CATEGORIES = ["All", ...RAW_CATEGORIES];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function Models() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");
  const [activeModel, setActiveModel]       = useState(null);

  const filtered = useMemo(() => {
    let list = modelsData;
    if (activeCategory !== "All") list = list.filter((m) => m.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          (m.title  || "").toLowerCase().includes(q) ||
          (m.category || "").toLowerCase().includes(q) ||
          (m.tags  || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, search]);

  const countFor = (cat) =>
    cat === "All"
      ? modelsData.length
      : modelsData.filter((m) => m.category === cat).length;

  return (
    <>
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
              3D Asset Library
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#E1DCC9] font-[Space_Grotesk] mt-2 leading-tight">
              3D Models
            </h1>
            <p className="text-base text-[#E1DCC9]/50 font-[Inter] mt-3 max-w-[52ch] leading-[1.75]">
              Game-ready assets built in Blender — optimised for real-time rendering.
            </p>
          </motion.div>

          {/* ── Filters + Search row ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 py-6"
          >
            {/* Category pills */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1 flex-1"
              role="group"
              aria-label="Filter by category"
              style={{ scrollbarWidth: "none" }}
            >
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium font-[Inter] border transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#E1DCC9] text-[#000000] border-[#E1DCC9]"
                      : "text-[#E1DCC9]/50 border-[rgba(225,220,201,0.15)] hover:border-[rgba(225,220,201,0.35)] hover:text-[#E1DCC9]"
                  }`}
                >
                  {cat}
                  <span className={`text-[10px] font-mono ${activeCategory === cat ? "text-[#000000]/50" : "text-[#E1DCC9]/25"}`}>
                    {countFor(cat)}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0 sm:w-56">
              <SearchIcon />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                aria-label="Search assets"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#1F150C] border border-[rgba(225,220,201,0.12)] text-sm text-[#E1DCC9]/80 placeholder-[#E1DCC9]/25 font-[Inter] focus:outline-none focus:border-[rgba(225,220,201,0.35)] transition-colors"
              />
            </div>
          </motion.div>

          {/* Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-xs text-[#E1DCC9]/25 font-[Inter] mb-8"
          >
            Showing <span className="text-[#E1DCC9]/50">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "asset" : "assets"}
            {activeCategory !== "All" && <> in <span className="text-[#E1DCC9]/50">{activeCategory}</span></>}
            {search && <> matching <span className="text-[#E1DCC9]/50">"{search}"</span></>}
          </motion.p>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <motion.div
              key={`${activeCategory}-${search}`}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((model) => (
                <motion.div key={model.id} variants={itemVariants}>
                  <AssetCard model={model} onViewModel={setActiveModel} />
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
            <ModelViewer model={activeModel} onClose={() => setActiveModel(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── AssetCard ─────────────────────────────────────────────────────────────────

function AssetCard({ model, onViewModel }) {
  const { title, category, software, tags, polycount, preview, model: modelUrl } = model;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasModel = Boolean(modelUrl);

  return (
    <>
      <article className="group flex flex-col bg-[#0D0D0D] border border-[rgba(225,220,201,0.08)] rounded-2xl overflow-hidden hover:border-[rgba(225,220,201,0.22)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300">

        {/* ── Image ── */}
        <div className="relative aspect-video overflow-hidden bg-[#1A110A] cursor-pointer" onClick={() => setLightboxOpen(true)}>
          {preview ? (
            <img
              src={preview}
              alt={`${title} preview`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <Placeholder title={title} />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Expand icon — always visible, bottom right */}
          {preview && (
            <span className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-[#000000]/60 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/50 backdrop-blur-sm pointer-events-none">
              <ExpandIcon />
            </span>
          )}

          {/* Badges */}
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-[#000000]/80 text-[#E1DCC9]/65 border border-[rgba(225,220,201,0.12)] rounded-md font-[Inter] backdrop-blur-sm">
            {category}
          </span>
          {polycount && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono text-[#E1DCC9]/45 bg-[#000000]/70 border border-[rgba(225,220,201,0.1)] rounded-md backdrop-blur-sm">
              {polycount}
            </span>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 p-5 gap-3">

          {/* Title + software */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-snug min-w-0">
              {title}
            </h3>
            <div className="flex gap-1 flex-shrink-0 mt-0.5">
              {software?.map((sw) => (
                <span key={sw} className="px-2 py-0.5 text-[9px] font-medium text-[#E1DCC9]/35 border border-[rgba(225,220,201,0.08)] rounded font-[Inter] uppercase tracking-wide">
                  {sw}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-[11px] font-medium text-[#E1DCC9]/40 bg-[rgba(225,220,201,0.04)] border border-[rgba(225,220,201,0.08)] rounded-md font-[Inter]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* View Model CTA */}
          {hasModel && (
            <button
              onClick={() => onViewModel?.(model)}
              className="btn btn-outline w-full mt-auto group/btn"
              aria-label={`View 3D model: ${title}`}
            >
              <CubeIcon />
              View Model
              <ArrowIcon />
            </button>
          )}
        </div>
      </article>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} full image`}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setLightboxOpen(false)} aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-w-4xl w-full"
            >
              <button onClick={() => setLightboxOpen(false)} aria-label="Close" className="absolute -top-4 -right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#1F150C] border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.5)] transition-all">
                <CloseIcon />
              </button>
              <img src={preview} alt={`${title} full view`} className="w-full h-auto max-h-[80vh] object-contain rounded-xl border border-[rgba(225,220,201,0.1)]" />
              <p className="mt-3 text-center text-sm text-[#E1DCC9]/45 font-[Inter]">{title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function EmptyState({ search }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-4">
      <span className="text-[#E1DCC9]/10 text-5xl" aria-hidden="true">⬡</span>
      <p className="text-sm text-[#E1DCC9]/30 font-[Inter]">
        {search ? `No assets matching "${search}"` : "No assets found for this category."}
      </p>
    </div>
  );
}

function Placeholder({ title }) {
  const initials = title?.split(" ").slice(0, 2).map((w) => w[0]).join("") ?? "?";
  return (
    <div aria-hidden="true" className="w-full h-full flex items-center justify-center">
      <span className="text-4xl font-bold text-[#E1DCC9]/8 font-[Space_Grotesk] tracking-widest select-none">{initials}</span>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E1DCC9]/25 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-hover/btn:translate-x-1">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
