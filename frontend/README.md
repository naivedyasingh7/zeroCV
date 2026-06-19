# ZeroCV — Hiring is broken. Talent isn't.

A cinematic, capability-first hiring platform demo. Replaces ATS keyword filtering with vector semantic screening — evaluating a candidate's actual output (project commits, code complexity, engineering velocity) instead of resume keywords and credentials.

---

## Pages

### Page 1 — Storytelling Landing (`/`)
Scroll-driven cinematic experience that follows **Sarah Chen**, a self-taught developer auto-rejected by 69 of 73 job applications despite senior-level engineering output. Sections:

- **Cinematic Intro** — 15.5s GPU-accelerated portal loader with physics-driven CV particles, WebGL singularity shader, logo birth and travel animation. Skippable. Session-cached so it only plays once.
- **The Problem** — ATS filtering cards, live pipeline simulation showing auto-rejections
- **Meet Sarah Chen** — Profile card with animated CountUp rejection stats
- **ATS Failure Stamp** — Scroll-triggered REJECTED stamp with ATS decision board
- **The Talent Ascent** — Sticky scroll section revealing ranking shift: #47 → #2 under ZeroCV
- **Contrast Analysis** — Side-by-side comparison with animated capability progress bars
- **Explainability Graph** — Hover-interactive satellite node graph around Sarah's avatar
- **Talent Constellation** — Multidimensional capability mesh visualization
- **How ZeroCV Thinks** — 4-step pipeline flowchart
- **AI Reasoning Logs** — Hover-reveal reasoning cards
- **Outcome Timeline** — Scroll-driven hiring funnel (6 steps)
- **Valuation Engine Sandbox** — Live cosine similarity scorer with JD + resume inputs, skill extraction, and calendar dispatch simulation
- **Could You Spot Sarah?** — Interactive 5-candidate hiring challenge
- **Anti-Gravity Field** — Floating credentials vs capabilities tag animation
- **CTA + Footer**

### Page 2 — Recruiter Workspace (`/platform`)
Functional recruiter interface:

- **Intake Cards** — Job description paste + candidate upload (drag-and-drop dropzone)
- **AI Processing Pipeline** — Sequential 6-step analysis checklist with animated progress
- **Candidate Table** — Sortable by Capability Score, Learning Velocity, Potential; filterable by recommendation; searchable
- **Hidden Talent Card** — Highlights Sarah Chen's ATS rank (#47) vs ZeroCV rank (#3)
- **Candidate DNA Drawer** — Slide-over panel with capability bars, evidence log, AI reasoning, funnel status tracker, and recruiter action buttons (Generate Questions, Draft Outreach, Get Summary, Schedule Call)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| WebGL Shaders | Raw WebGL (GLSL) |
| Icons | Lucide React + Material Symbols Outlined |
| Fonts | Geist Sans (next/font), JetBrains Mono (next/font) |
| Runtime | React 19 |
| Session State | sessionStorage (auth sync, intro skip state) |

---

## Project Structure

```
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css           # Design tokens, Tailwind @theme, custom animations
│   ├── layout.tsx            # Root layout — fonts, metadata, Material Symbols link
│   ├── page.tsx              # Page 1: Cinematic storytelling landing
│   └── platform/
│       └── page.tsx          # Page 2: Recruiter workspace
└── components/
    ├── AntiGravityCanvas.tsx     # CSS-animated floating credentials vs capabilities field
    └── PortalShaderCanvas.tsx    # WebGL singularity portal (intro + hero background)

public/
└── assets/
    └── partner_female.png    # Sarah Chen profile image
```

---

## Key Behaviours

**Intro Sequence** — Plays once per session. Stored in `sessionStorage` (`zeroCV_intro_played`). Skip button available from the first frame.

**Auth** — Mock session login via `sessionStorage` (`zeroCV_logged_in`). Demo credentials auto-fill via the "⚡ Use Demo Recruiter Credentials" button. Auth state syncs across both pages.

**Navbar** — Symmetrical 3-column grid layout on both pages. Active page shows red glow + spring-animated underline. Inactive links have lower opacity with hover-expanding underline.

**Sandbox Scorer** — Cosine similarity over TF vectors extracted from JD and resume text. Experience years parsed from resume via regex. Outputs fit score, skill tags, and a Hidden Talent / Top Fit label.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build   # production build
npm start       # serve production build
npm run lint    # eslint
```
