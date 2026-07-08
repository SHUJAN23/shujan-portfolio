import { useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

/**
 * GameVideo — Supports two video types automatically:
 *
 *   1. YouTube  — if video.youtubeId is set → renders a lazy <iframe> embed
 *                 (YouTube links cannot be used in <video> tags — browsers block them)
 *
 *   2. Direct   — if video.url is a direct .mp4 / Cloudinary URL → renders <video>
 *                 hover-to-play, muted autoplay, lazy-loaded
 *
 * Add to games.json:
 *   For YouTube:  "youtubeId": "_beJFIc_Z0A"   (the part after youtu.be/ or ?v=)
 *   For direct:   "url": "https://res.cloudinary.com/.../video.mp4"
 */
function GameVideo({ game }) {
  const { title, engine, video } = game;
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isLoaded, setIsLoaded]     = useState(false);
  const [embedActive, setEmbedActive] = useState(false);
  const videoRef = useRef(null);

  const [containerRef, isInView] = useIntersectionObserver(
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
    true
  );

  const youtubeId  = video?.youtubeId;
  const isYouTube  = Boolean(youtubeId);
  const hasVideo   = isYouTube || Boolean(video?.url);

  // YouTube thumbnail — hi-res with fallback
  const ytPoster = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : video?.poster || null;

  // ── Native video handlers ────────────────────────────────────────────────
  function handleMouseEnter() {
    if (isYouTube || !video?.url || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  }

  function handleMouseLeave() {
    if (isYouTube || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  }

  // ── Click handler — YouTube activates embed, native toggles play ─────────
  function handleClick() {
    if (!hasVideo) return;
    if (isYouTube) {
      setEmbedActive(true);
      return;
    }
    if (!videoRef.current) return;
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
      {/* ── Media area — aspect-video = 16:9, matches 1920×1080 ── */}
      <div className="relative aspect-video bg-[#412D15]/20 overflow-hidden">

        {/* ── YOUTUBE EMBED (active after click) ── */}
        {isYouTube && embedActive && isInView && (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} gameplay video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}

        {/* ── YOUTUBE THUMBNAIL (before click) ── */}
        {isYouTube && !embedActive && (
          <>
            {ytPoster ? (
              <img
                src={ytPoster}
                alt={`${title} thumbnail`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <VideoPlaceholder title={title} hasVideo={true} />
            )}
          </>
        )}

        {/* ── NATIVE VIDEO (direct .mp4 / Cloudinary) ── */}
        {!isYouTube && video?.url && isInView && (
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

        {/* ── PLACEHOLDER (no video or native not yet loaded) ── */}
        {!hasVideo && <VideoPlaceholder title={title} hasVideo={false} />}
        {!isYouTube && !video?.url && <VideoPlaceholder title={title} hasVideo={false} />}

        {/* ── PLAY BUTTON OVERLAY (hidden once YouTube embed is active) ── */}
        {!(isYouTube && embedActive) && (
          <button
            onClick={handleClick}
            aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
            className={`
              absolute inset-0 w-full h-full flex items-center justify-center
              transition-opacity duration-300 cursor-pointer
              ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}
            `}
          >
            <span
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
                bg-[#000000]/70 border border-[rgba(225,220,201,0.25)]
                backdrop-blur-sm transition-all duration-200
                group-hover:bg-[#000000]/85 group-hover:scale-110
                group-hover:border-[rgba(225,220,201,0.5)]
                ${!hasVideo ? "opacity-20 cursor-not-allowed" : ""}
              `}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </span>

            {/* YouTube badge on the play button */}
            {isYouTube && (
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FF0000]/90 backdrop-blur-sm">
                <YouTubeIcon />
                <span className="text-[10px] font-semibold text-white font-[Inter] tracking-wide">
                  YouTube
                </span>
              </span>
            )}
          </button>
        )}

        {/* ── BADGES — top left ── */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-[#000000]/80 text-[#E1DCC9]/70 border border-[rgba(225,220,201,0.15)] rounded-md font-[Inter] backdrop-blur-sm">
            {engine}
          </span>
          {video?.label && (
            <span className="px-2.5 py-1 text-[10px] font-medium text-[#E1DCC9]/50 bg-[#000000]/70 border border-[rgba(225,220,201,0.1)] rounded-md font-[Inter] backdrop-blur-sm">
              {video.label}
            </span>
          )}
        </div>

        {/* ── DURATION — top right ── */}
        {video?.duration && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono text-[#E1DCC9]/50 bg-[#000000]/70 border border-[rgba(225,220,201,0.1)] rounded-md backdrop-blur-sm pointer-events-none">
            {video.duration}
          </span>
        )}
      </div>

      {/* ── Card footer ── */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-base font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-tight">
          {title}
        </h3>
        <p className="text-xs text-[#E1DCC9]/35 font-[Inter]">
          {isYouTube
            ? "Click to watch on YouTube embed"
            : hasVideo
            ? "Hover to preview · Click for controls"
            : "Video coming soon"}
        </p>
      </div>
    </motion.article>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="#E1DCC9" stroke="none" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="#E1DCC9" stroke="none" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
      viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
    </svg>
  );
}

export default memo(GameVideo);
