# Hero 3D Scene — Technical Documentation

A complete reference for how the Three.js / React Three Fiber scene in the
Hero section works, what every line does, and how to modify it.

---

## File Locations

```
src/
├── scenes/
│   └── HeroScene.jsx          ← The actual Three.js scene (R3F canvas)
└── components/sections/
    ├── HeroCanvas.jsx          ← Lazy-load wrapper (controls when Three.js loads)
    └── Hero.jsx                ← The section layout that holds the canvas
```

---

## How It Loads (Performance Architecture)

The scene is **never loaded on any page except Home**. This is critical because
Three.js is a large library (~1MB). Here is the exact loading chain:

```
User visits /home
  → React renders <Hero />
  → Hero.jsx renders <HeroCanvas />
  → HeroCanvas.jsx calls React.lazy(() => import("../../scenes/HeroScene"))
  → Browser downloads HeroScene chunk (~3.5KB gz) + Environment chunk (~256KB gz)
  → While downloading → <HeroSceneFallback /> is shown (pulsing ring animation)
  → Once loaded → <HeroScene /> mounts and the Canvas appears
  → Three.js never downloads on /games, /models, /about
```

**Bundle sizes (production):**

| Chunk | Gzipped | Loads when |
|---|---|---|
| `HeroScene-[hash].js` | ~3.5 KB | Hero canvas mounts |
| `Environment-[hash].js` | ~256 KB | Hero canvas mounts |
| Everything else | ~114 KB | Always |

---

## HeroCanvas.jsx — The Lazy Wrapper

```jsx
const HeroScene = lazy(() => import("../../scenes/HeroScene"));

export default function HeroCanvas() {
  return (
    <Suspense fallback={<HeroSceneFallback />}>
      <HeroScene />
    </Suspense>
  );
}
```

**What it does:**
- `React.lazy` defers the import of `HeroScene.jsx` until the component is
  actually rendered. The browser won't even request the JS file until that moment.
- `<Suspense>` shows a fallback UI while the JS bundle is in flight.
- The fallback is three concentric `border` rings — one with `animate-ping` so
  it pulses outward, giving a subtle "loading" feel that matches the dark theme.

**Rule:** Never import `HeroScene` directly in any other file. Always go through
`HeroCanvas` so the lazy-load boundary is preserved.

---

## HeroScene.jsx — Full Scene Breakdown

### 1. The Canvas

```jsx
<Canvas
  camera={{ position: [0, 0, 4.5], fov: 40 }}
  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
  dpr={[1, 1.5]}
  frameloop="always"
  aria-hidden="true"
>
```

| Prop | Value | Why |
|---|---|---|
| `camera.position` | `[0, 0, 4.5]` | Camera sits 4.5 units back on the Z axis, looking at origin |
| `camera.fov` | `40` | Narrow field of view → less distortion, more "telephoto" look |
| `gl.antialias` | `true` | Smooth edges on the icosahedron |
| `gl.alpha` | `true` | Canvas background is transparent — the site's black `#000` shows through |
| `gl.powerPreference` | `"high-performance"` | Hints to browser to use the discrete GPU on dual-GPU machines |
| `dpr` | `[1, 1.5]` | Device pixel ratio capped at 1.5× — renders crisply on Retina without doubling cost |
| `frameloop` | `"always"` | Renders every frame continuously (needed for animation + mouse tracking) |
| `aria-hidden` | `true` | Screen readers skip the canvas — it's decorative |

---

### 2. Lighting — The Workshop Feel

The scene has four light sources, each with a specific role:

```jsx
<ambientLight intensity={0.3} />
```
**Ambient** — fills the entire scene equally, so no face of the object goes
completely black. Think of it as "room lighting". Low at 0.3 to keep the
dark mood.

```jsx
<directionalLight position={[4, 6, 4]} intensity={1.5} color="#e8d5b0" />
```
**Key light** — the main source. Positioned top-right-front. The warm cream
color `#e8d5b0` mimics a tungsten workshop bulb. Intensity 1.5 is strong
to create clear highlights on the metallic surface.

