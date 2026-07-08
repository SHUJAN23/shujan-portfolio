import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";

/**
 * ModelScene — R3F Canvas for rendering a GLB model
 * Lazy-loaded by ModelViewer — Three.js only loads when this component mounts
 *
 * @param {string} modelUrl - URL to the .glb file
 *
 * ── Lighting guide ────────────────────────────────────────────────────────────
 * ambientLight      → base fill, keeps shadows from going pure black
 * directionalLight  → key light (main source, top-front-right)
 * directionalLight  → rim/fill light (back-left, accent color)
 * Environment       → HDRI for reflections on metallic/PBR materials
 *                     intensity prop controls how strongly it affects materials
 *
 * Tweak order for brightness:
 *   1. ambientLight intensity     — raises/lowers overall floor brightness
 *   2. directionalLight intensity — raises/lowers the key shadow contrast
 *   3. Environment intensity (environmentIntensity on Canvas) — PBR reflections
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function ModelScene({ modelUrl }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      // ← Lower this (0–1) to dim HDRI contribution across all materials
      environmentIntensity={0.35}
      className="w-full h-full"
    >
      {/* ── Ambient — overall fill brightness ── */}
      {/* Raise intensity → brighter everywhere. Lower → darker shadows */}
      <ambientLight intensity={0.15} color="#ffffff" />

      {/* ── Key light — main directional source ── */}
      {/* intensity: 0.6–1.0 for natural. Lower for darker workshop mood */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.4}
        color="#ffe8c8"
      />

      {/* ── Rim / fill light — subtle back accent ── */}
      {/* Keeps the back faces from going completely black */}
      <directionalLight
        position={[-4, 2, -4]}
        intensity={0.15}
        color="#8ba0c8"
      />

      {/* ── Environment — HDRI for reflections on metallic/PBR surfaces ── */}
      {/* "apartment" is softer than "warehouse". Other options:           */}
      {/* "sunset" | "dawn" | "night" | "forest" | "studio" | "city"      */}
      <Environment preset="apartment" />

      {/* The model */}
      <GLBModel url={modelUrl} />

      {/* Contact shadow beneath model */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.35}
        scale={6}
        blur={2.5}
        color="#000000"
      />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        enableDamping
        minDistance={1}
        maxDistance={10}
        maxPolarAngle={Math.PI * 0.85}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </Canvas>
  );
}

function GLBModel({ url }) {
  const group = useRef();
  const { scene } = useGLTF(url);
  return <primitive ref={group} object={scene} dispose={null} />;
}
