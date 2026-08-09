import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Environment, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_ROT_Y  = THREE.MathUtils.degToRad(15);
const MAX_ROT_X  = THREE.MathUtils.degToRad(8);
const LERP_SPEED = 0.04;

const isTouchDevice =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

const mouse = { x: 0, y: 0 };

// ── Canvas ────────────────────────────────────────────────────────────────────

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
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]}   intensity={1.5} color="#e8d5b0" />
      <directionalLight position={[-4, -2, -4]} intensity={0.4} color="#412D15" />
      <pointLight       position={[0, 4, 2]}    intensity={0.8} color="#c8a96e" />

      <Environment preset="warehouse" />

      {/* ── ACTIVE: Procedural icosahedron ── */}
      <ModelGroup />

      <Sparkles
        count={60}
        scale={4.5}
        size={0.6}
        speed={0.25}
        opacity={0.35}
        color="#c8a96e"
      />

      {/*
        ── CUSTOM GLTF MODEL — uncomment when ready ──
        Import { Suspense } from "react" and { useGLTF } from "@react-three/drei"
        then replace <ModelGroup /> above with:

        <Suspense fallback={null}>
          <HeroModel />
        </Suspense>

        function HeroModel() {
          const groupRef  = useRef();
          const smoothed  = useRef({ x: 0, y: 0 });
          const floatTime = useRef(0);
          const mouseRef  = useRef({ x: 0, y: 0 });
          const { scene } = useGLTF("/assets/models/scene.gltf");
          const { gl } = useThree();

          useMemo(() => {
            const canvas = gl.domElement;
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            if (isTouch) return;
            function onMouseMove(e) {
              const rect = canvas.getBoundingClientRect();
              mouseRef.current.x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
              mouseRef.current.y =  ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
            }
            function onMouseLeave() { mouseRef.current.x = 0; mouseRef.current.y = 0; }
            window.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mouseleave", onMouseLeave);
            return () => {
              window.removeEventListener("mousemove", onMouseMove);
              canvas.removeEventListener("mouseleave", onMouseLeave);
            };
          }, [gl]);

          useFrame((_, delta) => {
            if (!groupRef.current) return;
            floatTime.current += delta * 1.2;
            groupRef.current.position.y = Math.sin(floatTime.current) * 0.08;
            const t = 1 - Math.pow(0.035, delta);
            const targetY = THREE.MathUtils.clamp(mouseRef.current.x * MAX_ROT_Y, -MAX_ROT_Y, MAX_ROT_Y);
            const targetX = THREE.MathUtils.clamp(mouseRef.current.y * MAX_ROT_X, -MAX_ROT_X, MAX_ROT_X);
            smoothed.current.x += (targetX - smoothed.current.x) * t;
            smoothed.current.y += (targetY - smoothed.current.y) * t;
            groupRef.current.rotation.x = smoothed.current.x;
            groupRef.current.rotation.y = smoothed.current.y;
          });

          return (
            <group ref={groupRef}>
              <primitive object={scene} dispose={null} scale={0.5} position={[0, -0.5, 0]} />
            </group>
          );
        }
        useGLTF.preload("/assets/models/scene.gltf");
      */}
    </Canvas>
  );
}

// ── ModelGroup — mouse-driven icosahedron + wireframe shell ──────────────────

function ModelGroup() {
  const groupRef = useRef();
  const smoothed = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouchDevice) return;
    function onMouseMove(e) {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }
    function onMouseLeave() { mouse.x = 0; mouse.y = 0; }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = 1 - Math.pow(LERP_SPEED, delta);
    const targetY = THREE.MathUtils.clamp(mouse.x * MAX_ROT_Y, -MAX_ROT_Y, MAX_ROT_Y);
    const targetX = THREE.MathUtils.clamp(mouse.y * MAX_ROT_X, -MAX_ROT_X, MAX_ROT_X);
    smoothed.current.x += (targetX - smoothed.current.x) * t;
    smoothed.current.y += (targetY - smoothed.current.y) * t;
    groupRef.current.rotation.x = smoothed.current.x;
    groupRef.current.rotation.y = smoothed.current.y;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8} floatingRange={[-0.12, 0.12]}>
        <CoreGeo />
      </Float>
      <WireShell />
    </group>
  );
}

// ── CoreGeo ───────────────────────────────────────────────────────────────────

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

// ── WireShell ─────────────────────────────────────────────────────────────────

function WireShell() {
  const meshRef = useRef();

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
      <lineBasicMaterial color="#E1DCC9" transparent opacity={0.06} depthWrite={false} />
    </lineSegments>
  );
}
