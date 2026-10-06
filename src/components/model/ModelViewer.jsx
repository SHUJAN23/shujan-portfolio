import { Suspense, lazy, useState } from "react";

// Three.js only loads when ModelViewer is rendered — never on initial page load
const ModelScene = lazy(() => import("./ModelScene"));

/**
 * Normalizes image paths to ensure consistent leading slashes.
 */
function normalizeImgPath(src) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

/**
 * Collects all preview images from the asset data object.
 */
function getModelImages(model) {
  if (!model) return [];
  const list = [];

  if (Array.isArray(model.images)) list.push(...model.images);
  if (Array.isArray(model.previews)) list.push(...model.previews);

  ["preview", "preview2", "preview3", "preview4", "preview5"].forEach((key) => {
    if (model[key] && !list.includes(model[key])) {
      list.push(model[key]);
    }
  });

  return list.filter(Boolean).map(normalizeImgPath);
}

/**
 * Helper to dynamically extract and format technical specifications from asset metadata.
 * Only returns fields that actually exist for the asset (hides missing fields).
 */
function getTechnicalSpecs(model) {
  if (!model) return [];

  const specs = [];

  // 1. Software
  const rawSoftware = model.software || model.tools || model.softwareList;
  if (rawSoftware) {
    const val = Array.isArray(rawSoftware)
      ? rawSoftware.filter(Boolean).join(" · ")
      : String(rawSoftware).trim();
    if (val) specs.push({ label: "SOFTWARE", value: val });
  }

  // 2. Geometry / Polygon Count
  const rawGeometry =
    model.geometry ||
    model.polycount ||
    model.polygonCount ||
    model.triangles ||
    model.tris;
  if (rawGeometry && String(rawGeometry).trim()) {
    specs.push({ label: "GEOMETRY", value: String(rawGeometry).trim() });
  }

  // 3. Textures
  const rawTextures =
    model.textures ||
    model.textureResolution ||
    model.textureInfo ||
    model.texture;
  let texVal = null;
  if (rawTextures) {
    texVal = Array.isArray(rawTextures)
      ? rawTextures.filter(Boolean).join(" · ")
      : String(rawTextures).trim();
  } else if (Array.isArray(model.tags)) {
    const pbrTag = model.tags.find((t) =>
      /pbr|texture|res|\b\d+k\b/i.test(t)
    );
    if (pbrTag) texVal = pbrTag;
  }
  if (texVal && String(texVal).trim()) {
    specs.push({ label: "TEXTURES", value: String(texVal).trim() });
  }

  // 4. UV
  let uvVal = null;
  if (model.uv !== undefined) {
    uvVal =
      typeof model.uv === "boolean"
        ? model.uv
          ? "Yes"
          : "No"
        : String(model.uv).trim();
  } else if (model.uvUnwrapped !== undefined) {
    uvVal =
      typeof model.uvUnwrapped === "boolean"
        ? model.uvUnwrapped
          ? "Yes"
          : "No"
        : String(model.uvUnwrapped).trim();
  } else if (Array.isArray(model.tags)) {
    const hasUv = model.tags.some((t) => /^uv\b|unwrapped/i.test(t));
    if (hasUv) uvVal = "Yes";
  }
  if (uvVal && String(uvVal).trim()) {
    specs.push({ label: "UV", value: String(uvVal).trim() });
  }

  // 5. Game Ready
  let gameReadyVal = null;
  if (model.gameReady !== undefined) {
    gameReadyVal =
      typeof model.gameReady === "boolean"
        ? model.gameReady
          ? "Yes"
          : "No"
        : String(model.gameReady).trim();
  } else if (Array.isArray(model.tags)) {
    const hasGameReady = model.tags.some((t) => /game ready/i.test(t));
    if (hasGameReady) gameReadyVal = "Yes";
  }
  if (gameReadyVal && String(gameReadyVal).trim()) {
    specs.push({ label: "GAME READY", value: String(gameReadyVal).trim() });
  }

  return specs;
}

/**
 * ModelViewer — 3D Asset Detail Modal
 * Features interactive 3D model/preview viewport, multiple image gallery with thumbnail carousel, and responsive Technical Specifications cards.
 */
