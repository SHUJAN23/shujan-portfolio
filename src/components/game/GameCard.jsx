import { memo } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * GameCard — Displays a single game project
 *
 * "View Project" button is hidden on the /games page since the card
 * is already inside the full project detail view there.
 */
function GameCard({ game, featured = false }) {
  const { title, description, thumbnail, engine, technologies, links } = game;
  const { pathname } = useLocation();

  const hasGameplay = Boolean(links?.gameplay);
  // Hide "View Project" when already on the games page — it would link to itself
  const showViewProject = links?.details && pathname !== "/games";

  return (
    <article
      className={`
        group relative flex flex-col
        bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-2xl overflow-hidden
        transition-all duration-300
        hover:border-[rgba(225,220,201,0.3)]
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
        hover:-translate-y-1
        ${featured ? "lg:flex-row" : ""}
      `}
    >
      {/* Thumbnail — aspect-video = 16:9, never crops */}
      <div
        className={`
          relative bg-[#412D15]/30 overflow-hidden flex-shrink-0
          ${featured ? "lg:w-1/2 aspect-video lg:aspect-auto lg:h-full" : "aspect-video"}
        `}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${title} thumbnail`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ThumbnailPlaceholder title={title} />
        )}

        {/* Engine badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-[#000000]/80 text-[#E1DCC9]/80 border border-[rgba(225,220,201,0.15)] rounded-md font-[Inter] backdrop-blur-sm">
          {engine}
        </span>
      </div>

      {/* Content — justify-between ensures tags+buttons always sit at the bottom */}
      <div className="flex flex-col flex-1 p-6 gap-4 justify-between">
        {/* Top group: title + description */}
        <div className="flex flex-col gap-3">
          <h3
            className={`font-bold text-[#E1DCC9] font-[Space_Grotesk] leading-tight
              ${featured ? "text-2xl lg:text-3xl" : "text-xl"}
            `}
          >
            {title}
          </h3>

          <p className="text-sm text-[#E1DCC9]/50 font-[Inter] leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Bottom group: tech stack + actions — always pinned to the footer of the card */}
        <div className="flex flex-col gap-3">
          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[11px] font-medium text-[#E1DCC9]/50 border border-[rgba(225,220,201,0.12)] rounded-md font-[Inter]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {showViewProject && (
              <Link
                to={links.details}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#000000] bg-[#E1DCC9] rounded-lg hover:bg-[#E1DCC9]/80 transition-colors font-[Inter]"
              >
                View Project
                <ArrowRightIcon />
              </Link>
            )}

            {hasGameplay && (
              <a
                href={links.gameplay}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#E1DCC9] border border-[rgba(225,220,201,0.25)] rounded-lg hover:border-[rgba(225,220,201,0.5)] hover:bg-[rgba(225,220,201,0.05)] transition-all font-[Inter]"
              >
                <PlayIcon />
                Gameplay
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Internal sub-components ──────────────────────────────────────────────────

function ThumbnailPlaceholder({ title }) {
  // Use first letters of each word as initials
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      aria-hidden="true"
      className="w-full h-full flex flex-col items-center justify-center gap-3"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(225,220,201,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(225,220,201,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <span className="relative text-3xl font-bold text-[#E1DCC9]/10 font-[Space_Grotesk] tracking-widest">
        {initials}
      </span>
      <span className="relative text-[10px] tracking-[0.3em] uppercase text-[#E1DCC9]/15 font-[Inter]">
        No Preview
      </span>
    </div>
  );
}

function ArrowRightIcon() {
  return (
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
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

export default memo(GameCard);
