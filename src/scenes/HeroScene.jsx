import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Constants ─────────────────────────────────────────────────────────────────

// Rotation limits in radians
const MAX_ROT_Y = THREE.MathUtils.degToRad(15); // ±15° horizontal
const MAX_ROT_X = THREE.MathUtils.degToRad(8);  // ±8°  vertical

// Lerp speed — higher = snappier, lower = more sluggish
const LERP_SPEED = 0.04; // used as base for frame-rate-independent lerp

// Detect touch/mobile devices — disable mouse tracking on coarse pointers
const isTouchDevice =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

// Shared mouse state — lives outside React so it never triggers re-renders
const mouse = { x: 0, y: 0 };

// ── Main scene ────────────────────────────────────────────────────────────────

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      frameloop="always"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Lighting — warm workshop feel */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]}   intensity={1.5} color="#e8d5b0" />
      <directionalLight position={[-4, -2, -4]} intensity={0.4} color="#412D15" />
      <pointLight       position={[0, 4, 2]}    intensity={0.8} color="#c8a96e" />

      {/* HDRI reflections */}
      <Environment preset="warehouse" />

      {/*
        ModelGroup — single group that rotates based on mouse.
        Both the core mesh and the wireframe shell live here so they
        move together as one unit. The wireframe shell has an additional
        slow self-rotation so it feels layered.
      */}
      <ModelGroup />

      {/* Orbiting particles — not parented to ModelGroup so they drift freely */}
      <Sparkles
        count={60}
        scale={4.5}
        size={0.6}
        speed={0.25}
        opacity={0.35}
        color="#c8a96e"
      />
    </Canvas>
  );
}

// ── ModelGroup — handles mouse-driven rotation ────────────────────────────────

function ModelGroup() {
  const groupRef = useRef();

  // Smoothed rotation target (radians)
  const smoothed = useRef({ x: 0, y: 0 });

  // Register global mousemove listener once — updates the shared mouse object
  useEffect(() => {
    if (isTouchDevice) return; // skip on mobile

    function onMouseMove(e) {
      // Normalise to [-1, +1] relative to the full viewport
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 4;
    }

    function onMouseLeave() {
      // Smoothly return to default — just zero the target
      mouse.x = 0;
      mouse.y = 0;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Frame-rate-independent exponential lerp
    const t = 1 - Math.pow(LERP_SPEED, delta);

    // Target rotations clamped to limits
    const targetY = THREE.MathUtils.clamp(mouse.x * MAX_ROT_Y, -MAX_ROT_Y, MAX_ROT_Y);
    const targetX = THREE.MathUtils.clamp(mouse.y * MAX_ROT_X, -MAX_ROT_X, MAX_ROT_X);

    // Smooth interpolation
    smoothed.current.x += (targetX - smoothed.current.x) * t;
    smoothed.current.y += (targetY - smoothed.current.y) * t;

    // Apply to the group — the entire model (core + wireframe) rotates together
    groupRef.current.rotation.x = smoothed.current.x;
    groupRef.current.rotation.y = smoothed.current.y;
  });

  return (
    <group ref={groupRef}>
      <CoreGeo />
      <WireShell />
    </group>
  );
}

// ── CoreGeo — the main metallic icosahedron ───────────────────────────────────

function CoreGeo() {
  return (
    <mesh castShadow>
      <icosahedronGeometry args={[1.1, 1]} />
      <MeshDistortMaterial
        color="#412D15"
        emissive="#1F150C"
        emissiveIntensity={0.4}
        metalness={0.9}
        roughness={0.2}
        distort={0.25}
        speed={1.8}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

// ── WireShell — edge cage with slow independent spin ─────────────────────────

function WireShell() {
  const meshRef = useRef();

  // Slow self-rotation on top of the parent group's mouse rotation
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.rotation.z += delta * 0.04;
  });

  const wireGeo = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(1.45, 1);
    return new THREE.EdgesGeometry(base);
  }, []);

  return (
    <lineSegments ref={meshRef} geometry={wireGeo}>
      <lineBasicMaterial
        color="#E1DCC9"
        transparent
        opacity={0.06}
        depthWrite={false}
      />
    </lineSegments>
  );
}