```jsx
<directionalLight position={[-4, -2, -4]} intensity={0.4} color="#412D15" />
```
**Fill / rim light** — positioned opposite the key light (back-left-bottom).
The dark amber color `#412D15` is the site's secondary color — it tints the
shadowed faces with a warm dark glow rather than neutral grey, reinforcing
the workshop theme.

```jsx
<pointLight position={[0, 4, 2]} intensity={0.8} color="#c8a96e" />
```
**Point light** — a small amber lamp directly above and slightly in front of
the object. Adds a warm highlight crown on the top of the sphere and
contributes to the hot-metal / forge appearance.

```jsx
<Environment preset="warehouse" />
```
**HDRI environment** — a High Dynamic Range Image used as a reflection map.
The `"warehouse"` preset from Drei provides industrial ambient light with
multiple diffuse reflection sources. This is what creates the bright
specular spots you see on the object's surface — it's not direct lights,
it's the object reflecting the surrounding environment.

> **To change the look:** swap `preset="warehouse"` with:
> - `"sunset"` — warm golden outdoor feel
> - `"studio"` — clean neutral product photography
> - `"city"` — cool blue-grey urban night
> - `"apartment"` — soft indoor residential
> - `"forest"` — green-tinted natural

---

### 3. CoreGeo — The Main Object

```jsx
function CoreGeo() {
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
```

**Geometry: `IcosahedronGeometry`**
```
args={[1.1, 1]}
       ^    ^
       |    detail level (0 = 20 flat triangles, 1 = 80 triangles, 2 = 320...)
       radius = 1.1 units
```
An icosahedron is a 20-faced polyhedron — it looks like a ball but with
visible flat facets. At detail level 1 it has 80 triangular faces, giving
it that characteristic geometric-sphere appearance you see in the screenshot.

**Material: `MeshDistortMaterial`** (from Drei)

This is a custom shader material that extends Three.js's `MeshStandardMaterial`
with an animated vertex displacement effect.

| Property | Value | Effect |
|---|---|---|
| `color` | `#412D15` | Base dark amber-brown — the site's card color |
| `emissive` | `#1F150C` | Slight self-glow in shadowed areas — stops it going pure black |
| `emissiveIntensity` | `0.4` | How strongly the emissive color glows |
| `metalness` | `0.9` | 90% metallic — highly reflective like polished metal |
| `roughness` | `0.2` | Low roughness = sharp specular highlights, glossy surface |
| `distort` | `0.25` | Amplitude of the vertex displacement — higher = more "blobby" |
| `speed` | `1.8` | How fast the distortion animates — creates the organic pulsing |
| `envMapIntensity` | `1.2` | Multiplier for HDRI reflections — amplifies the bright spots |

The `distort` + `speed` combination is what makes the sphere look like it's
slowly breathing or morphing. The vertices are displaced using a noise
function that varies over time.

**Wrapped in `<Float>`:**
```jsx
<Float
  speed={1.4}
  rotationIntensity={0.6}
  floatIntensity={0.8}
  floatingRange={[-0.12, 0.12]}
>
```
`Float` from Drei adds a gentle bobbing motion. The object slowly drifts
vertically between `-0.12` and `+0.12` units while also gently rocking
its rotation. This is all done automatically — no `useFrame` needed.

| Prop | Effect |
|---|---|
| `speed` | Overall animation speed multiplier |
| `rotationIntensity` | How much the rotation wobbles |
| `floatIntensity` | How much vertical translation happens |
| `floatingRange` | Min/max Y displacement in world units |

---

### 4. WireShell — The Outer Cage

```jsx
function WireShell() {
  const meshRef = useRef();

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.x += delta * 0.06;
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
```

This creates a second, larger icosahedron that renders **only its edges** —
the wireframe cage floating around the solid inner sphere.

