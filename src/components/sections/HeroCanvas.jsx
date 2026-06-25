import { lazy, Suspense } from "react";

// Three.js + R3F only load when HeroCanvas mounts on the Home page.
// Any other page never pays this cost.
const HeroScene = lazy(() => import("../../scenes/HeroScene"));

/**
 * HeroCanvas — Lazy boundary for the R3F Hero scene.
 * Renders the scene inside the existing placeholder container in Hero.jsx.
 */
export default function HeroCanvas() {
  return (
    <Suspense fallback={<HeroSceneFallback />}>
      <HeroScene />
    </Suspense>
  );
}

// Shown while Three.js bundle is loading — matches the panel aesthetic
function HeroSceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col items-center justify-center gap-4"
    >
      {/* Pulsing ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border border-[rgba(225,220,201,0.08)] animate-ping" />
        <div className="absolute inset-0 rounded-full border border-[rgba(225,220,201,0.12)]" />
        <div className="absolute inset-[6px] rounded-full border border-[rgba(225,220,201,0.06)]" />
      </div>
      <span className="text-[10px] tracking-[0.25em] uppercase text-[#E1DCC9]/15 font-[Inter]">
        Loading scene
      </span>
    </div>
  );
}
