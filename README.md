# ZeroCV — Hiring is broken. Talent isn't.

ZeroCV is a cinematic, single-page frontend showcase built for a hackathon. It presents an AI-powered hiring platform concept that replaces traditional ATS keyword filtering with vector semantic screening — analyzing a candidate's actual capability DNA (project commits, code complexity, engineering velocity) instead of resume keywords and credentials.

---

## What It Is

The product narrative follows **Sarah Chen** — a self-taught developer with no CS degree who gets auto-rejected by 69 out of 73 job applications despite having real, senior-level engineering output. ZeroCV's pitch is that traditional hiring systems are broken by design, and that capability-first evaluation surfaces hidden talent that keyword filters miss entirely.

The frontend is a fully interactive, scroll-driven product landing page that demonstrates this concept through live simulations, cinematic animations, and an in-page valuation engine sandbox.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| 3D Graphics | Three.js |
| WebGL Shaders | Raw WebGL (GLSL) |
| Icons | Lucide React |
| Fonts | Geist Sans, JetBrains Mono, Material Symbols Outlined |
| Runtime | React 19 |

---

## Project Structure

```
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css          # Design system tokens, custom animations, utility classes
│   ├── layout.tsx           # Root layout — fonts, metadata, viewport, head links
│   └── page.tsx             # Entire single-page application (all sections, all logic)
└── components/
    ├── AntiGravityCanvas.tsx    # Floating tag field — credentials vs capabilities
    ├── PortalShaderCanvas.tsx   # WebGL singularity portal (intro + hero background)
    └── ThreeDnaCanvas.tsx       # Three.js rotating capability DNA mesh

public/
└── assets/
    └── partner_female.png   # Sarah Chen profile image (used in story + explainability sections)
```

---

## Page Sections

The page is structured as a linear narrative scroll experience with 13 distinct sections:

### 1. Opening Cinematic Loader
A 15.5-second GPU-accelerated intro sequence that plays on first load. Built entirely with `requestAnimationFrame` physics — no animation libraries involved.

- **Phase 0 (0–2.75s)** — 32 physics-driven resume particle cards spawn across the screen and drift in 3D space with aerodynamic flutter, tilt, and Z-depth
- **Phase 1 (2.75–5.25s)** — WebGL singularity portal fades in and grows, 50 stardust particles orbit it
- **Phase 2 (5.25–8.75s)** — Gravity well activates; all particles spiral inward with staggered pull (far particles react first), accumulating speed as they approach the event horizon
- **Phase 3 (8.75–10.5s)** — Absorption surge; portal brightens with energy buildup, particles and stars disappear, portal collapses to a point
- **Phase 4 (10.5–11.5s)** — Birth flash shockwave, ZeroCV "Z" logo materializes from the energy point with an expanding ring
- **Phase 5 (11.5–14s)** — Logo text and tagline ("Hiring is broken." / "Talent isn't.") reveal sequentially
- **Phase 6 (14–15.5s)** — Logo animates to navbar position, hero section fades in, loader overlay fades out
- **Phase 7 (15.5s+)** — Loader unmounts, scroll lock releases

A **Skip Intro** button is available at all times during the sequence.

Five distinct resume card layouts are rendered as miniature DOM components inside the particles: `modern`, `outdated`, `minimal`, `creative`, `academic`.

### 2. Persistent Navbar
Fixed header that appears only after the intro completes (phase 6+). Contains the ZeroCV logo (the same element the intro logo travels into), nav links, and a "Launch App" CTA. Fully responsive with mobile/desktop breakpoints.

### 3. Hero Section
Full-viewport section with the portal WebGL shader running in calm mode as a subtle background texture. Headline, subheadline, and two CTA buttons animate in on intro completion.

### 4. Sarah's Story
Two-column layout: a profile card (photo, credentials, tech stack) and an animated stats counter. The counter triggers via Intersection Observer — `73 jobs applied`, `69 automatic rejections`. The profile card blurs and desaturates on scroll-in to visually reinforce the "rejected" state.

### 5. Traditional ATS Rejection Stamp
A centered card with blurred-out ATS rejection criteria beneath a "REJECTED" rubber stamp that slams in at scale with a spring-physics CSS transition when scrolled into view.

### 6. Sticky Keynote Talent Reveal
A `220vh` sticky scroll section. As the user scrolls through it, a massive rank number animates from `#47` (traditional ATS rank) down to `#3` (ZeroCV rank). At 65% scroll progress, the number changes color to gold, a background eclipse glow appears, and a grid of micro-feature cards and a keynote-style quote reveal.

### 7. Comparison Section
Side-by-side split layout. Left panel (Traditional ATS) fades in at 45% opacity with red ✕ rejection reasons. Right panel (ZeroCV) fades in at full opacity with gold ✓ capability matches and an animated `94` DNA Fit Score counter. A vertical divider line draws itself on scroll-in.

