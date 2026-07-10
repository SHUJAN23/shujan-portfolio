import { memo } from "react";

/**
 * ModelCard — Displays a single 3D model asset
 *
 * @param {object}   model        - Model data object from models.json
 * @param {function} onViewModel  - Callback when "View Model" is clicked
 */
function ModelCard({ model, onViewModel }) {
  const { title, category, software, tags, polycount, preview } = model;

  return (
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
      {/* Preview area — aspect-video for consistent 16:9 at any card width */}
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

        {/* View Model button */}
        <button
          onClick={() => onViewModel?.(model)}
          className="
            mt-auto w-full flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg text-sm font-medium
            text-[#E1DCC9] border border-[rgba(225,220,201,0.2)]
            hover:border-[rgba(225,220,201,0.5)] hover:bg-[rgba(225,220,201,0.05)]
            transition-all duration-200 font-[Inter] cursor-pointer
            group/btn
          "
          aria-label={`View 3D model: ${title}`}
        >
          <CubeIcon />
          View Model
          <ArrowRightIcon />
        </button>
      </div>
    </article>
  );
}

// ── Internal sub-components ──────────────────────────────────────────────────

function PreviewPlaceholder({ title }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full flex flex-col items-center justify-center gap-3"
    >
      {/* Wireframe grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(225,220,201,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(225,220,201,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Diagonal lines — wireframe feel */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 23px, rgba(225,220,201,0.03) 23px, rgba(225,220,201,0.03) 24px)",
        }}
      />
      <span className="relative text-4xl font-bold text-[#E1DCC9]/8 font-[Space_Grotesk] tracking-widest select-none">
        {initials}
      </span>
      <span className="relative text-[10px] tracking-[0.3em] uppercase text-[#E1DCC9]/15 font-[Inter]">
        No Preview
      </span>
    </div>
  );
}

function CubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover/btn:translate-x-1"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default memo(ModelCard);
