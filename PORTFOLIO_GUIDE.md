# Shujan Portfolio — Developer Guide

A personal study reference covering user interaction flows, where to place every asset,
and how each section works under the hood.

---

## Table of Contents

1. [Project Structure Overview](#1-project-structure-overview)
2. [User Interaction Flow](#2-user-interaction-flow)
3. [Asset Placement Guide](#3-asset-placement-guide)
   - [Your Photo / Profile Image](#your-photo--profile-image)
   - [Game Thumbnails](#game-thumbnails)
   - [Gameplay Videos (Cloudinary)](#gameplay-videos-cloudinary)
   - [3D Model Previews (Images)](#3d-model-previews-images)
   - [3D Model Files (GLB)](#3d-model-files-glb)
   - [Resume PDF](#resume-pdf)
4. [Data Files — Where the Content Lives](#4-data-files--where-the-content-lives)
5. [Section-by-Section Breakdown](#5-section-by-section-breakdown)
6. [How Lazy Loading Works](#6-how-lazy-loading-works)
7. [Adding a New Project](#7-adding-a-new-project)
8. [Adding a New 3D Model](#8-adding-a-new-3d-model)
9. [Updating Personal Info](#9-updating-personal-info)
10. [Common Tasks Quick Reference](#10-common-tasks-quick-reference)

---

## 1. Project Structure Overview

```
shujan-portfolio/
├── public/                        ← Static files served at root URL
│   ├── favicon.svg
│   └── resume.pdf                 ← DROP YOUR RESUME PDF HERE
│
├── src/
│   ├── assets/                    ← Imported assets (processed by Vite)
│   │   ├── images/                ← Your profile photo goes here
│   │   ├── icons/                 ← Custom SVG icons (optional)
│   │   ├── models/                ← Local GLB files (small prototypes only)
│   │   └── videos/                ← Local videos (NOT recommended — use Cloudinary)
│   │
│   ├── components/
│   │   ├── common/                ← Button, Card, SectionTitle, Loader
│   │   ├── layout/                ← Navbar, Footer, Layout, Container
│   │   ├── sections/              ← Every home page section
│   │   │   ├── Hero.jsx
│   │   │   ├── HeroCanvas.jsx     ← Lazy wrapper for R3F scene
│   │   │   ├── About.jsx
│   │   │   ├── FeaturedProjects.jsx
│   │   │   ├── Showcase.jsx       ← Asset Library (Models)
│   │   │   ├── GameplayVideos.jsx
│   │   │   ├── TechnicalBreakdown.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Resume.jsx
│   │   │   └── Contact.jsx
│   │   ├── game/                  ← GameCard, GameVideo
│   │   └── model/                 ← ModelCard, ModelViewer, ModelScene
│   │
│   ├── data/                      ← ALL content lives here as JSON
│   │   ├── games.json             ← Projects + videos + technical breakdown
│   │   ├── models.json            ← 3D model assets
│   │   └── skills.json            ← Skills by category
│   │
│   ├── hooks/
│   │   └── useIntersectionObserver.js
│   │
│   ├── pages/                     ← Route-level page components
│   │   ├── Home.jsx
│   │   ├── Games.jsx
│   │   ├── Models.jsx
│   │   └── About.jsx
│   │
│   ├── scenes/                    ← R3F canvas scenes (Three.js isolated here)
│   │   ├── HeroScene.jsx          ← Hero panel 3D scene
│   │   └── Experience.jsx         ← (reserved for future use)
│   │
│   └── utils/
│       └── breakdownIcons.jsx     ← Icon map for TechnicalBreakdown section
│
└── index.html                     ← Root HTML, meta tags, font preloads
```

---

## 2. User Interaction Flow

### Page Load (Home)

```
Browser loads index.html
  → Parses index-[hash].js  (React + Framer Motion + Router — ~114KB gz)
  → Renders Navbar + Hero text immediately
  → React.lazy fires for Home.jsx chunk (~10KB)
  → HeroCanvas lazy-loads HeroScene.jsx + Environment (~260KB gz total)
     — shows pulsing ring fallback until ready
  → User sees hero text in ~0.3s, 3D scene in ~1–2s depending on connection
```

### Scrolling Down (Home)

Each section below the hero uses `whileInView` from Framer Motion:

```
Scroll past hero
  → About section: text fades up left, expertise cards stagger in from right
  → FeaturedProjects: header fades, cards stagger up one by one
  → Showcase (Models): cards stagger in 3-col grid
     → Click "View Model" → ModelViewer modal opens
        → ModelScene.jsx lazy-loads (~22KB gz)
        → GLB file fetches from its URL
        → OrbitControls: drag=rotate, scroll=zoom, right-click=pan
  → GameplayVideos: each GameVideo card observes itself independently
     → Card enters viewport → <video src> is injected (Cloudinary fetch begins)
     → Hover card → video.play()
     → Move mouse away → video.pause(), rewind to 0
     → Click → toggle play/pause
  → TechnicalBreakdown: click project tab → cross-fade accordion
     → Click accordion item → animated height expand
     → Click again → collapse
  → Skills: each category card observes itself
     → Card enters viewport → all bars animate width 0% → level%
     → Staggered delay per bar (0.07s per skill)
  → Resume: timeline items fade up with custom delay per index
  → Contact: fill form → submit → spinner → success state
```

### Navbar Interaction

```
Desktop:
  Scroll > 20px → navbar background: transparent → black/80 + backdrop-blur
  Hover nav link → underline slides in from left (width 0 → 100%)
  Active route → link is full white, others are 60% opacity

Mobile (< 768px):
  Tap hamburger → 3 bars animate to X
  Drawer slides in from right (spring animation)
  Body scroll is locked (overflow: hidden on <body>)
  Tap backdrop or nav link → drawer closes, scroll restored
```

### Games Page (`/games`)

```
Loads GameCard grid (all games, 2-col on lg)
If multiple engines exist → filter pills appear
Click filter pill → grid re-mounts with AnimatePresence key change
  → new cards stagger in
Gameplay videos section appears below if any game has video.url set
```

### Models Page (`/models`)

```
Loads ModelCard grid (all models, 3-col on lg)
Category filter pills auto-generated from data
Click "View Model" → ModelViewer modal
  → AnimatePresence fade in
  → If model.model (GLB URL) is set → ModelScene renders it
  → If not → "Interactive viewer coming soon" placeholder
  → Click backdrop or X → modal fades out
```

---

## 3. Asset Placement Guide

### Your Photo / Profile Image

**Where to use it:** The About section (`src/components/sections/About.jsx`) currently
shows a text-only layout. To add your photo:

1. Place your image here:
   ```
   src/assets/images/shujan-profile.jpg   (or .png, .webp)
   ```

2. Import and use it in `About.jsx`:
   ```jsx
   import profilePhoto from "../../assets/images/shujan-profile.jpg";

   // Add an <img> tag to the left column:
   <img
     src={profilePhoto}
     alt="Shujan — Unity Game Developer"
     loading="lazy"
     className="w-full rounded-2xl border border-[rgba(225,220,201,0.15)]"
   />
   ```

**Recommended specs:** 600×600px minimum, square or portrait, JPG/WebP, < 300KB.

---

### Game Thumbnails

**Used in:** `GameCard.jsx` — shown on both the home FeaturedProjects section and the `/games` page.

**Where to place:**
```
src/assets/images/games/demolition-derby-survival.jpg
src/assets/images/games/hell-drive.jpg
```

**How to wire up** — update `games.json`:
```json
{
  "id": "demolition-derby-survival",
  "thumbnail": "/src/assets/images/games/demolition-derby-survival.jpg",
  ...
}
```

> **Note:** Because images are imported via a JSON file (not a direct JS import),
> use the Vite public folder instead for simplicity:
> ```
> public/images/games/demolition-derby-survival.jpg
> ```
> Then in games.json: `"thumbnail": "/images/games/demolition-derby-survival.jpg"`

**Recommended specs:** 1280×720px (16:9), JPG/WebP, < 200KB each.

---

### Gameplay Videos (Cloudinary)

Videos are **never stored in this repo**. They live on Cloudinary and are referenced by URL.

**How to upload to Cloudinary:**
1. Go to [cloudinary.com](https://cloudinary.com) → Media Library
2. Upload your `.mp4` file
3. Copy the delivery URL — it looks like:
   ```
   https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1234567890/your-video.mp4
   ```

**Where to put the URL** — update `games.json`:
```json
"video": {
  "url": "https://res.cloudinary.com/your-cloud/video/upload/gameplay-demo.mp4",
  "poster": "https://res.cloudinary.com/your-cloud/image/upload/gameplay-poster.jpg",
  "duration": "1:24",
  "label": "Gameplay Demo"
}
```

The `poster` is a static image shown before the video loads — export a good frame from your
video in Cloudinary (Transformations → Generate thumbnail) or use a game screenshot.

**How it loads:**
- `poster` image loads as normal background
- `video src` is NOT set until the card scrolls into view (`useIntersectionObserver`)
- Cloudinary only starts streaming when the user hovers the card

---

### 3D Model Previews (Images)

**Used in:** `ModelCard.jsx` — the preview image shown on the card before the viewer opens.

**Where to place:**
```
public/images/models/muscle-car.jpg
public/images/models/derby-car.jpg
public/images/models/workshop-interior.jpg
```

**Wire up in `models.json`:**
```json
{
  "id": "vehicle-001",
  "preview": "/images/models/muscle-car.jpg",
  ...
}
```

**Recommended specs:** 800×600px (4:3), JPG/WebP, < 150KB each. Export a nice beauty
render from Blender (Cycles, HDRI lighting, clean background).

---

### 3D Model Files (GLB)

**Used in:** `ModelScene.jsx` — loaded by `useGLTF(url)` inside the viewer.

**Option A — Host externally (recommended for large files)**

Upload to:
- Cloudinary (supports GLB)
- AWS S3 / Google Cloud Storage
- Sketchfab (public URL)

Then in `models.json`:
```json
{
  "id": "vehicle-001",
  "model": "https://res.cloudinary.com/your-cloud/raw/upload/muscle-car.glb",
  ...
}
```

**Option B — Place in the project (only for small files < 2MB)**

```
public/models/muscle-car.glb
public/models/derby-car.glb
```

Then in `models.json`:
```json
{
  "model": "/models/muscle-car.glb"
}
```

**How to export GLB from Blender:**
1. File → Export → glTF 2.0 (.glb/.gltf)
2. Format: GLB
3. Include: Mesh, Materials, Textures (pack into GLB)
4. Apply Modifiers: ✓
5. Draco compression: ✓ (reduces size 70–90%)

> Draco requires the `@react-three/drei` `useGLTF` loader which already supports it.

---

### Resume PDF

**Where to place:**
```
public/resume.pdf
```

This is already wired in the Navbar ("Resume" button), Hero ("Download Resume" button),
and the Resume section ("Download PDF" button). All three link to `/resume.pdf`.

Just drop your PDF in the `public/` folder and it's live.

---

## 4. Data Files — Where the Content Lives

Everything content-related is in `src/data/`. You never need to edit JSX to update content.

### `src/data/games.json`

Controls: FeaturedProjects section, Games page, GameplayVideos section, TechnicalBreakdown section.

```json
{
  "id": "unique-kebab-case-id",
  "title": "Game Title",
  "description": "Short description shown on card",
  "thumbnail": "/images/games/your-thumbnail.jpg",
  "engine": "Unity",
  "technologies": ["C#", "Unity", "Blender"],
  "featured": true,            // true = shown on Home page
  "video": {
    "url": "https://cloudinary.com/...",
    "poster": "https://cloudinary.com/...",
    "duration": "1:24",
    "label": "Gameplay Demo"
  },
  "breakdown": [               // Feeds TechnicalBreakdown accordion
    {
      "id": "unique-id",
      "label": "System Name",
      "icon": "cpu",           // See utils/breakdownIcons.jsx for all options
      "summary": "One-line summary (shown collapsed)",
      "details": "Full paragraph (shown expanded)"
    }
  ],
  "links": {
    "details": "/games/your-id",
    "gameplay": ""             // External gameplay URL (leave empty to hide button)
  }
}
```

Available `breakdown` icons: `cpu`, `wrench`, `sliders`, `zap`, `map`, `star`, `trending-up`, `layout`

---

### `src/data/models.json`

Controls: Showcase section (home), Models page.

```json
{
  "id": "unique-kebab-case-id",
  "title": "Model Name",
  "category": "Vehicle",        // Used for filter pills on /models
  "software": ["Blender"],
  "tags": ["Low Poly", "Game Ready", "PBR"],
  "polycount": "12.4k tris",    // Shown as badge on card
  "preview": "/images/models/your-preview.jpg",
  "model": "/models/your-model.glb",  // or Cloudinary URL
  "featured": true              // true = shown on Home Showcase section
}
```

---

### `src/data/skills.json`

Controls: Skills section. Level is 0–100 (drives the animated progress bar width).

```json
{
  "category": "Category Name",
  "icon": "gamepad",            // Options: gamepad, box, globe, tool
  "skills": [
    { "name": "Skill Name", "level": 85 }
  ]
}
```

---

## 5. Section-by-Section Breakdown

| # | Section | Component | Data Source | User Interaction |
|---|---------|-----------|-------------|-----------------|
| 1 | Navbar | `layout/Navbar.jsx` | Hardcoded links | Scroll → glassmorphism. Mobile → drawer |
| 2 | Hero | `sections/Hero.jsx` | Hardcoded text | Mouse → camera parallax. Scroll → indicator |
| 3 | About | `sections/About.jsx` | Hardcoded text | Scroll into view → stagger animate |
| 4 | Featured Projects | `sections/FeaturedProjects.jsx` | `games.json` (featured:true) | Cards animate in. Click → navigate |
| 5 | Asset Library | `sections/Showcase.jsx` | `models.json` (featured:true) | Click "View Model" → modal opens |
| 6 | Gameplay Videos | `sections/GameplayVideos.jsx` | `games.json` (has video object) | Scroll → src injected. Hover → play |
| 7 | Technical Breakdown | `sections/TechnicalBreakdown.jsx` | `games.json` (has breakdown array) | Click tab → switch project. Click item → expand |
| 8 | Skills | `sections/Skills.jsx` | `skills.json` | Scroll into view → bars animate |
| 9 | Resume | `sections/Resume.jsx` | Hardcoded in component | Scroll → timeline items animate |
| 10 | Contact | `sections/Contact.jsx` | Hardcoded in component | Fill form → validate → submit |
| 11 | Footer | `layout/Footer.jsx` | Hardcoded links | Click nav/social links |

---

## 6. How Lazy Loading Works

```
Initial page load (what the browser downloads first):
  index-[hash].js      ~114KB gz   React, Router, Framer Motion
  index-[hash].css     ~7KB gz     All Tailwind styles

When user visits Home (/):
  Home-[hash].js       ~10KB gz    All 9 home sections

When Hero mounts (only on Home):
  HeroScene-[hash].js  ~3.5KB gz   The scene code
  Environment-[hash].js ~256KB gz  Three.js + HDRI presets (largest chunk)

When user clicks "View Model":
  ModelScene-[hash].js ~22KB gz    The model viewer R3F scene
  [your-model].glb     variable    The actual 3D file

When user visits /games:
  Games-[hash].js      ~2.5KB gz   Games page
  games-[hash].js      ~4KB gz     GameCard + GameVideo

When user visits /models:
  Models-[hash].js     ~2.7KB gz   Models page
  models-[hash].js     ~9KB gz     ModelCard + ModelViewer
```

**Result:** A user visiting only the Home page never downloads `/games` or `/models` code.
A user on `/games` never downloads Three.js. The 3D scene only loads on Home.

---

## 7. Adding a New Project

1. **Add entry to `src/data/games.json`**
2. **Add thumbnail** → `public/images/games/your-game.jpg`
3. **Upload gameplay video** → Cloudinary → paste URL in `video.url`
4. **Upload poster frame** → Cloudinary → paste URL in `video.poster`
5. **Write breakdown entries** — minimum 2, maximum 6 work well visually
6. Set `"featured": true` to show it on the Home page

No JSX changes needed. The components read from JSON automatically.

---

## 8. Adding a New 3D Model

1. **Export GLB from Blender** (File → Export → glTF 2.0, format GLB, enable Draco)
2. **Upload GLB** → `public/models/your-model.glb` or Cloudinary
3. **Render a preview image** → `public/images/models/your-model.jpg`
4. **Add entry to `src/data/models.json`**
5. Set `"featured": true` to show it on the Home Showcase section

---

## 9. Updating Personal Info

| What | Where |
|------|-------|
| Your name/title in browser tab | `index.html` → `<title>` |
| Meta description (SEO) | `index.html` → `<meta name="description">` |
| Hero headline + roles + description | `src/components/sections/Hero.jsx` → top of file |
| Stats (Years / Projects / Engine) | `src/components/sections/Hero.jsx` → stats array |
| About bio text | `src/components/sections/About.jsx` |
| Resume timeline entries | `src/components/sections/Resume.jsx` → `education` / `experience` arrays |
| Contact info cards | `src/components/sections/Contact.jsx` → info cards array |
| Social links (GitHub, LinkedIn, Email) | `src/components/sections/Contact.jsx` → `socials` array |
| Footer social links | `src/components/layout/Footer.jsx` → `socials` array |
| Navbar resume button target | All link to `/resume.pdf` — just drop the file in `public/` |

---

## 10. Common Tasks Quick Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for lint errors
npm run lint
```

**To add a new breakdown icon:**
1. Open `src/utils/breakdownIcons.jsx`
2. Add a new key with an SVG element
3. Reference it in `games.json` breakdown entries via the `"icon"` field

**To connect a real form endpoint (Contact section):**
1. Sign up at [formspree.io](https://formspree.io) (free tier available)
2. Create a form, get your endpoint URL
3. Open `src/components/sections/Contact.jsx`
4. Find the comment `// Replace this with your actual form endpoint`
5. Replace the `setTimeout` with a real `fetch`:
   ```js
   const res = await fetch("https://formspree.io/f/YOUR_ID", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(form),
   });
   if (!res.ok) throw new Error("Failed");
   setStatus("success");
   ```

**To change skill levels:**
Edit the `"level"` values in `src/data/skills.json`. Range is 0–100.

**To add a new skill category:**
Add a new object to `skills.json`. The grid automatically adds a new card.
Add its icon key to the `categoryIcons` map in `Skills.jsx`.

---

*This guide covers the portfolio as built through Step 12. Steps 13 (Performance Pass)
and 14 (Deployment) will follow.*

---

---

## QUICK CHANGE INSTRUCTIONS

These three sections answer the most common update tasks exactly —
which files to touch, in what order, and what to type.

---

## A. Changing Your Profile Picture

### Files involved
```
src/assets/images/          ← where you put the photo file
src/components/sections/About.jsx  ← the only JSX file you edit
```

### Step-by-step

**Step 1 — Add the image file**

Place your photo in:
```
src/assets/images/shujan-profile.jpg
```
Accepted formats: `.jpg`, `.png`, `.webp`
Recommended size: 600×600 px or 600×800 px, under 300 KB.
Name it whatever you want — just be consistent in the next step.

---

**Step 2 — Open `src/components/sections/About.jsx`**

At the very top of the file, after the existing imports, add one line:

```jsx
// existing imports already there:
import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";

// ADD THIS LINE:
import profilePhoto from "../../assets/images/shujan-profile.jpg";
```

---

**Step 3 — Add the image to the layout**

Inside `About.jsx`, find this block (it is the left column):

```jsx
{/* ── Left: Text Content ── */}
<motion.div
  initial="hidden"
  whileInView="visible"
  ...
  className="flex flex-col gap-6"
>
  <motion.div variants={fadeUp}>
    <SectionTitle label="Introduction" title="About Me" align="left" />
  </motion.div>
```

Add the photo **above** the `<SectionTitle>` line:

```jsx
{/* ── Left: Text Content ── */}
<motion.div
  initial="hidden"
  whileInView="visible"
  ...
  className="flex flex-col gap-6"
>
  {/* PHOTO — add this block */}
  <motion.div variants={fadeUp}>
    <img
      src={profilePhoto}
      alt="Shujan — Unity Game Developer & Technical Artist"
      loading="lazy"
      decoding="async"
      className="w-40 h-40 rounded-2xl object-cover border border-[rgba(225,220,201,0.15)]"
    />
  </motion.div>

  <motion.div variants={fadeUp}>
    <SectionTitle label="Introduction" title="About Me" align="left" />
  </motion.div>
```

---

**Step 4 — Save and verify**

Run `npm run dev`. The About section will now show your photo above the heading.
To make it larger, change `w-40 h-40` to `w-full` and remove the fixed height.

### Summary — files touched
| File | What you did |
|------|-------------|
| `src/assets/images/shujan-profile.jpg` | Added the image |
| `src/components/sections/About.jsx` | Added import + `<img>` tag |

No other files need to change.

---

---

## B. Adding or Updating a Project

A "project" in this portfolio is one entry in `games.json`.
It flows through four places automatically — you only edit the JSON and drop files.

### Files involved (in order of processing)
```
src/data/games.json                            ← THE main file you edit
public/images/games/your-game.jpg             ← thumbnail image you drop in
Cloudinary (external)                         ← video + poster you upload there
src/components/sections/FeaturedProjects.jsx  ← reads games.json automatically
src/components/sections/GameplayVideos.jsx    ← reads games.json automatically
src/components/sections/TechnicalBreakdown.jsx← reads games.json automatically
src/components/game/GameCard.jsx              ← renders each card, no changes needed
src/components/game/GameVideo.jsx             ← renders each video card, no changes needed
src/pages/Games.jsx                           ← reads games.json automatically
```

You never edit anything below the horizontal line. Only `games.json` + asset files.

---

### B1. Update an existing project's text / description

Open `src/data/games.json`.
Find the object with the matching `"id"` and change the fields:

```json
{
  "id": "demolition-derby-survival",
  "title": "Demolition Derby Survival",         ← change title here
  "description": "Your new description here.",  ← change description here
  "engine": "Unity",                            ← change engine here
  "technologies": ["C#", "Unity", "Blender"],   ← add/remove tech tags here
  ...
}
```

Save. The card on the Home page and Games page updates automatically.

---

### B2. Add or replace the thumbnail image

**Step 1 — Drop the image file here:**
```
public/images/games/demolition-derby-survival.jpg
```
Use the same kebab-case ID as the project for clarity.
Recommended: 1280×720 px (16:9), JPG or WebP, under 200 KB.

**Step 2 — Update `games.json`:**
```json
{
  "id": "demolition-derby-survival",
  "thumbnail": "/images/games/demolition-derby-survival.jpg",
  ...
}
```

That path starting with `/` means it serves from the `public/` folder.
Save → `npm run dev` → the card shows the image.

---

### B3. Add or replace the gameplay video

Videos are **never stored locally**. Always use Cloudinary.

**Step 1 — Upload to Cloudinary**
1. Log in → Media Library → Upload your `.mp4` file
2. Copy the full delivery URL:
   ```
   https://res.cloudinary.com/YOUR_CLOUD/video/upload/v123/demo.mp4
   ```
3. For the poster (preview frame): in Cloudinary, open the video →
   Transformations → Generate thumbnail → copy the image URL

**Step 2 — Update `games.json`:**
```json
{
  "id": "demolition-derby-survival",
  "video": {
    "url":    "https://res.cloudinary.com/YOUR_CLOUD/video/upload/demo.mp4",
    "poster": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/demo-poster.jpg",
    "duration": "1:24",
    "label":  "Gameplay Demo"
  },
  ...
}
```

Save. The GameplayVideos section on Home and the Games page both pick it up.
The video will NOT load until the card scrolls into view (lazy by design).

---

### B4. Update the Technical Breakdown (accordion content)

Each project has a `breakdown` array in `games.json`.
Each item = one accordion entry in the "Behind the Build" section.

```json
"breakdown": [
  {
    "id":      "ai",               ← unique, kebab-case, no spaces
    "label":   "AI Systems",       ← shown as accordion heading
    "icon":    "cpu",              ← icon key (see list below)
    "summary": "One line shown when collapsed.",
    "details": "Full paragraph shown when the accordion is expanded. Write as much as you need here."
  },
  {
    "id":      "physics",
    "label":   "Physics & Handling",
    "icon":    "sliders",
    "summary": "Custom WheelCollider tuning.",
    "details": "..."
  }
]
```

**Available icon keys:**
`cpu` · `wrench` · `sliders` · `zap` · `map` · `star` · `trending-up` · `layout`

To add a new icon, open `src/utils/breakdownIcons.jsx` and add a key with an SVG.

---

### B5. Add a brand new project (all at once)

Copy this full template into `games.json` as a new array entry:

```json
{
  "id":          "your-project-id",
  "title":       "Your Project Title",
  "description": "A short description of the game and what makes it unique.",
  "thumbnail":   "/images/games/your-project-id.jpg",
  "engine":      "Unity",
  "technologies": ["C#", "Unity", "Blender"],
  "featured":    true,
  "video": {
    "url":      "https://res.cloudinary.com/YOUR_CLOUD/video/upload/your-video.mp4",
    "poster":   "https://res.cloudinary.com/YOUR_CLOUD/image/upload/your-poster.jpg",
    "duration": "0:45",
    "label":    "Gameplay Demo"
  },
  "breakdown": [
    {
      "id":      "system-1",
      "label":   "Core System Name",
      "icon":    "cpu",
      "summary": "One-line summary.",
      "details": "Full technical explanation for the expanded view."
    },
    {
      "id":      "system-2",
      "label":   "Another System",
      "icon":    "zap",
      "summary": "One-line summary.",
      "details": "Full technical explanation."
    }
  ],
  "links": {
    "details":  "/games/your-project-id",
    "gameplay": ""
  }
}
```

Then:
1. Drop thumbnail at `public/images/games/your-project-id.jpg`
2. Upload video to Cloudinary, paste URL
3. Set `"featured": true` to show on Home, `false` to show only on `/games`

### Summary — files touched for a full new project
| File | What you did |
|------|-------------|
| `src/data/games.json` | Added/edited the project entry |
| `public/images/games/your-id.jpg` | Dropped thumbnail image |
| Cloudinary | Uploaded video + poster |

No JSX files need to change.

---

---

## C. Adding or Updating a 3D Model

A "3D model" is one entry in `models.json`.
It flows through three places — Showcase section (Home), Models page, and the ModelViewer modal.

### Files involved (in order of processing)
```
src/data/models.json                        ← THE main file you edit
public/images/models/your-model.jpg        ← preview image you drop in
public/models/your-model.glb               ← GLB file (or Cloudinary URL)
src/components/sections/Showcase.jsx       ← reads models.json automatically
src/pages/Models.jsx                       ← reads models.json automatically
src/components/model/ModelCard.jsx         ← renders each card, no changes needed
src/components/model/ModelViewer.jsx       ← opens the modal, no changes needed
src/components/model/ModelScene.jsx        ← loads the GLB, no changes needed
```

Again — you never edit anything below the horizontal line. Only `models.json` + asset files.

---

### C1. Export your GLB from Blender

1. In Blender: **File → Export → glTF 2.0 (.glb/.gltf)**
2. In the export panel, set:
   - Format: **GLB** (single binary file, not separate)
   - Include: ✓ Mesh Data, ✓ Materials, ✓ Textures (Pack Images)
   - Apply Modifiers: ✓
   - Compression (Draco): ✓ — reduces file size 70–90%, fully supported
3. Export. You get a single `.glb` file.

---

### C2. Place the GLB file

**Option A — Small model (under 2 MB) — store locally:**
```
public/models/muscle-car.glb
```
JSON reference: `"model": "/models/muscle-car.glb"`

**Option B — Large model — upload to Cloudinary (recommended):**
1. Cloudinary → Media Library → Upload → select your `.glb` file
2. Copy the raw delivery URL:
   ```
   https://res.cloudinary.com/YOUR_CLOUD/raw/upload/v123/muscle-car.glb
   ```
JSON reference: `"model": "https://res.cloudinary.com/YOUR_CLOUD/raw/upload/muscle-car.glb"`

> Use `raw/upload` not `video/upload` for GLB files in Cloudinary.

---

### C3. Add the preview image

Render a beauty shot in Blender:
- Cycles renderer, HDRI lighting, dark background to match the site
- Resolution: 800×600 px, JPG or WebP, under 150 KB

Drop it at:
```
public/images/models/muscle-car.jpg
```

---

### C4. Add or update the entry in `models.json`

**To add a new model**, copy this template and add it to the array:

```json
{
  "id":       "vehicle-003",
  "title":    "Muscle Car",
  "category": "Vehicle",
  "software": ["Blender"],
  "tags":     ["Low Poly", "Game Ready", "PBR"],
  "polycount": "12.4k tris",
  "preview":  "/images/models/muscle-car.jpg",
  "model":    "/models/muscle-car.glb",
  "featured": true
}
```

**To update an existing model**, find its `"id"` in the file and change the fields you need.

---

### C5. Field reference

| Field | What it does | Where it shows |
|-------|-------------|---------------|
| `id` | Unique identifier, kebab-case | Used as React key |
| `title` | Model name | Card heading, viewer title bar |
| `category` | e.g. "Vehicle", "Environment", "Character" | Badge on card + filter pill on `/models` |
| `software` | Array of tools used | Small badge top-right of card |
| `tags` | Descriptive tags | Tag pills on card |
| `polycount` | e.g. "12.4k tris" | Mono badge top-right of preview |
| `preview` | Path to preview image | Card thumbnail |
| `model` | Path or URL to `.glb` | Loaded in viewer when "View Model" clicked |
| `featured` | `true` / `false` | `true` = appears on Home Showcase section |

---

### C6. The category filter on `/models` is automatic

When you add a new `"category"` value that didn't exist before,
the filter pill for it appears on the Models page automatically.
No code changes needed.

---

### C7. What happens when "View Model" is clicked

```
User clicks "View Model" on a ModelCard
  → ModelViewer modal opens (AnimatePresence fade in)
  → If model.model is set (has a URL/path):
      → ModelScene.jsx lazy-loads (Three.js only loads NOW, not before)
      → useGLTF(url) fetches the GLB file
      → Model renders with OrbitControls
      → User can: drag to rotate, scroll to zoom, right-click to pan
  → If model.model is empty string "":
      → "Interactive viewer coming soon" placeholder shown
  → Click backdrop or X button → modal closes
```

### Summary — files touched for a new 3D model
| File | What you did |
|------|-------------|
| `src/data/models.json` | Added/edited the model entry |
| `public/images/models/your-model.jpg` | Dropped preview image |
| `public/models/your-model.glb` | Dropped GLB file (or used Cloudinary URL) |

No JSX files need to change.