### 8. Capability DNA Visualization
Full-bleed section with the Three.js DNA mesh running as a faint background. Copy-focused section establishing the concept of capability mapping over resume matching.

### 9. DNA Radial Rings
Five animated SVG radial progress rings — Skill Depth (92%), Velocity (98%), Impact (85%), Consistency (90%), Churn Risk (LOW) — each drawing themselves on scroll-in via a `strokeDashoffset` CSS transition.

### 10. Interactive Explainability Graph
An orbital node graph centered on Sarah's profile photo. Seven satellite nodes (GitHub, Projects, Velocity, Leadership, React Core, Performance, Problem Solving) orbit the center connected by animated dashed SVG lines. Hovering a node highlights its connection line and reveals a tooltip card describing the underlying signal ZeroCV detected.

### 11. AI Reasoning Logs
Three glass-card panels showing simulated AI analysis summaries. Each card has a hover state that flips to a first-person AI quote from the analysis engine, styled as italic monospace text.

### 12. Scroll-Driven Outcome Timeline
A vertical timeline with 5 steps (Candidate Scanned → Technical Assessment → Validation Audit → Offer Dispatched → Sarah Onboarded). The timeline line draws itself as the user scrolls through the section, and each step node activates at specific scroll progress thresholds (15%, 35%, 55%, 75%, 90%).

### 13. Valuation Engine Sandbox
The main interactive feature. A two-panel workspace:

**Left — Inputs:**
- Job description textarea (two preset templates: Frontend React spec, Backend Python spec)
- Candidate resume textarea
- Preset buttons to load Alex Mercer (Hidden Talent) or Sarah Connor (Top Fit) profiles
- "Run Similarity Evaluation" button

**Right — Outputs:**
- Animated circular fit score meter
- Candidate tag badge (🔥 Hidden Talent / ⭐ Top Fit)
- Parsed tenure and skills count grid
- Matched skill vector badges
- AI matching evaluation summary text
- "Dispatch Invitation Sync" pipeline button with three states: idle → loading → success

The matching algorithm runs client-side using TF-IDF cosine similarity over tokenized JD and resume text, combined with an experience score weighted 60/40.

### 14. Anti-Gravity Canvas
A `400px` tall section where 22 floating tags drift upward continuously — 11 crossed-out obsolete credential tags (GPA, CS Degree, Corporate Tenure) and 11 glowing capability tags (System Architecture Depth, Concurrent Render Optimizations, Custom Shader Pipelines). Capability tags are hoverable and glow amber on interaction. All animation positions are generated client-side to avoid SSR hydration mismatches.

### 15. Footer
Minimal centered footer with logo, copyright, and three footer links.

---

## Components

### `PortalShaderCanvas.tsx`
A raw WebGL component rendering a GLSL fragment shader. Implements two modes:

- **Cinematic mode** (intro loader) — Blue/purple accretion disk with gravitational lensing ring, spiral gas dynamics via 4-octave FBM noise, coordinate pinch-collapse effect, energy buildup surge, faint starfield, and a white-hot core glow. Controlled by four real-time uniforms: `opacity`, `growth`, `buildup`, `collapse`
- **Calm mode** (hero background) — Warm champagne gold Einstein lensing ring, soft red/gold spiral accretion disk with relativistic dust lanes, extremely subtle ambient fill

Uses `ResizeObserver` for canvas sizing to avoid layout thrashing. Cleans up shaders, program, and buffers on unmount.

### `ThreeDnaCanvas.tsx`
A Three.js scene with a central red sphere (capability DNA core) pulsing with a sine-wave scale, surrounded by 5 gold satellite spheres orbiting it. Connection lines from center to each satellite update their geometry every frame. Full cleanup on unmount (geometries, materials, renderer).

### `AntiGravityCanvas.tsx`
Pure CSS animation component. Generates random `x` position, `duration`, `delay`, `rotationStart`, and `rotationEnd` values on client mount and stores them in state (avoiding SSR/hydration mismatch). Each tag runs an `antiGravityDrift` keyframe animation with CSS custom properties for rotation variance. Capability tags have hover effects applied via scoped `<style>` injection to bypass Tailwind's `translateX` conflict with the animation.

---

## Design System

All design tokens are defined in `globals.css` under the Tailwind v4 `@theme` block.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#E41613` | Red — rejections, CTAs, active states, portal core |
| `--color-secondary` | `#C5A880` | Champagne gold — ZeroCV brand, capability signals, highlights |
| `--color-background` | `#131313` | Page background |
| `--color-surface-container-lowest` | `#0e0e0e` | Deepest card surface |
| `--color-on-surface-variant` | `#a1a1aa` | Secondary text |

### Typography

| Role | Font |
|---|---|
| Display / Headings | Geist Sans (variable) |
| Body | Geist Sans (variable) |
| Monospace / Labels | JetBrains Mono |
| Icon Glyphs | Material Symbols Outlined |

