import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Environment, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * HeroScene — R3F canvas for the Hero section right panel.
 *
 * Design intent: A geometric icosahedron with a warm metallic distort material —
 * references the "workshop / forged metal" aesthetic of the portfolio.
 * Mouse parallax on the camera adds depth without jarring motion.
 *
 * Performance budget:
 * - dpr capped at [1, 1.5]
 * - frameloop "always" — scene is always visible in hero
 * - No post-processing (saves ~200KB)
 * - Sparkles are instanced geometry (cheap)
 */
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
      {/* Lighting setup — warm workshop feel */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#e8d5b0" />
      <directionalLight position={[-4, -2, -4]} intensity={0.4} color="#412D15" />
      <pointLight position={[0, 4, 2]} intensity={0.8} color="#c8a96e" />

      {/* Environment for metallic reflections */}
      <Environment preset="warehouse" />

      {/* Main floating object */}
      <Float
        speed={1.4}
        rotationIntensity={0.6}
        floatIntensity={0.8}
        floatingRange={[-0.12, 0.12]}
      >
        <CoreGeo />
      </Float>

      {/* Outer wireframe shell */}
      <WireShell />

      {/* Orbiting particles */}
      <Sparkles
        count={60}
        scale={4.5}
        size={0.6}
        speed={0.25}
        opacity={0.35}
        color="#c8a96e"
      />

      {/* Mouse parallax camera rig */}
      <CameraRig />

      {/* Orbit controls — damped, no zoom, subtle */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
        dampingFactor={0.05}
        enableDamping
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </Canvas>
  );
}

// ── Core geometry — Icosahedron with distort material ─────────────────────────

function CoreGeo() {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} castShadow>
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

// ── Wireframe shell — slightly larger, rotates independently ─────────────────

function WireShell() {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.x += delta * 0.06;
  });

  // Build a proper wireframe geometry from an icosahedron
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

// ── Camera rig — follows mouse with subtle parallax ──────────────────────────

function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  // Track mouse relative to the canvas
  useMemo(() => {
    const canvas = gl.domElement;

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    function onMouseLeave() {
      mouse.current.x = 0;
      mouse.current.y = 0;
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [gl]);

  useFrame((_, delta) => {
    // Smooth lerp toward mouse position
    const lerpFactor = 1 - Math.pow(0.04, delta);
    target.current.x += (mouse.current.x - target.current.x) * lerpFactor;
    target.current.y += (mouse.current.y - target.current.y) * lerpFactor;

    // Apply subtle parallax offset — max ±0.4 units
    camera.position.x = target.current.x * 0.4;
    camera.position.y = target.current.y * 0.25;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
