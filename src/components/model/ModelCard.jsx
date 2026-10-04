import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function ModelCard({ model, onViewModel }) {
  const { title, category, software, tags, polycount, preview, model: modelUrl } = model;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasModel = Boolean(modelUrl);
  // Only show image expand button on non-touch (desktop) devices
  const showImageBtn = Boolean(preview);

  return (
    <>
      <article
        className="
          group relative flex flex-col
          bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-2xl overflow-hidden
          transition-all duration-300
          hover:border-[rgba(225,220,201,0.3)]
          hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
          hover:-translate-y-1
        "
      >
        {/* Preview area */}
        <div className="relative aspect-video bg-[#412D15]/20 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={`${title} preview`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PreviewPlaceholder title={title} />
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-[#000000]/80 text-[#E1DCC9]/70 border border-[rgba(225,220,201,0.15)] rounded-md font-[Inter] backdrop-blur-sm">
            {category}
          </span>

          {/* Polycount badge */}
          {polycount && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono text-[#E1DCC9]/50 bg-[#000000]/70 border border-[rgba(225,220,201,0.1)] rounded-md backdrop-blur-sm">
              {polycount}
            </span>
          )}

          {/* Expand image button — desktop only, shown on hover */}
          {showImageBtn && (
            <button
              onClick={() => setLightboxOpen(true)}
              aria-label={`Expand image: ${title}`}
              className="
                absolute bottom-3 right-3
                hidden md:flex
                w-8 h-8 items-center justify-center
                rounded-lg bg-[#000000]/70 border border-[rgba(225,220,201,0.2)]
                text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.5)]
                opacity-0 group-hover:opacity-100
                transition-all duration-200
                backdrop-blur-sm
              "
            >
              <ExpandIcon />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Title + software */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-tight min-w-0 line-clamp-2">
              {title}
            </h3>
            <div className="flex gap-1.5 flex-shrink-0">
              {software.map((sw) => (
                <span
                  key={sw}
                  className="px-2 py-0.5 text-[10px] font-medium text-[#E1DCC9]/40 border border-[rgba(225,220,201,0.1)] rounded font-[Inter]"
                >
                  {sw}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#E1DCC9]/45 bg-[rgba(225,220,201,0.04)] border border-[rgba(225,220,201,0.1)] rounded-md font-[Inter]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* View Model button — only shown when a 3D model URL exists */}
          {hasModel && (
            <button
              onClick={() => onViewModel?.(model)}
              className="btn btn-outline w-full mt-auto group/btn"
              aria-label={`View 3D model: ${title}`}
            >
              <CubeIcon />
              View Model
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </article>

      {/* Image lightbox — desktop */}
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
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setLightboxOpen(false)}
              aria-hidden="true"
            />

            {/* Image panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-w-4xl w-full"
            >
              {/* Close button */}
              <button
                onClick={() => setLightboxOpen(false)}
                aria-label="Close image"
                className="
                  absolute -top-4 -right-4 z-20
                  w-10 h-10 flex items-center justify-center
                  rounded-full bg-[#1F150C] border border-[rgba(225,220,201,0.2)]
                  text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.5)]
                  transition-all duration-200
                "
              >
                <CloseIcon />
              </button>

              {/* Image */}
              <img
                src={preview}
                alt={`${title} full view`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl border border-[rgba(225,220,201,0.1)]"
              />

              {/* Title below image */}
              <p className="mt-3 text-center text-sm text-[#E1DCC9]/50 font-[Inter]">
                {title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PreviewPlaceholder({ title }) {
  const initials = title.split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <div aria-hidden="true" className="relative w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(225,220,201,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(225,220,201,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <span className="relative text-4xl font-bold text-[#E1DCC9]/8 font-[Space_Grotesk] tracking-widest select-none">{initials}</span>
      <span className="relative text-[10px] tracking-[0.3em] uppercase text-[#E1DCC9]/15 font-[Inter]">No Preview</span>
    </div>
  );
}

function CubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-hover/btn:translate-x-1">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default memo(ModelCard);