### Custom CSS Classes

| Class | Purpose |
|---|---|
| `.glass-card` | Solid `#111112` surface card with sharp borders and subtle inner highlight — deliberately not a blur/frosted glass effect |
| `.glow-button` | Red shadow glow on hover |
| `.glow-border` | Gradient border via `::before` pseudo-element mask technique |
| `.reject-stamp` | Spring-physics CSS stamp animation |
| `.satellite-node` | Hover scale + gold border + glow for explainability graph nodes |
| `.node-connection` | Animated dashed SVG stroke flowing via `stroke-dashoffset` keyframe |
| `.dna-ring` | 1500ms ease-out `stroke-dashoffset` transition for radial rings |
| `.comparison-divider` | Height-based reveal transition for the split section divider |
| `.resume-particle-physics` | 3D transform-style, will-change, paper texture for the intro CV cards |
| `.anti-gravity-tag` | Compositor-layer translated floating tag with hover scaling |
| `body.intro-scroll-lock` | `overflow: hidden` + `position: fixed` during intro to block all scroll |

### Spacing Tokens

| Token | Value |
|---|---|
| `--spacing-section-gap` | `160px` |
| `--spacing-container-max` | `1200px` |
| `--spacing-margin-desktop` | `80px` |
| `--spacing-margin-mobile` | `24px` |

---

## State Management

All state lives in a single `page.tsx` component. No external state library.

| State | Type | Purpose |
|---|---|---|
| `loaderVisible` | `boolean` | Controls AnimatePresence mount/unmount of intro overlay |
| `loaderOpacity` | `number` | CSS opacity of intro overlay during fade-out phase |
| `openingPhase` | `number` (0–7) | Current cinematic phase — drives all intro conditional rendering |
| `particles` | `array` | Layout metadata for 32 CV particle cards |
| `stars` | `array` | Size/color metadata for 50 stardust particles |
| `portalOpacity/Growth/Buildup/Collapse` | `number` | WebGL shader uniform values passed to PortalShaderCanvas |
| `birthFlash` | `number` | Opacity of white flash shockwave at logo birth |
| `showNavbarLogo` | `boolean` | Fades in the destination navbar logo after intro |
| `storyActive` / `rejectionActive` / etc. | `boolean` | Intersection Observer triggers for scroll-in animations |
| `revealProgress` | `number` (0–1) | Scroll progress through sticky keynote section |
| `timelineProgress` | `number` (0–100) | Scroll progress through outcome timeline section |
| `calcScore` / `calcSkills` / `calcTag` | various | Valuation engine output state |
| `simulating` | `boolean` | Loading state for matching computation |
| `schedulingState` | `'idle' \| 'loading' \| 'success'` | Pipeline dispatch button state |

Physics data for particles and stars is stored in `useRef` arrays (`physicsDataRef`, `starPhysicsRef`) and mutated directly for performance — DOM nodes are also accessed via `useRef` arrays and styled imperatively inside the rAF loop to avoid React re-render overhead.

---

## Performance Notes

- Particle and star physics run entirely in `requestAnimationFrame` with direct DOM style mutations — no React state updates per frame
- `openingPhaseRef` is used to detect phase changes, only calling `setOpeningPhase` when the phase actually changes (not every frame)
- Portal shader canvas sizing is handled by `ResizeObserver` asynchronously
- Scroll metrics (`outcomeTopRef`, `revealTopRef`) are cached in refs and only recalculated on `resize` events, not on every scroll tick
- Intersection Observers are used for all section entry animations instead of scroll listeners
- Three.js renderer pixel ratio is capped at `2` to avoid excessive rendering on high-DPI screens
- `will-change: transform, opacity` is set on all physics particle elements

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Key Files Reference

| File | What's in it |
|---|---|
| `src/app/page.tsx` | Entire SPA — all sections, all state, all logic, cinematic timeline engine |
| `src/app/layout.tsx` | Root layout, metadata, font loading, viewport config |
| `src/app/globals.css` | Full design system — color tokens, typography, all custom CSS classes |
| `src/components/PortalShaderCanvas.tsx` | WebGL GLSL portal shader (both cinematic and calm modes) |
| `src/components/ThreeDnaCanvas.tsx` | Three.js DNA node mesh scene |
| `src/components/AntiGravityCanvas.tsx` | CSS keyframe anti-gravity floating tags |
| `public/assets/partner_female.png` | Sarah Chen profile photo |

---

## Hackathon Context

This is a hackathon prototype. The entire experience is frontend-only — there is no backend, no database, and no real AI. The valuation engine sandbox runs a TF-IDF cosine similarity algorithm entirely in the browser. The "Dispatch Invitation Sync" pipeline button simulates a loading state with a `setTimeout`. The product concept is real; the implementation is a high-fidelity demo.
