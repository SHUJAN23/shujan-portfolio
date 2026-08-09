import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_ROT_Y    = THREE.MathUtils.degToRad(25); // ±25° horizontal
const MAX_ROT_X    = THREE.MathUtils.degToRad(15); // ±15° vertical
const LERP_SPEED   = 0.035;  // lower = more buttery/slow, higher = snappier
const FLOAT_AMP    = 0.08;   // float height in world units
const FLOAT_SPEED  = 1.2;    // float cycles per second

// ── Canvas ────────────────────────────────────────────────────────────────────

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      frameloop="always"
      aria-hidden="true"
      className="w-full h-full"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]}   intensity={1.4} color="#e8d5b0" />
      <directionalLight position={[-4, -2, -4]} intensity={0.3} color="#412D15" />
      <pointLight       position={[0, 4, 2]}    intensity={0.7} color="#c8a96e" />

      <Environment preset="warehouse" />

      <Sparkles count={50} scale={5} size={0.5} speed={0.2} opacity={0.3} color="#c8a96e" />

      <Suspense fallback={null}>
        <HeroModel />
      </Suspense>
    </Canvas>
  );
}

// ── HeroModel ─────────────────────────────────────────────────────────────────

function HeroModel() {
  const groupRef  = useRef();
  const smoothed  = useRef({ x: 0, y: 0 });
  const floatTime = useRef(0);
  const mouseRef  = useRef({ x: 0, y: 0 });

  const { scene } = useGLTF("/assets/models/scene.gltf");

  // ── Attach mouse listeners to the CANVAS element (not window)
  // useMemo runs once on mount, cleanup on unmount — same pattern as original CameraRig
  const { gl } = useThree();
  useMemo(() => {
    const canvas = gl.domElement;

    // Detect touch/coarse pointer — skip on mobile
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      // Normalise relative to the canvas, not the full window
      mouseRef.current.x =  ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
      mouseRef.current.y =  ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
    }

    function onMouseLeave() {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    }

    // Listen on the full window so movement anywhere on the page drives the model
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Float — sine wave vertical only, no rotation
    floatTime.current += delta * FLOAT_SPEED;
    groupRef.current.position.y = Math.sin(floatTime.current) * FLOAT_AMP;

    // Mouse-driven rotation with smooth lerp
    const t = 1 - Math.pow(LERP_SPEED, delta);

    const targetY = THREE.MathUtils.clamp(mouseRef.current.x * MAX_ROT_Y, -MAX_ROT_Y, MAX_ROT_Y);
    const targetX = THREE.MathUtils.clamp(mouseRef.current.y * MAX_ROT_X, -MAX_ROT_X, MAX_ROT_X);

    smoothed.current.x += (targetX - smoothed.current.x) * t;
    smoothed.current.y += (targetY - smoothed.current.y) * t;

    groupRef.current.rotation.x = smoothed.current.x;
    groupRef.current.rotation.y = smoothed.current.y;
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        dispose={null}
        scale={5}
        position={[0, -0.5, 0]}
      />
    </group>
  );
}

useGLTF.preload("/assets/models/scene.gltf");
