import { useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

/**
 * GameVideo — Lazy-loaded Cloudinary video card
 *
 * Video src is only set once the card scrolls into view.
 * Autoplay begins on hover (muted), full controls available.
 *
 * @param {object} game - Full game object with game.video { url, poster, duration, label }
 */
function GameVideo({ game }) {
  const { title, engine, video } = game;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  // Only inject the src once the card is in view — never fetches from Cloudinary before that
  const [containerRef, isInView] = useIntersectionObserver(
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
    true
  );

  const hasVideo = Boolean(video?.url);

  function handleMouseEnter() {
    if (!hasVideo || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  }

  function handleMouseLeave() {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  }

  function handlePlayClick() {
    if (!hasVideo || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  return (
    <motion.article
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-2xl overflow-hidden hover:border-[rgba(225,220,201,0.3)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:-translate-y-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video / poster area */}
      <div className="relative h-52 bg-[#412D15]/20 overflow-hidden">

        {/* Lazy video — src only set when in view */}
        {hasVideo && isInView && (
          <video
            ref={videoRef}
            src={video.url}
            poster={video.poster || undefined}
            muted
            playsInline
            loop
            preload="none"
            onCanPlay={() => setIsLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            aria-label={`${title} gameplay video`}
          />
        )}

        {/* Poster / placeholder — always visible until video loads */}
        {(!isLoaded || !hasVideo) && (
          <VideoPlaceholder title={title} hasVideo={hasVideo} />
        )}

        {/* Play/pause overlay button */}
        <button
          onClick={handlePlayClick}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          className={`
            absolute inset-0 w-full h-full flex items-center justify-center
            transition-opacity duration-300 cursor-pointer
            ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}
          `}
        >
          <span
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              bg-[#000000]/60 border border-[rgba(225,220,201,0.2)]
              backdrop-blur-sm transition-all duration-200
              group-hover:bg-[#000000]/80 group-hover:scale-110
              ${!hasVideo ? "opacity-20 cursor-not-allowed" : ""}
            `}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </span>
        </button>

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-[#000000]/80 text-[#E1DCC9]/70 border border-[rgba(225,220,201,0.15)] rounded-md font-[Inter] backdrop-blur-sm">
            {engine}
          </span>
          {video?.label && (
            <span className="px-2.5 py-1 text-[10px] font-medium text-[#E1DCC9]/50 bg-[#000000]/70 border border-[rgba(225,220,201,0.1)] rounded-md font-[Inter] backdrop-blur-sm">
              {video.label}
            </span>
          )}
        </div>

        {/* Duration badge */}
        {video?.duration && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono text-[#E1DCC9]/50 bg-[#000000]/70 border border-[rgba(225,220,201,0.1)] rounded-md backdrop-blur-sm">
            {video.duration}
          </span>
        )}

        {/* Playing indicator bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(225,220,201,0.1)]">
            <div className="h-full bg-[#E1DCC9]/60 animate-[videoProgress_var(--duration)_linear_forwards]" />
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-base font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-tight">
          {title}
        </h3>
        <p className="text-xs text-[#E1DCC9]/35 font-[Inter]">
          {hasVideo
            ? "Hover to preview · Click for controls"
            : "Video coming soon"}
        </p>
      </div>
    </motion.article>
  );
}

// ── Internal sub-components ──────────────────────────────────────────────────

function VideoPlaceholder({ title, hasVideo }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(225,220,201,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,220,201,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <span className="relative text-3xl font-bold text-[#E1DCC9]/8 font-[Space_Grotesk] tracking-widest select-none">
        {initials}
      </span>
      {!hasVideo && (
        <span className="relative text-[10px] tracking-[0.25em] uppercase text-[#E1DCC9]/15 font-[Inter]">
          No Video
        </span>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#E1DCC9"
      stroke="none"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#E1DCC9"
      stroke="none"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

export default memo(GameVideo);
