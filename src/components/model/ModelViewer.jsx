import { Suspense, lazy } from "react";

// Three.js only loads when ModelViewer is rendered — never on initial page load
const ModelScene = lazy(() => import("./ModelScene"));

/**
 * ModelViewer — Modal overlay for viewing a GLB 3D model
 * R3F scene is lazy-loaded so Three.js is never bundled into the main chunk
 *
 * @param {object}   model    - Model data object (needs model.model for GLB url)
 * @param {function} onClose  - Callback to close the viewer
 */
export default function ModelViewer({ model, onClose }) {
  if (!model) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`3D viewer: ${model.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Viewer panel */}
      <div className="relative w-full max-w-4xl bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-2xl overflow-hidden aspect-video">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-[#000000]/60 border border-[rgba(225,220,201,0.15)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.35)] transition-all backdrop-blur-sm cursor-pointer"
          aria-label="Close viewer"
        >
          <CloseIcon />
        </button>

        {/* Model info — top left */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
          <div className="px-3 py-1.5 bg-[#000000]/60 border border-[rgba(225,220,201,0.15)] rounded-lg backdrop-blur-sm">
            <span className="text-xs font-semibold text-[#E1DCC9]/80 font-[Space_Grotesk]">
              {model.title}
            </span>
          </div>
          {model.polycount && (
            <div className="px-3 py-1.5 bg-[#000000]/60 border border-[rgba(225,220,201,0.1)] rounded-lg backdrop-blur-sm">
              <span className="text-xs font-mono text-[#E1DCC9]/40">
                {model.polycount}
              </span>
            </div>
          )}
        </div>

        {/* Controls hint — bottom left */}
        <div className="absolute bottom-4 left-4 z-10">
          <p className="text-[10px] tracking-wider text-[#E1DCC9]/25 font-[Inter]">
            Drag to rotate · Scroll to zoom · Right-click to pan
          </p>
        </div>

        {/* R3F Scene (lazy) — only renders when viewer is open */}
        {model.model ? (
          <Suspense fallback={<ViewerLoader />}>
            <ModelScene modelUrl={model.model} />
          </Suspense>
        ) : (
          <ViewerComingSoon />
        )}
      </div>
    </div>
  );
}

// ── Internal sub-components ──────────────────────────────────────────────────

function ViewerLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1F150C]">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-[rgba(225,220,201,0.08)]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E1DCC9]/40 animate-spin" />
      </div>
      <span className="text-[10px] tracking-[0.25em] uppercase text-[#E1DCC9]/25 font-[Inter]">
        Loading model
      </span>
    </div>
  );
}

function ViewerComingSoon() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1F150C]">
      <div
        aria-hidden="true"
        className="w-16 h-16 rounded-xl border border-[rgba(225,220,201,0.1)] flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(225,220,201,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm text-[#E1DCC9]/40 font-[Inter]">
          Interactive viewer coming soon
        </p>
        <p className="text-[11px] text-[#E1DCC9]/20 font-[Inter] mt-1">
          GLB model not yet uploaded
        </p>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