export default function ModelViewer({ model, onClose }) {
  if (!model) return null;

  const specs = getTechnicalSpecs(model);
  const images = getModelImages(model);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeView, setActiveView] = useState(model.model ? "3d" : "image");

  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeImageIndex] || images[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`3D Asset Details: ${model.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-5xl bg-[#0D0D0D] border border-[rgba(225,220,201,0.14)] rounded-2xl sm:rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden my-auto flex flex-col z-10 max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[rgba(225,220,201,0.08)] bg-[#140E08]/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#E1DCC9] font-[Space_Grotesk] truncate">
              {model.title}
            </h2>
            {model.category && (
              <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase bg-[#000000]/60 text-[#E1DCC9]/60 border border-[rgba(225,220,201,0.12)] rounded-md font-[Inter] flex-shrink-0">
                {model.category}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[rgba(225,220,201,0.06)] border border-[rgba(225,220,201,0.12)] text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.3)] hover:bg-[rgba(225,220,201,0.12)] transition-all cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: 3D Scene Viewport / Multi-Image Preview Stage */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              
              {/* Main Display Stage */}
              <div className="relative w-full aspect-video sm:aspect-[4/3] lg:aspect-auto lg:h-[390px] bg-[#1F150C] border border-[rgba(225,220,201,0.12)] rounded-2xl overflow-hidden flex items-center justify-center group">
                
                {/* 3D Scene View */}
                {activeView === "3d" && model.model ? (
                  <>
                    <Suspense fallback={<ViewerLoader />}>
                      <ModelScene modelUrl={model.model} />
                    </Suspense>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-[#000000]/75 border border-[rgba(225,220,201,0.12)] text-[10px] tracking-wider text-[#E1DCC9]/55 font-[Inter] backdrop-blur-sm text-center">
                        Drag to rotate · Scroll to zoom · Right-click to pan
                      </span>
                    </div>
                  </>
                ) : currentImage ? (
                  /* Image Gallery View */
                  <>
                    <img
                      key={currentImage}
                      src={currentImage}
                      alt={`${model.title} render ${activeImageIndex + 1}`}
                      className="w-full h-full object-contain p-4 transition-opacity duration-300"
                    />

                    {/* Navigation Arrows for Multi-image */}
                    {hasMultipleImages && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#000000]/75 border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/70 hover:text-[#E1DCC9] hover:bg-[#000000] hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer"
                        >
                          <ChevronLeftIcon />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#000000]/75 border border-[rgba(225,220,201,0.2)] text-[#E1DCC9]/70 hover:text-[#E1DCC9] hover:bg-[#000000] hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer"
                        >
                          <ChevronRightIcon />
                        </button>

                        {/* Image Counter Pill */}
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#000000]/70 border border-[rgba(225,220,201,0.12)] text-[10px] font-mono text-[#E1DCC9]/60 backdrop-blur-sm">
                          {activeImageIndex + 1} / {images.length}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <ViewerComingSoon />
                )}
              </div>

              {/* Thumbnails Row */}
              {(model.model || hasMultipleImages) && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {/* 3D View Button (if 3D GLB exists) */}
                  {model.model && (
                    <button
                      type="button"
                      onClick={() => setActiveView("3d")}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeView === "3d"
                          ? "border-[#E1DCC9] bg-[rgba(225,220,201,0.12)] shadow-[0_0_12px_rgba(225,220,201,0.2)]"
                          : "border-[rgba(225,220,201,0.12)] bg-[#1F150C]/60 hover:border-[rgba(225,220,201,0.3)]"
                      }`}
                      aria-label="View interactive 3D model"
                    >
                      <CubeIcon />
                      <span className="text-[9px] font-semibold tracking-wider uppercase text-[#E1DCC9]/70 font-[Inter]">
                        3D View
                      </span>
                    </button>
                  )}

                  {/* Render Image Thumbnails */}
                  {images.map((imgSrc, idx) => (
                    <button
                      key={imgSrc + idx}
                      type="button"
                      onClick={() => {
                        setActiveView("image");
                        setActiveImageIndex(idx);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all cursor-pointer bg-[#1A110A] ${
                        activeView === "image" && activeImageIndex === idx
                          ? "border-[#E1DCC9] ring-2 ring-[#E1DCC9]/40 shadow-[0_0_12px_rgba(225,220,201,0.2)]"
                          : "border-[rgba(225,220,201,0.12)] opacity-60 hover:opacity-100 hover:border-[rgba(225,220,201,0.35)]"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${model.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Right: Overview & Technical Specifications */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Project / Asset Overview */}
              <div>
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#E1DCC9]/40 font-[Inter] mb-2.5">
                  Project Overview
                </h3>
                <p className="text-sm text-[#E1DCC9]/65 font-[Inter] leading-relaxed">
                  {model.description ||
                    "Low poly, game-ready 3D asset crafted in Blender. Optimised with clean topology and efficient material setups for real-time game engines."}
                </p>

                {/* Tags */}
                {model.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-[10px] font-medium text-[#E1DCC9]/50 bg-[rgba(225,220,201,0.04)] border border-[rgba(225,220,201,0.08)] rounded-md font-[Inter]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* TECHNICAL SPECIFICATIONS */}
              {specs.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#E1DCC9]/40 font-[Inter] mb-3">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {specs.map((spec) => (
                      <SpecCard
                        key={spec.label}
                        label={spec.label}
                        value={spec.value}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SpecCard({ label, value }) {
  if (!value) return null;

  return (
    <div className="flex flex-col justify-center p-3.5 sm:p-4 rounded-xl bg-[#15100A] border border-[rgba(225,220,201,0.09)] hover:border-[rgba(225,220,201,0.2)] transition-colors duration-200">
      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#E1DCC9]/40 font-[Inter] mb-1">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#E1DCC9] font-[Space_Grotesk] leading-snug">
        {value}
      </span>
    </div>
  );
}

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

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
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
