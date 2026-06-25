import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";

/**
 * ModelScene — R3F Canvas for rendering a GLB model
 * Lazy-loaded by ModelViewer — Three.js only loads when this component mounts
 *
 * @param {string} modelUrl - URL to the .glb file
 */
export default function ModelScene({ modelUrl }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      className="w-full h-full"
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#c8b89a" />

      {/* Environment map for reflections */}
      <Environment preset="warehouse" />

      {/* The model */}
      <GLBModel url={modelUrl} />

      {/* Contact shadow beneath model */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.4}
        scale={6}
        blur={2}
        color="#000000"
      />

      {/* Orbit controls — damping for smooth feel */}
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
