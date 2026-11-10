import { useParams, Link } from "react-router-dom";
import { useState, useCallback, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/layout/Container";
import { getBreakdownIcon } from "../utils/breakdownIcons";
import projectsData from "../data/projects.json";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projectsData.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-[#E1DCC9]/40 font-[Inter]">Project not found.</p>
        <Link to="/games" className="btn btn-primary">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Container>

        {/* ── Back link ── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-8 pb-6"
        >
          <Link
            to="/games"
            className="inline-flex items-center gap-2 text-sm text-[#E1DCC9]/45 hover:text-[#E1DCC9] font-[Inter] transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Projects
          </Link>
        </motion.div>

        {/* ── Hero image ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-[#1F150C] mb-10"
          style={{ height: "420px" }}
        >
          {project.thumbnail && (
            <img
              src={project.thumbnail}
              alt={`${project.title} hero`}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
          {/* Category + Status */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase bg-[#000000]/80 text-[#E1DCC9]/80 border border-[rgba(225,220,201,0.15)] rounded-md font-[Inter] backdrop-blur-sm">
              {project.category}
            </span>
            {project.status === "wip" && (
              <span className="px-3 py-1 text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-md font-[Inter] backdrop-blur-sm">
                Work in Progress
              </span>
            )}
          </div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left: main content ── */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* A. Project Overview */}
            <Section title="Project Overview">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-tight mb-1">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-base text-[#E1DCC9]/45 font-[Inter] mb-4">{project.subtitle}</p>
              )}
              <p className="text-base text-[#E1DCC9]/60 font-[Inter] leading-[1.8]">
                {project.description}
              </p>
            </Section>

            {/* B. Gallery */}
            {project.gallery?.length > 0 && (
              <Section title="Screenshots">
                <Gallery images={project.gallery} title={project.title} />
              </Section>
            )}

            {/* B2. Custom Asset Creation — only when project supplies customAssets.images */}
            {project.customAssets?.images?.length > 0 && (
              <Section title={project.customAssets.label || "Custom Asset Creation (Blender)"}>
                <CustomAssetGallery images={project.customAssets.images} title={project.title} />
              </Section>
            )}

            {/* C. My Contributions */}
            {project.contribution && (
              <Section title="My Contributions">
                <p className="text-base text-[#E1DCC9]/60 font-[Inter] leading-[1.8]">
                  {project.contribution}
                </p>
              </Section>
            )}

            {/* D. Technical Breakdown */}
            {project.breakdown?.length > 0 && (
              <Section title="Behind the Build">
                <BreakdownPanel breakdown={project.breakdown} />
              </Section>
            )}

            {/* E. Video */}
            {project.video?.youtubeId && (
              <Section title="Gameplay Showcase">
                <YoutubeEmbed youtubeId={project.video.youtubeId} title={project.title} />
              </Section>
            )}
          </div>

          {/* ── Right: sidebar ── */}
          <div className="flex flex-col gap-6">

            {/* Project info card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1F150C] border border-[rgba(225,220,201,0.1)] rounded-2xl p-5 flex flex-col gap-4"
            >
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#E1DCC9]/70 font-[Inter]">
                Project Info
              </h3>
              <InfoRow label="Category" value={project.category} />
              <InfoRow label="Engine" value={project.engine} />
              <InfoRow label="Status" value={project.status === "wip" ? "Work in Progress" : "Complete"} />
            </motion.div>

            {/* Technologies */}
            {project.technologies?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-[#1F150C] border border-[rgba(225,220,201,0.1)] rounded-2xl p-5 flex flex-col gap-3"
              >
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#E1DCC9]/70 font-[Inter]">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-[11px] font-medium text-[#E1DCC9]/55 bg-[rgba(225,220,201,0.04)] border border-[rgba(225,220,201,0.1)] rounded-md font-[Inter]">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Links */}
            {(project.links?.gameplay || project.links?.live || project.links?.github) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col gap-2"
              >
                {project.links.gameplay && (
                  <a href={project.links.gameplay} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
                    <PlayIcon /> Watch Gameplay
                  </a>
                )}
                {project.links.live && (
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                    Play Live ↗
                  </a>
                )}
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
                    View Source ↗
                  </a>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#E1DCC9]/70 font-[Inter]">{title}</h2>
        <div className="flex-1 h-px bg-[rgba(225,220,201,0.12)]" />
      </div>
      {children}
    </motion.div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-[#E1DCC9]/30 font-[Inter]">{label}</span>
      <span className="text-sm text-[#E1DCC9]/70 font-[Inter]">{value}</span>
    </div>
  );
}

function Gallery({ images, title }) {
  // null = closed; number = index of open image
  const [lightboxIndex, setLightboxIndex] = useState(null);
  // track slide direction for the transition: +1 = going right, -1 = going left
  const directionRef = useRef(0);

  const isOpen = lightboxIndex !== null;

  const openAt = useCallback((i) => {
    directionRef.current = 0;
    setLightboxIndex(i);
  }, []);

  const close = useCallback(() => setLightboxIndex(null), []);

  const goTo = useCallback((nextIndex) => {
    setLightboxIndex((prev) => {
      directionRef.current = nextIndex > prev ? 1 : -1;
      return nextIndex;
    });
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      directionRef.current = -1;
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => {
      directionRef.current = 1;
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  // Keyboard navigation + scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const saved = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e) {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   goPrev();
      if (e.key === "ArrowRight")  goNext();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = saved;
    };
  }, [isOpen, close, goPrev, goNext]);

  // Slide variants — direction drives enter/exit x offset
  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 60 : -60 }),
    center:       { opacity: 1, x: 0 },
    exit:  (dir) => ({ opacity: 0, x: dir >= 0 ? -60 : 60 }),
  };

  return (
    <>
      {/* ── Thumbnail grid ── */}
      <div className={`grid gap-3 ${images.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => openAt(i)}
            aria-label={`Open ${title} screenshot ${i + 1} of ${images.length}`}
            className="group relative overflow-hidden rounded-xl cursor-zoom-in"
            style={{ height: "220px" }}
          >
            <img
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={(e) => { e.target.parentElement.style.background = "#1F150C"; }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/70">
                <ExpandIcon />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox / slideshow ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-md"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} screenshots slideshow`}
          >

            {/* ── Image area (stops backdrop click) ── */}
            <div
              className="relative flex items-center justify-center w-full h-full px-16 sm:px-24"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence
                mode="wait"
                custom={directionRef.current}
                initial={false}
              >
                <motion.img
                  key={lightboxIndex}
                  custom={directionRef.current}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  src={images[lightboxIndex]}
                  alt={`${title} screenshot ${lightboxIndex + 1} of ${images.length}`}
                  draggable={false}
                  className="max-w-full max-h-[82vh] object-contain rounded-xl select-none"
                />
              </AnimatePresence>
            </div>

            {/* ── Left arrow ── */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous screenshot"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-[#0d0a06]/80 border border-[rgba(225,220,201,0.18)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:bg-[#1F150C] hover:border-[rgba(225,220,201,0.4)] transition-all duration-200 backdrop-blur-sm z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* ── Right arrow ── */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next screenshot"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-[#0d0a06]/80 border border-[rgba(225,220,201,0.18)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:bg-[#1F150C] hover:border-[rgba(225,220,201,0.4)] transition-all duration-200 backdrop-blur-sm z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}

            {/* ── Close button ── */}
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#1F150C] border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.4)] transition-all duration-200 z-10"
            >
              <CloseIcon />
            </button>

            {/* ── Counter ── */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-[#0d0a06]/80 border border-[rgba(225,220,201,0.12)] backdrop-blur-sm">
                {/* Dot strip */}
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Screenshot position">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === lightboxIndex}
                      aria-label={`Go to screenshot ${i + 1}`}
                      onClick={(e) => { e.stopPropagation(); goTo(i); }}
                      className={`rounded-full transition-all duration-200 ${
                        i === lightboxIndex
                          ? "w-5 h-1.5 bg-[#E1DCC9]/80"
                          : "w-1.5 h-1.5 bg-[rgba(225,220,201,0.25)] hover:bg-[rgba(225,220,201,0.5)]"
                      }`}
                    />
                  ))}
                </div>
                {/* Numeric counter */}
                <span className="text-[11px] font-mono text-[#E1DCC9]/40 tabular-nums">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CustomAssetGallery({ images, title }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  // Close lightbox on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setLightbox(null);
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }, [prev, next]);

  return (
    <>
      <div className="relative select-none">
        {/* Main image display */}
        <div
          className="relative overflow-hidden rounded-xl bg-[#1F150C] cursor-zoom-in group"
          style={{ height: "360px" }}
          onClick={() => setLightbox(current)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`View ${title} asset image ${current + 1} of ${images.length} full size`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={current}
              src={images[current]}
              alt={`${title} custom asset ${current + 1}`}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 w-full h-full object-contain"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </AnimatePresence>

          {/* Hover zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/70">
              <ExpandIcon />
            </span>
          </div>
        </div>

        {/* Navigation arrows — only show when there's more than one image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous asset image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-[#000000]/70 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:bg-[#000000]/90 hover:border-[rgba(225,220,201,0.35)] transition-all duration-200 backdrop-blur-sm z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={next}
              aria-label="Next asset image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-[#000000]/70 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:bg-[#000000]/90 hover:border-[rgba(225,220,201,0.35)] transition-all duration-200 backdrop-blur-sm z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#000000]/70 border border-[rgba(225,220,201,0.12)] backdrop-blur-sm">
            <span className="text-[11px] font-mono text-[#E1DCC9]/55">
              {current + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Dot strip for quick scrubbing */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3" role="tablist" aria-label="Asset image navigation">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to asset image ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? "w-5 h-1.5 bg-[#E1DCC9]/70"
                  : "w-1.5 h-1.5 bg-[rgba(225,220,201,0.2)] hover:bg-[rgba(225,220,201,0.4)]"
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/92 backdrop-blur-md"
            onClick={() => setLightbox(null)}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} asset image ${lightbox + 1} of ${images.length}`}
            tabIndex={-1}
          >
            <motion.img
              key={lightbox}
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={images[lightbox]}
              alt={`${title} custom asset ${lightbox + 1} full view`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Lightbox counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#000000]/70 border border-[rgba(225,220,201,0.12)] backdrop-blur-sm">
              <span className="text-[11px] font-mono text-[#E1DCC9]/55">{lightbox + 1} / {images.length}</span>
            </div>

            {/* Lightbox arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l - 1 + images.length) % images.length); }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#1F150C] border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l + 1) % images.length); }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#1F150C] border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}

            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#1F150C] border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] transition-colors"
            >
              <CloseIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function YoutubeEmbed({ youtubeId, title }) {
  const [active, setActive] = useState(false);
  const ytPoster = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="relative overflow-hidden rounded-xl aspect-video bg-[#1F150C]">
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button onClick={() => setActive(true)} className="group absolute inset-0 w-full h-full" aria-label={`Play ${title} video`}>
          <img src={ytPoster} alt={`${title} video thumbnail`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-[#E1DCC9]/90 group-hover:bg-white transition-colors shadow-lg">
              <PlayIcon color="#000" />
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

const BreakdownPanel = memo(function BreakdownPanel({ breakdown }) {
  const [openItem, setOpenItem] = useState(null);
  const handleToggle = useCallback((id) => setOpenItem((prev) => (prev === id ? null : id)), []);

  return (
    <div className="flex flex-col gap-2">
      {breakdown.map((item, i) => (
        <BreakdownItem key={item.id} item={item} index={i} isOpen={openItem === item.id} onToggle={handleToggle} />
      ))}
    </div>
  );
});

const BreakdownItem = memo(function BreakdownItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
        isOpen ? "border-[rgba(225,220,201,0.22)] bg-[#1F150C]" : "border-[rgba(225,220,201,0.09)] bg-[#1F150C]/50 hover:border-[rgba(225,220,201,0.16)]"
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer group"
      >
        <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border transition-colors duration-200 ${
          isOpen ? "bg-[#412D15]/60 border-[rgba(225,220,201,0.18)] text-[#E1DCC9]/75" : "bg-[#412D15]/20 border-[rgba(225,220,201,0.07)] text-[#E1DCC9]/30 group-hover:text-[#E1DCC9]/55"
        }`}>
          {getBreakdownIcon(item.icon)}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold font-[Space_Grotesk] transition-colors ${isOpen ? "text-[#E1DCC9]" : "text-[#E1DCC9]/65"}`}>{item.label}</p>
          {!isOpen && <p className="text-xs text-[#E1DCC9]/30 font-[Inter] truncate mt-0.5">{item.summary}</p>}
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className={`flex-shrink-0 ${isOpen ? "text-[#E1DCC9]/50" : "text-[#E1DCC9]/15"}`} aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="w-full h-px bg-[rgba(225,220,201,0.07)] mb-3" />
              <p className="text-sm text-[#E1DCC9]/50 font-[Inter] leading-relaxed">{item.details}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

function PlayIcon({ color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={color} stroke="none" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
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
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