**How it works:**
1. `THREE.IcosahedronGeometry(1.45, 1)` — same shape as the core, but radius
   `1.45` (larger than core's `1.1`) so it surrounds it with space.
2. `THREE.EdgesGeometry(base)` — extracts only the edges (line segments between
   vertices) from the icosahedron. This is what makes it look like a wireframe
   cage rather than a solid object.
3. `<lineSegments>` — Three.js primitive that renders lines, not filled triangles.
4. `opacity={0.06}` — very faint, almost invisible at 6% opacity — it's a
   background detail that adds depth without competing with the main sphere.
5. `depthWrite={false}` — the lines don't write to the depth buffer, so they
   never clip or occlude the solid object inside.

**Why it rotates independently:**
```js
useFrame((_, delta) => {
  meshRef.current.rotation.y += delta * 0.12;  // Y axis: full rotation in ~52s
  meshRef.current.rotation.x += delta * 0.06;  // X axis: slower, creates tumbling
});
```
Using `delta` (time since last frame in seconds) rather than a fixed increment
makes the rotation **frame-rate independent** — it looks the same on 30fps,
60fps, or 144fps displays.

The cage rotates at a different speed than the core sphere (which is animated
by `Float`), creating a subtle parallax effect between the two layers.

`useMemo` caches the `EdgesGeometry` computation so it only runs once on mount,
not every frame.

---

### 5. Sparkles — The Orbiting Particles

```jsx
<Sparkles
  count={60}
  scale={4.5}
  size={0.6}
  speed={0.25}
  opacity={0.35}
  color="#c8a96e"
/>
```

`Sparkles` from Drei renders instanced points (GPU-efficient) that drift
randomly within a bounding volume.

| Prop | Value | Effect |
|---|---|---|
| `count` | `60` | Number of particles |
| `scale` | `4.5` | Size of the bounding cube they live in (world units) |
| `size` | `0.6` | Visual size of each particle point |
| `speed` | `0.25` | How fast particles drift |
| `opacity` | `0.35` | Particle transparency |
| `color` | `#c8a96e` | Warm amber — matches the point light color |

**Why instanced?** All 60 particles are drawn in a single draw call instead
of 60 separate ones. This is one of the cheapest ways to add visual richness
to a scene.

---

### 6. CameraRig — Mouse Parallax

```jsx
function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

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
    return () => { /* cleanup */ };
  }, [gl]);

  useFrame((_, delta) => {
    const lerpFactor = 1 - Math.pow(0.04, delta);
    target.current.x += (mouse.current.x - target.current.x) * lerpFactor;
    target.current.y += (mouse.current.y - target.current.y) * lerpFactor;

    camera.position.x = target.current.x * 0.4;
    camera.position.y = target.current.y * 0.25;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
```

This component has no visible output (`return null`) — it only mutates the
camera every frame.

**Step by step:**

**Mouse tracking:**
```js
mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
```
Normalises the mouse X position to the range `[-1, +1]`:
- `e.clientX - rect.left` → pixel position within the canvas
- `/ rect.width` → normalise to `[0, 1]`
- `- 0.5` → shift to `[-0.5, +0.5]`
- `* 2` → scale to `[-1, +1]`

Y is negated because screen Y increases downward but 3D Y increases upward.

**Smoothing (frame-rate independent lerp):**
```js
const lerpFactor = 1 - Math.pow(0.04, delta);
target.current.x += (mouse.current.x - target.current.x) * lerpFactor;
```
A standard exponential lerp using `delta`. `Math.pow(0.04, delta)` decays
toward 0 as delta increases — this ensures the smoothing feels the same
at any frame rate. The `0.04` constant controls the speed of response:
lower = more sluggish, higher = snappier.

**Applying to camera:**
```js
camera.position.x = target.current.x * 0.4;  // max ±0.4 world units horizontal
camera.position.y = target.current.y * 0.25; // max ±0.25 world units vertical
camera.lookAt(0, 0, 0);                       // always aim at the object
```
The camera stays at its base Z depth (`4.5`) but shifts slightly left/right
and up/down following the mouse, then always points at the scene origin `(0,0,0)`.
The `0.4` and `0.25` multipliers keep the movement subtle — it's a hint of
depth, not a dramatic camera pan.

---

### 7. OrbitControls

```jsx
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
```

Allows the user to manually drag to rotate the scene.

| Prop | Value | Reason |
|---|---|---|
| `enableZoom` | `false` | No scrolling into/out of the scene — scroll should move the page |
| `enablePan` | `false` | No dragging to move the camera laterally |
| `enableRotate` | `true` | Allow drag-to-rotate |
| `enableDamping` | `true` | Rotation coasts to a stop smoothly |
| `dampingFactor` | `0.05` | Low = more coasting, feels heavy and smooth |
| `maxPolarAngle` | `π × 0.75` | Limits how far down you can rotate (135°) |
| `minPolarAngle` | `π × 0.25` | Limits how far up you can rotate (45°) |

The polar angle limits prevent the user from flipping the scene upside-down.

---

## How All Layers Stack Visually

```
From back to front in depth order:

Layer 5 — Sparkles (60 amber particles, drifting in 4.5-unit cube)
Layer 4 — WireShell (faint edge cage, radius 1.45, slow independent rotation)
Layer 3 — CoreGeo (main metallic icosahedron, radius 1.1, Float bobbing + MeshDistort pulse)
Layer 2 — Environment reflections (HDRI warehouse — bright specular spots)
Layer 1 — Lighting (4 sources: ambient + 2 directional + 1 point)
```

---

## How to Tweak the Scene

### Change the object shape
Replace `<icosahedronGeometry args={[1.1, 1]} />` with any Three.js geometry:
```jsx
<boxGeometry args={[1.5, 1.5, 1.5]} />       // cube
<torusGeometry args={[1, 0.4, 16, 100]} />   // donut
<sphereGeometry args={[1.1, 32, 32]} />      // smooth sphere
<octahedronGeometry args={[1.2, 0]} />       // diamond shape
```

### Make it more/less "blobby"
```jsx
// In MeshDistortMaterial:
distort={0.5}   // more extreme deformation (0 = no distortion, 1 = very extreme)
speed={3.0}     // faster pulsing
```

### Change the color theme
```jsx
// In CoreGeo MeshDistortMaterial:
color="#1a3a5c"       // dark blue — sci-fi feel
emissive="#0a1a2c"    // matching dark blue glow

// In lights:
color="#60a0ff"       // blue key light
color="#c8a96e"       // keep amber point light for contrast
```

### Make the float more dramatic
```jsx
<Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
```

### Reduce the parallax effect
```jsx
// In CameraRig useFrame:
camera.position.x = target.current.x * 0.15;  // was 0.4
camera.position.y = target.current.y * 0.1;   // was 0.25
```

### Increase particle count (keep below 200 for performance)
```jsx
<Sparkles count={120} scale={6} size={0.8} />
```

### Change HDRI environment
```jsx
<Environment preset="studio" />    // neutral, clean
<Environment preset="sunset" />    // warm outdoor
<Environment preset="night" />     // dark, dramatic
```

---

## Performance Notes

- **No post-processing** — no bloom, no SSAO, no tone-mapping passes.
  These would require importing heavy post-processing libraries.
  The warm look is achieved entirely through lighting and material settings.

- **`dpr={[1, 1.5]}`** — prevents rendering at 2× or 3× on high-DPI screens
  which would quadruple or nonuple the pixel count.

- **`Sparkles` are instanced** — 60 particles = 1 draw call, not 60.

- **`WireShell` geometry is memoized** — `EdgesGeometry` computation runs
  once on mount, not every frame.

- **No shadows** — `castShadow` is declared on the mesh but no `shadowMap`
  is enabled on the Canvas, so it's effectively a no-op. Enabling real-time
  shadows would add significant GPU cost.

- **`frameloop="always"`** — the canvas renders every frame. If performance
  were a concern on very low-end devices, you could switch to `frameloop="demand"`
  and trigger renders manually, but this would break the mouse parallax.

---

## File Dependency Map

```
Hero.jsx
  └── imports HeroCanvas.jsx
        └── lazy imports HeroScene.jsx
              ├── @react-three/fiber  (Canvas, useFrame, useThree)
              ├── @react-three/drei   (OrbitControls, MeshDistortMaterial,
              │                        Environment, Float, Sparkles)
              └── three               (IcosahedronGeometry, EdgesGeometry,
                                       lineSegments, lineBasicMaterial)
```

Three.js is only in `HeroScene.jsx`. No other file in the project imports it
directly (except `ModelScene.jsx` for the model viewer, which is also lazy-loaded).
