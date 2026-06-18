"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Cpu, Sparkles,
  ArrowRight, Lock, Check, Calendar,
  FileText, CheckCircle, RefreshCw,
  ShieldAlert, Trash2
} from "lucide-react";
import PortalShaderCanvas from "../components/PortalShaderCanvas";
import ThreeDnaCanvas from "../components/ThreeDnaCanvas";
import AntiGravityCanvas from "../components/AntiGravityCanvas";

interface ParticlePhysics {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  scale: number;
  opacity: number;
  delay: number;
  active: boolean;
  captured: boolean;
  dInit?: number;
  gravityDelay?: number;
}

// Prepopulated Templates for Live Simulator
const templates = {
  frontend: {
    title: "React Frontend Developer",
    jd: "React Frontend Developer\n- 3+ years experience building interfaces with React and TypeScript\n- Advanced styling layout controls using TailwindCSS\n- State management models and responsive dashboard rendering"
  },
  backend: {
    title: "Python Platform Engineer",
    jd: "Python Platform Engineer\n- 4+ years of professional backend design using Python and Django\n- Relational databases (PostgreSQL/SQL) and Redis cache optimization\n- Docker container orchestration and API integrations"
  }
};



const skillsVocabulary = [
  'react', 'javascript', 'typescript', 'python', 'django', 'flask', 'nodejs', 'express',
  'css', 'html', 'sql', 'postgresql', 'mongodb', 'docker', 'aws', 'kubernetes', 'java',
  'spring', 'c++', 'rust', 'go', 'scikit-learn', 'tensorflow', 'pytorch', 'pandas', 'numpy',
  'tailwindcss', 'nextjs', 'git', 'devops', 'ci/cd'
];

// Reusable CountUp Component
const CountUp = ({ value, duration = 1500, trigger = false }: { value: number; duration?: number; trigger?: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = value;
    const totalSteps = duration / 16;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration, trigger]);

  return <>{count}</>;
};

// Reusable Radial Ring Component
const RadialRing = ({ percentage, colorClass, label, id, trigger = false }: { percentage: number | string; colorClass: string; label: string; id: string; trigger?: boolean }) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference);

  const numericValue = typeof percentage === "number" ? percentage : 80;

  useEffect(() => {
    if (trigger) {
      const offset = circumference - (numericValue / 100) * circumference;
      setDashOffset(offset);
    } else {
      setDashOffset(circumference);
    }
  }, [numericValue, circumference, trigger]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r={radius} stroke="currentColor" strokeWidth="4"></circle>
          <circle
            className={`${colorClass} dna-ring transition-all duration-[1500ms] ease-out`}
            cx="64"
            cy="64"
            fill="transparent"
            id={id}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          ></circle>
        </svg>
        <span className="absolute font-mono font-bold text-white text-xl">
          {typeof percentage === "number" ? `${percentage}%` : percentage}
        </span>
      </div>
      <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mt-4">{label}</span>
    </div>
  );
};

export default function Home() {
  // Opening Loader & Particles State
  const [loaderVisible, setLoaderVisible] = useState(true);

  const [loaderOpacity, setLoaderOpacity] = useState(1);
  const [openingPhase, setOpeningPhase] = useState(0);
  const [particles, setParticles] = useState<{ id: number; layoutType: 'modern' | 'outdated' | 'minimal' | 'creative' | 'academic'; delay: number }[]>([]);
  const [stars, setStars] = useState<{ id: number; size: number; color: string; delay: number }[]>([]);
  const [portalOpacity, setPortalOpacity] = useState(0);
  const [portalGrowth, setPortalGrowth] = useState(0);
  const [portalBuildup, setPortalBuildup] = useState(0);
  const [portalCollapse, setPortalCollapse] = useState(0);
  const [birthFlash, setBirthFlash] = useState(0);
  const [logoTravelCoords, setLogoTravelCoords] = useState({ x: 0, y: 0, scale: 1 });
  const [showNavbarLogo, setShowNavbarLogo] = useState(false);

  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const physicsDataRef = useRef<ParticlePhysics[]>([]);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);
  const starPhysicsRef = useRef<ParticlePhysics[]>([]);
  const openingPhaseRef = useRef<number>(0);

  // Page Scroll-based Visibility Flags (Intersection Observers)
  const [storyActive, setStoryActive] = useState(false);
  const [rejectionActive, setRejectionActive] = useState(false);
  const [comparisonActive, setComparisonActive] = useState(false);
  const [dnaActive, setDnaActive] = useState(false);
  const [explainabilityActive, setExplainabilityActive] = useState(false);

  // References for scroll observers
  const storyRef = useRef<HTMLDivElement | null>(null);
  const rejectionRef = useRef<HTMLDivElement | null>(null);
  const comparisonRef = useRef<HTMLDivElement | null>(null);
  const dnaRef = useRef<HTMLDivElement | null>(null);
  const explainabilityRef = useRef<HTMLDivElement | null>(null);
  const outcomeRef = useRef<HTMLDivElement | null>(null);

  // Interactive Explainability Graph State
  const [activeExplainId, setActiveExplainId] = useState<number | null>(null);

  // Outcome Timeline height track
  const [timelineProgress, setTimelineProgress] = useState(0);

  // Keynote Talent Reveal Scroll State & Ref
  const [revealProgress, setRevealProgress] = useState(0);
  const revealRef = useRef<HTMLDivElement | null>(null);

  // Refs for high-performance scroll tracking (caching layout metrics)
  const outcomeTopRef = useRef(0);
  const outcomeHeightRef = useRef(0);
  const revealTopRef = useRef(0);
  const revealHeightRef = useRef(0);

  // Skip intro flag ref
  const skippedRef = useRef(false);

  // Valuation Engine (Sandbox) State
  const [selectedJdKey, setSelectedJdKey] = useState<'frontend' | 'backend'>('frontend');
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [calcScore, setCalcScore] = useState<number | null>(null);
  const [calcSkills, setCalcSkills] = useState<string[]>([]);
  const [calcExp, setCalcExp] = useState<number>(0);
  const [calcTag, setCalcTag] = useState<string>("None");
  const [aiReasoning, setAiReasoning] = useState<string>("");
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [schedulingState, setSchedulingState] = useState<'idle' | 'loading' | 'success'>('idle');

  // Fetch dispatched invitations from backend
  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/sandbox/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    }
  };

  // Delete a specific invitation
  const deleteSingleInvitation = async (id: string) => {
    try {
      const res = await fetch(`/api/sandbox/invitations?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchInvitations();
      }
    } catch (err) {
      console.error('Failed to delete invitation:', err);
    }
  };

  // Clear all database records (assessments & invitations)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setResumeText(text);

        // Try to guess candidate name from file name if Candidate Name is empty
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/resume/gi, "")
          .trim();

        if (cleanName && !candidateName) {
          const formattedName = cleanName
            .split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
            .trim();
          if (formattedName) {
            setCandidateName(formattedName);
          }
        }
      }
    };
    reader.readAsText(file);
  };

  const clearAllHistory = async () => {
    try {
      const res = await fetch('/api/sandbox/invitations', {
        method: 'DELETE',
      });
      if (res.ok) {
        setInvitations([]);
        setCalcScore(null);
        setAssessmentId(null);
        setSchedulingState('idle');
      }
    } catch (err) {
      console.error('Failed to clear database logs:', err);
    }
  };

  // Responsive Navbar target coordinates
  useEffect(() => {
    const updateTravelCoords = () => {
      const isMobile = window.innerWidth < 768;
      const targetX = isMobile
        ? -(window.innerWidth / 2 - 36)
        : -(window.innerWidth / 2 - 96);
      const targetY = isMobile
        ? -(window.innerHeight / 2 - 34)
        : -(window.innerHeight / 2 - 42);
      const targetScale = isMobile ? 0.25 : 0.2;
      setLogoTravelCoords({ x: targetX, y: targetY, scale: targetScale });
    };
    updateTravelCoords();
    window.addEventListener("resize", updateTravelCoords);
    return () => window.removeEventListener("resize", updateTravelCoords);
  }, []);

  // Fetch invitations on mount
  useEffect(() => {
    fetchInvitations();
  }, []);

  // Opening sequence initialization + scroll lock
  useEffect(() => {
    // Lock scroll immediately
    window.scrollTo(0, 0);
    document.body.classList.add('intro-scroll-lock');
    
    const preventScroll = (e: Event) => { e.preventDefault(); };
    const preventKeyScroll = (e: KeyboardEvent) => {
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
    };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeyScroll, { passive: false });

    // Generate floating resume particles
    const initialPhysics: ParticlePhysics[] = [];
    const width = typeof window !== "undefined" ? window.innerWidth : 1280;
    const height = typeof window !== "undefined" ? window.innerHeight : 720;
    
    const generated = Array.from({ length: 32 }).map((_, i) => {
      // Spawn across the full screen area
      const angle = Math.random() * Math.PI * 2;
      const r = 100 + Math.random() * (Math.min(width, height) * 0.55);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = 80 + Math.random() * 250; // spawn depth
      
      // Gentle float/drift velocities
      const vx = -25 + Math.random() * 50;
      const vy = -25 + Math.random() * 50;
      const vz = -8 + Math.random() * 16;
      
      const rx = -35 + Math.random() * 70;
      const ry = -35 + Math.random() * 70;
      const rz = Math.random() * 360;
      
      const vrx = -15 + Math.random() * 30;
      const vry = -15 + Math.random() * 30;
      const vrz = -20 + Math.random() * 40;
      
      const delay = 1.0 + Math.random() * 0.8; // Appear within first 0.8s after 1s of black screen
      
      const layouts: ('modern' | 'outdated' | 'minimal' | 'creative' | 'academic')[] = ['modern', 'outdated', 'minimal', 'creative', 'academic'];
      const layoutType = layouts[i % 5];
      
      initialPhysics.push({
        x, y, z,
        vx, vy, vz,
        rx, ry, rz,
        vrx, vry, vrz,
        scale: 1.0,
        opacity: 0,
        delay,
        active: false,
        captured: false
      });

      return {
        id: i,
        layoutType,
        delay
      };
    });

    setParticles(generated);
    physicsDataRef.current = initialPhysics;

    // Generate background blue star particles (glowing stardust)
    const starPhysics: ParticlePhysics[] = [];
    const generatedStars = Array.from({ length: 50 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 600;
      
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      const z = 50 + Math.random() * 150;
      
      // Orbit-like drifting speed
      const speed = 10 + Math.random() * 20;
      const vx = -Math.sin(angle) * speed;
      const vy = Math.cos(angle) * speed;
      const vz = -5 + Math.random() * 10;
      
      const delay = 1.0 + Math.random() * 1.5; // Spawn stars after 1s of black screen
      
      // Subtle variations of cosmic blue/indigo
      const colors = [
        'rgba(30, 144, 255, 0.65)',
        'rgba(147, 51, 234, 0.55)',
        'rgba(96, 165, 250, 0.6)',
        'rgba(129, 140, 248, 0.7)'
      ];
      const color = colors[i % colors.length];
      const size = 1 + Math.random() * 2.5;
      
      starPhysics.push({
        x, y, z,
        vx, vy, vz,
        rx: 0, ry: 0, rz: 0,
        vrx: 0, vry: 0, vrz: 0,
        scale: 1.0,
        opacity: 0,
        delay,
        active: false,
        captured: false
      });

      return {
        id: i,
        size,
        color,
        delay
      };
    });

    setStars(generatedStars);
    starPhysicsRef.current = starPhysics;

    let startTimestamp: number | null = null;
    let lastTimestamp: number | null = null;
    let animationFrameId: number;

    // ═══════════════════════════════════════════════════════════════
    // CINEMATIC TIMELINE ENGINE
    // Phase 0: Float       (0.0s – 2.75s) CVs drift (spawns start at 1.0s, giving 1.0s of pure black at start)
    // Phase 1: Portal Birth(2.75s – 5.25s) Portal fades in and grows, no gravity
    // Phase 2: Gravity     (5.25s – 8.75s) CVs spiral into portal
    // Phase 3: Absorption  (8.75s – 10.5s) Portal brightens, collapses to a point (resumes/stars fully gone by 9.75s)
    // Phase 4: Logo Birth  (10.5s – 11.5s) Z logo materializes from energy point, stays alone for 1.0s
    // Phase 5: Text Reveal (11.5s – 14.0s) "ZeroCV" + tagline reveal ("Hiring is broken." then "Talent isn't.")
    // Phase 6: Logo Travel (14.0s – 15.5s) Logo moves to navbar, tagline fades out, hero fades in
    // Phase 7: Complete    (15.5s)         Loader unmounts
    // ═══════════════════════════════════════════════════════════════

    const tick = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
        lastTimestamp = timestamp;
      }
      let elapsed = (timestamp - startTimestamp) / 1000;
      
      if (skippedRef.current) {
        elapsed = 15.5;
      }

      // Calculate actual delta time, capped to avoid large jumps
      const actualDt = lastTimestamp === null ? 0.016 : (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      let dt = actualDt;
      if (dt <= 0 || dt > 0.05) dt = 0.016;

      // Determine current phase
      let currentPhase = 0;
      if (elapsed >= 15.5) {
        currentPhase = 7;
      } else if (elapsed >= 14.0) {
        currentPhase = 6;
      } else if (elapsed >= 11.5) {
        currentPhase = 5;
      } else if (elapsed >= 10.5) {
        currentPhase = 4;
      } else if (elapsed >= 8.75) {
        currentPhase = 3;
      } else if (elapsed >= 5.25) {
        currentPhase = 2;
      } else if (elapsed >= 2.75) {
        currentPhase = 1;
      }

      // Only update React state when phase actually changes
      if (currentPhase !== openingPhaseRef.current) {
        openingPhaseRef.current = currentPhase;
        setOpeningPhase(currentPhase);
      }

      // ── Portal shader uniforms ──
      // Portal opacity: fade in 2.75s–4.25s, hold, then collapse 9.75s–10.5s
      let pOpacity = 0;
      if (elapsed >= 2.75 && elapsed < 4.25) {
        pOpacity = ((elapsed - 2.75) / 1.5) * 0.6;
      } else if (elapsed >= 4.25 && elapsed < 9.75) {
        pOpacity = 0.6;
      } else if (elapsed >= 9.75 && elapsed < 10.5) {
        pOpacity = 0.6 * (1.0 - (elapsed - 9.75) / 0.75);
      }
      setPortalOpacity(pOpacity);

      // Portal growth: 2.75s–5.25s ramp 0→1
      let pGrowth = 0;
      if (elapsed >= 2.75 && elapsed < 5.25) {
        pGrowth = (elapsed - 2.75) / 2.5;
      } else if (elapsed >= 5.25 && elapsed < 9.75) {
        pGrowth = 1.0;
      } else if (elapsed >= 9.75 && elapsed < 10.5) {
        pGrowth = 1.0 - (elapsed - 9.75) / 0.75;
      }
      setPortalGrowth(pGrowth);

      // Portal buildup: energy surge 8.75s–9.75s
      let pBuildup = 0;
      if (elapsed >= 8.75 && elapsed < 9.75) {
        pBuildup = (elapsed - 8.75) / 1.0;
      } else if (elapsed >= 9.75) {
        pBuildup = 1.0;
      }
      setPortalBuildup(pBuildup);

      // Portal collapse: 9.75s–10.5s
      let pCollapse = 0;
      if (elapsed >= 9.75 && elapsed < 10.5) {
        pCollapse = (elapsed - 9.75) / 0.75;
      } else if (elapsed >= 10.5) {
        pCollapse = 1.0;
      }
      setPortalCollapse(pCollapse);

      // Birth flash shockwave at 10.5s
      if (elapsed >= 10.5 && elapsed < 11.3) {
        setBirthFlash(Math.max(0, 1.0 - (elapsed - 10.5) / 0.8));
      } else if (birthFlash !== 0 && elapsed >= 11.3) {
        setBirthFlash(0);
      }

      // Loader overlay fade: 14.0s–15.5s
      if (elapsed >= 14.0) {
        const bgOpacity = Math.max(0, 1.0 - (elapsed - 14.0) / 1.5);
        setLoaderOpacity(bgOpacity);
      }

      // Complete: unmount loader, unlock scroll
      if (elapsed >= 15.5) {
        setLoaderVisible(false);
        setShowNavbarLogo(true);
        document.body.classList.remove('intro-scroll-lock');
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventKeyScroll);
        window.scrollTo(0, 0);
        return;
      }

      // ── CV Particle Physics ──
      const physics = physicsDataRef.current;
      const divs = particlesRef.current;

      for (let i = 0; i < physics.length; i++) {
        const p = physics[i];
        const div = divs[i];
        if (!div) continue;

        // Already captured or after portal collapse starts (9.75s) — keep hidden (only portal stays)
        if (p.captured || elapsed >= 9.75) {
          p.captured = true;
          div.style.opacity = "0";
          continue;
        }

        // Not yet spawned
        if (elapsed < p.delay) {
          div.style.opacity = "0";
          continue;
        }

        if (!p.active) {
          p.active = true;
        }

        // Smooth fade-in over 0.4s from spawn
        const spawnElapsed = elapsed - p.delay;
        const fadeInOpacity = Math.min(0.9, (spawnElapsed / 0.4) * 0.9);

        const d = Math.sqrt(p.x * p.x + p.y * p.y);

        // ── Aerodynamic flutter (ALWAYS active, never fully zeroed) ──
        // Gradually reduce amplitude once gravity starts (5.25s) but keep a minimum
        let flutterScale = 1.0;
        if (elapsed >= 5.25) {
          flutterScale = Math.max(0.15, 1.0 - (elapsed - 5.25) / 4.0);
        }

        const glideFreq = 1.2 + (p.delay * 1.5);
        const glideAmp = 22.0 * flutterScale;
        const glideX = Math.sin(elapsed * glideFreq + p.delay * 10.0) * glideAmp;
        const glideY = Math.cos(elapsed * glideFreq * 0.8 + p.delay * 10.0) * (glideAmp * 0.4);

        // Aerodynamic tilt (pitch and roll) — always present
        const tiltX = Math.cos(elapsed * glideFreq + p.delay * 10.0) * 18.0 * flutterScale;
        const tiltY = Math.sin(elapsed * glideFreq + p.delay * 10.0) * 18.0 * flutterScale;

        const swayX = Math.sin(elapsed * 0.6 + p.delay * 3.0) * 4.0 * flutterScale;
        const swayY = Math.cos(elapsed * 0.5 + p.delay * 3.0) * 4.0 * flutterScale;

        // Constant Z-axis rotation
        p.rz += p.vrz * dt;

        // ── Gravity pull (Phase 2+, starts at 5.25s) ──
        if (elapsed >= 5.25 && !p.captured) {
          // Staggered: far particles react first
          if (p.dInit === undefined) {
            p.dInit = d;
            // Far particles start sooner (lower delay), near particles start later
            const maxDist = Math.min(width, height) * 0.55 + 100;
            p.gravityDelay = Math.max(0, 1.8 * (1.0 - p.dInit / maxDist));
          }

          const gravityTime = elapsed - 5.25;
          const gDelay = p.gravityDelay ?? 0;

          if (gravityTime >= gDelay) {
            const pullAge = gravityTime - gDelay;
            const forceScale = Math.min(1.0, pullAge / 1.2); // smoother ramp up

            let G = 50000; // Cinematic gravity constant
            let inwardRatio = 0.55;
            let orbitalRatio = 0.75;

            if (elapsed >= 8.75) {
              // Absorption surge! Pull inward extremely fast
              G = 350000;
              inwardRatio = 1.2;
              orbitalRatio = 0.15;
            }

            const a = (G * forceScale) / (Math.pow(d, 1.15) + 30);

            const ux = -p.x / (d + 0.01);
            const uy = -p.y / (d + 0.01);
            const tx = -p.y / (d + 0.01);
            const ty = p.x / (d + 0.01);

            // Spiral: inward + orbital
            const ax = a * (ux * inwardRatio + orbitalRatio * tx);
            const ay = a * (uy * inwardRatio + orbitalRatio * ty);

            p.vx += ax * dt;
            p.vy += ay * dt;
            p.vz -= 150 * dt;

            // Drag for smooth spiral
            const drag = 1.0 - 1.6 * dt;
            p.vx *= drag;
            p.vy *= drag;

            // Extra spin near event horizon
            const spin = 1.0 + (80 / (d + 20));
            p.rx += p.vrx * (spin - 1.0) * dt;
            p.ry += p.vry * (spin - 1.0) * dt;
            p.rz += p.vrz * (spin - 1.0) * dt;

            // Subtle tremble near center
            if (d < 80) {
              const tremble = Math.sin(elapsed * 50.0 + p.delay * 30.0) * 0.6 * (1.0 - d / 80);
              p.x += tremble;
              p.y += tremble;
            }
          }
        }

        // Apply velocity
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;

        // Scale down as they approach center (after gravity starts)
        if (elapsed >= 5.25 && d < 150) {
          p.scale = Math.max(0.05, d / 150);
        } else {
          p.scale = 1.0;
        }

        // Fade out as they enter the portal — no hard cutoff
        let opacityScale = 1.0;
        if (elapsed >= 5.25 && d < 120) {
          opacityScale = Math.max(0.0, (d - 10) / 110);
        }
        
        div.style.opacity = (fadeInOpacity * opacityScale).toString();

        // Natural capture when entering the portal center
        if (d < 10 && elapsed >= 5.25) {
          p.captured = true;
          div.style.opacity = "0";
          continue;
        }

        const renderX = p.x + glideX;
        const renderY = p.y + glideY;
        const rotX = p.rx + tiltX + swayX;
        const rotY = p.ry + tiltY + swayY;
        
        div.style.transform = `translate3d(${renderX}px, ${renderY}px, ${p.z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${p.rz}deg) scale(${p.scale})`;
      }

      // ── Star Particle Physics ──
      const sPhysics = starPhysicsRef.current;
      const starDivs = starRefs.current;

      for (let i = 0; i < sPhysics.length; i++) {
        const p = sPhysics[i];
        const div = starDivs[i];
        if (!div) continue;

        if (elapsed < p.delay || p.captured) {
          if (p.captured) div.style.opacity = "0";
          continue;
        }

        if (!p.active) p.active = true;

        const spawnElapsed = elapsed - p.delay;
        const currentStarOpacity = Math.min(0.8, (spawnElapsed / 0.6) * 0.8);

        const sd = Math.sqrt(p.x * p.x + p.y * p.y);

        if (elapsed < 5.25) {
          // Gentle orbit drift (Phases 0 and 1)
          const orbitSpeed = 0.4;
          const sAngle = Math.atan2(p.y, p.x) + orbitSpeed * dt;
          const sDist = sd + p.vz * dt * 0.3;
          p.x = Math.cos(sAngle) * sDist;
          p.y = Math.sin(sAngle) * sDist;
          div.style.opacity = currentStarOpacity.toString();
        } else if (elapsed < 8.75) {
          // Slow spiral inward during gravity phase
          if (sd < 8) {
            p.captured = true;
            div.style.opacity = "0";
            continue;
          }
          const G = 80000;
          const a = G / (Math.pow(sd, 1.2) + 20);
          const sux = -p.x / sd;
          const suy = -p.y / sd;
          const stx = -p.y / sd;
          const sty = p.x / sd;

          p.vx += a * (sux * 0.4 + 0.9 * stx) * dt;
          p.vy += a * (suy * 0.4 + 0.9 * sty) * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (sd < 150) {
            p.scale = Math.max(0, sd / 150);
          }
          div.style.opacity = currentStarOpacity.toString();
        } else if (elapsed < 9.75) {
          // Absorption phase — stars accelerate inward rapidly
          if (sd < 8) {
            p.captured = true;
            div.style.opacity = "0";
            continue;
          }
          const G = 300000;
          const a = G / (Math.pow(sd, 1.1) + 15);
          const sux = -p.x / sd;
          const suy = -p.y / sd;
          p.vx += a * sux * dt;
          p.vy += a * suy * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.scale = Math.max(0, sd / 200);
          div.style.opacity = (currentStarOpacity * Math.max(0, sd / 100)).toString();
        } else {
          // After portal collapse starts (9.75s) — all stars gone (only portal stays)
          p.captured = true;
          div.style.opacity = "0";
          continue;
        }

        div.style.transform = `translate3d(${p.x}px, ${p.y}px, 0px) scale(${p.scale})`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('intro-scroll-lock');
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, []);

  // Scroll and intersection observers
  useEffect(() => {
    if (loaderVisible) return;

    const options = { threshold: 0.25 };

    const observerMap = new Map<React.MutableRefObject<any>, (val: boolean) => void>([
      [storyRef, setStoryActive],
      [rejectionRef, setRejectionActive],
      [comparisonRef, setComparisonActive],
      [dnaRef, setDnaActive],
      [explainabilityRef, setExplainabilityActive],
      [outcomeRef, () => {}],
    ]);

    const observers: IntersectionObserver[] = [];

    observerMap.forEach((setter, ref) => {
      if (ref.current) {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
          }
        }, options);
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    const updateMetrics = () => {
      if (outcomeRef.current) {
        const rect = outcomeRef.current.getBoundingClientRect();
        outcomeTopRef.current = rect.top + window.scrollY;
        outcomeHeightRef.current = rect.height;
      }
      if (revealRef.current) {
        const rect = revealRef.current.getBoundingClientRect();
        revealTopRef.current = rect.top + window.scrollY;
        revealHeightRef.current = rect.height;
      }
    };

    // Calculate layout coordinates after a tiny delay to allow page rendering to settle
    const settleTimeout = setTimeout(updateMetrics, 100);

    // Handle scroll timeline height and keynote reveal progress using cached metrics
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Handle scroll timeline height
      const outcomeTop = outcomeTopRef.current;
      const outcomeHeight = outcomeHeightRef.current;
      if (outcomeHeight > 0) {
        const scrolledPast = viewportHeight / 2 - (outcomeTop - scrollY);
        let progress = scrolledPast / (outcomeHeight - viewportHeight / 2);
        progress = Math.min(Math.max(progress, 0), 1);
        setTimelineProgress(progress * 100);
      }

      // Handle keynote reveal progress
      const revealTop = revealTopRef.current;
      const revealHeight = revealHeightRef.current;
      if (revealHeight > 0) {
        const scrolledPast = scrollY - revealTop;
        let progress = scrolledPast / (revealHeight - viewportHeight);
        progress = Math.min(Math.max(progress, 0), 1);
        setRevealProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMetrics);

    return () => {
      clearTimeout(settleTimeout);
      observers.forEach(o => o.disconnect());
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [loaderVisible]);

  // Valuation computation logic
  const selectJd = (key: 'frontend' | 'backend') => {
    setSelectedJdKey(key);
    setJdText(templates[key].jd);
    calculateMatching(templates[key].jd, resumeText, calcExp, candidateName, githubUrl);
  };



  const calculateMatching = async (jd: string, resume: string, expYears: number, overrideName?: string, overrideGithubUrl?: string) => {
    setSimulating(true);
    setSchedulingState('idle');
    const targetName = overrideName || candidateName;
    const targetGithubUrl = overrideGithubUrl !== undefined ? overrideGithubUrl : githubUrl;

    try {
      const res = await fetch('/api/sandbox/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jdText: jd,
          resumeText: resume,
          candidateName: targetName,
          experience: expYears,
          githubUrl: targetGithubUrl
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalcScore(data.score);
        setCalcSkills(data.skills);
        setCalcTag(data.tag);
        setAiReasoning(data.aiReasoning);
        setAssessmentId(data.id);
      } else {
        console.error('Failed to run similarity evaluation');
      }
    } catch (err) {
      console.error('Error running similarity evaluation:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleManualAnalyze = () => {
    calculateMatching(jdText, resumeText, calcExp, candidateName, githubUrl);
  };

  const triggerSchedule = async () => {
    if (!assessmentId) return;
    setSchedulingState('loading');
    try {
      const res = await fetch('/api/sandbox/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId,
          candidateName,
          score: calcScore,
          tag: calcTag,
          githubUrl
        }),
      });

      if (res.ok) {
        setSchedulingState('success');
        fetchInvitations();
      } else {
        setSchedulingState('idle');
        console.error('Failed to dispatch pipeline invitation');
      }
    } catch (err) {
      setSchedulingState('idle');
      console.error('Error dispatching pipeline invitation:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary">

      {/* 🧭 PERSISTENT HEADER/NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-1000 ${openingPhase >= 6 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* The destination navbar logo */}
            <div className={`w-9 h-9 md:w-11 md:h-11 relative transition-opacity duration-300 ${showNavbarLogo ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-primary/15 blur-md rounded-full scale-150 animate-pulse" />
              <svg
                className="w-full h-full drop-shadow-[0_0_15px_rgba(228,22,19,0.3)] relative"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="gradTopNav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E41613" />
                    <stop offset="100%" stopColor="#C5A880" />
                  </linearGradient>
                  <linearGradient id="gradDiagNav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C5A880" />
                    <stop offset="50%" stopColor="#E41613" />
                    <stop offset="100%" stopColor="#8F0F1E" />
                  </linearGradient>
                  <linearGradient id="gradBotNav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8F0F1E" />
                    <stop offset="100%" stopColor="#C5A880" />
                  </linearGradient>
                </defs>
                <path d="M20,20 H80 L68,36 H20 Z" fill="url(#gradTopNav)" />
                <path d="M80,20 L32,80 H44 L80,36 Z" fill="url(#gradDiagNav)" />
                <path d="M20,80 H80 L68,64 H32 Z" fill="url(#gradBotNav)" />
              </svg>
            </div>
            <span className="font-display-lg text-lg md:text-xl font-black tracking-tight text-white">
              Zero<span className="text-secondary">CV</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/80">
            <a href="#story-section" className="hover:text-primary transition-colors">Sarah's Story</a>
            <a href="#sandbox-section" className="hover:text-primary transition-colors">Sandbox</a>
            <a href="#explainability-section" className="hover:text-primary transition-colors">Engine DNA</a>
            <a href="#outcome-section" className="hover:text-primary transition-colors">Outcomes</a>
          </nav>

          <a 
            href="#sandbox-section" 
            className="border border-primary/30 bg-primary/10 hover:bg-primary/20 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full transition-all"
          >
            Launch App
          </a>
        </div>
      </header>

      {/* 🎬 1. OPENING LOADER OVERLAY */}
      <AnimatePresence>
        {loaderVisible && (
          <div
            id="opening-sequence"
            className="fixed inset-0 z-[9999] flex justify-center items-center overflow-hidden"
            style={{ 
              backgroundColor: `rgba(0, 0, 0, ${loaderOpacity})`,
              pointerEvents: loaderOpacity > 0.1 ? "auto" : "none"
            }}
          >
            {/* Collapse birth flash shockwave */}
            {birthFlash > 0 && (
              <div 
                className="absolute inset-0 bg-white z-[100] pointer-events-none"
                style={{ opacity: birthFlash }}
              />
            )}

            {/* WebGL Singularity Portal */}
            <PortalShaderCanvas 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              opacity={portalOpacity}
              buildup={portalBuildup}
              collapse={portalCollapse}
              growth={portalGrowth}
            />

            {/* Skip Intro Button */}
            <button
              onClick={() => { skippedRef.current = true; }}
              className="absolute bottom-8 right-8 z-[200] bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/60 hover:text-white px-6 py-3 rounded-full border border-white/10 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 hover:border-secondary/30 hover:shadow-[0_0_15px_rgba(197,168,128,0.15)] cursor-pointer hover:scale-102 active:scale-98"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Background blue star particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {stars.map((s, idx) => (
                <div
                  key={s.id}
                  ref={el => { starRefs.current[idx] = el; }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    backgroundColor: s.color,
                    borderRadius: '50%',
                    boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
                    opacity: 0,
                    pointerEvents: 'none'
                  }}
                />
              ))}
            </div>

            {/* Physics-driven CV pages */}
            <div className="absolute inset-0 pointer-events-none">
              {particles.map((p, idx) => (
                <div
                  key={p.id}
                  ref={el => { particlesRef.current[idx] = el; }}
                  className={`resume-particle-physics resume-${p.layoutType}`}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    opacity: 0,
                    pointerEvents: 'none',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.22), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    borderRadius: '1.5px',
                    border: '1.2px solid rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    transformOrigin: 'center center'
                  }}
                >
                  {p.layoutType === 'modern' && (
                    <div className="w-full h-full relative p-[2px] select-none pointer-events-none text-neutral-800 flex flex-col justify-between font-sans bg-white leading-[1.2]">
                      <div className="flex gap-[2px] h-full">
                        {/* Sidebar */}
                        <div className="w-[20px] bg-neutral-100 p-[1.5px] border-r border-neutral-200 flex flex-col gap-[2px] text-[1.4px] text-neutral-500 overflow-hidden shrink-0">
                          <div className="font-extrabold text-[2px] text-primary leading-none tracking-tight">ALEX M.</div>
                          <div className="text-[1.2px] truncate opacity-80">alex@mercer.dev</div>
                          <div className="text-[1.2px] truncate opacity-80">github.com/am</div>
                          <div className="w-full h-[0.2px] bg-neutral-200 my-[1px]" />
                          <span className="font-extrabold text-[1.6px] text-neutral-800 leading-none">SKILLS</span>
                          <span>• React, TS</span>
                          <span>• NextJS, CSS</span>
                          <span>• Node.js, Git</span>
                          <span>• SQL, Python</span>
                          <span>• WebGL, WASM</span>
                        </div>
                        {/* Main panel */}
                        <div className="flex-1 flex flex-col gap-[2px] pt-[1.5px] overflow-hidden">
                          <div>
                            <div className="text-[3.2px] font-extrabold tracking-tight text-neutral-900 leading-[3px]">Alex Mercer</div>
                            <div className="text-[1.8px] text-primary font-semibold leading-none mt-[0.5px]">Software Engineer</div>
                          </div>
                          <div className="w-full h-[0.3px] bg-neutral-200" />
                          
                          <div className="flex flex-col gap-[0.5px]">
                            <span className="font-extrabold text-[2.2px] text-neutral-700 leading-none">EXPERIENCE</span>
                            <span className="font-bold text-[1.8px] text-neutral-850">SaaS CRM — Front-End</span>
                            <span className="text-[1.5px] text-neutral-600">• Built CRM core panel utilizing React, TS</span>
                            <span className="text-[1.5px] text-neutral-600">• Optimized state models: 30% load boost</span>
                          </div>
                          
                          <div className="flex flex-col gap-[0.5px]">
                            <span className="font-extrabold text-[2.2px] text-neutral-700 leading-none">PROJECTS</span>
                            <span className="font-bold text-[1.8px] text-neutral-850">Vector DNA Portal</span>
                            <span className="text-[1.5px] text-neutral-600">• Developed shader accretion engine</span>
                            <span className="text-[1.5px] text-neutral-600">• Implemented physics fluid simulation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
 
                  {p.layoutType === 'outdated' && (
                    <div className="w-full h-full relative p-[3px] select-none pointer-events-none text-neutral-800 flex flex-col gap-[3px] font-serif leading-[1.3]">
                      <div className="text-center">
                        <div className="text-[3.6px] font-extrabold tracking-wide text-neutral-900 leading-none">SARAH CONNOR</div>
                        <div className="text-[1.5px] text-neutral-600 leading-none mt-[1px]">LA, CA | s.connor@cyberdyne.org | 310-555-0199</div>
                      </div>
                      <div className="w-full h-[0.4px] bg-neutral-400" />
                      
                      <div className="flex flex-col gap-[1px]">
                        <span className="font-bold text-[2px] text-neutral-900 leading-none tracking-wider">OBJECTIVE</span>
                        <span className="text-[1.5px] text-neutral-700 leading-normal">Dedicated system engineer seeking a senior role in cloud container orchestration, server clustering, and backend optimization.</span>
                      </div>
 
                      <div className="flex flex-col gap-[1px]">
                        <span className="font-bold text-[2px] text-neutral-900 leading-none tracking-wider">EXPERIENCE</span>
                        <div className="flex justify-between items-baseline font-bold text-[1.8px] text-neutral-850">
                          <span>Cyberdyne Systems — Platform Eng</span>
                          <span className="font-normal text-[1.5px]">2018-Present</span>
                        </div>
                        <span className="text-[1.5px] text-neutral-700 leading-[1.7px]">• Designed relational database scaling models processing 5M daily requests.</span>
                        <span className="text-[1.5px] text-neutral-700 leading-[1.7px]">• Automated Kubernetes cluster deployments on AWS cloud infrastructure.</span>
                      </div>
 
                      <div className="flex flex-col gap-[0.5px]">
                        <span className="font-bold text-[2px] text-neutral-900 leading-none tracking-wider">EDUCATION</span>
                        <span className="text-[1.6px] text-neutral-700 font-bold">BS, Computer Science (Incomplete)</span>
                      </div>
                    </div>
                  )}
 
                  {p.layoutType === 'minimal' && (
                    <div className="w-full h-full relative p-[4px] select-none pointer-events-none text-neutral-800 flex flex-col justify-between font-sans bg-white overflow-hidden leading-[1.2]">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[4px] font-bold text-neutral-900 leading-none">David Chen</div>
                          <div className="text-[1.8px] text-neutral-500 font-medium mt-[1px]">Frontend Developer</div>
                        </div>
                        <div className="text-[1.5px] text-neutral-400 font-mono text-right">david@chen.dev</div>
                      </div>
                      
                      <div className="w-full h-[0.2px] bg-neutral-200" />
 
                      <div className="flex flex-col gap-[1px]">
                        <span className="font-bold text-[1.8px] text-neutral-400 uppercase tracking-widest leading-none">Experience</span>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-[1.8px] text-neutral-800">Vercel — Web Engineer</span>
                          <span className="text-[1.4px] text-neutral-400">2023</span>
                        </div>
                        <span className="text-[1.5px] text-neutral-600 leading-normal">Optimized hydration structures and layout system response times.</span>
                      </div>
 
                      <div className="flex flex-col gap-[1px]">
                        <span className="font-bold text-[1.8px] text-neutral-400 uppercase tracking-widest leading-none">Projects</span>
                        <span className="text-[1.5px] text-neutral-600 leading-normal">Created Three.js visualizers for genome variant analysis datasets.</span>
                      </div>
 
                      <div className="flex flex-col gap-[1px]">
                        <span className="font-bold text-[1.8px] text-neutral-400 uppercase tracking-widest leading-none">Capabilities</span>
                        <span className="text-[1.5px] text-neutral-600 font-medium">React, Next.js, TS, Tailwind, Docker, Git, WebGL</span>
                      </div>
                    </div>
                  )}

                  {p.layoutType === 'creative' && (
                    <div className="w-full h-full relative p-[2px] select-none pointer-events-none text-neutral-800 flex flex-col justify-between font-sans bg-white leading-[1.2] border-t-2 border-secondary">
                      <div className="flex flex-col h-full justify-between p-[1px]">
                        <div>
                          <div className="text-[3.2px] font-black tracking-tight text-neutral-900 leading-none">Chloe Vance</div>
                          <div className="text-[1.8px] text-secondary font-bold leading-none mt-[1px]">Product Designer</div>
                        </div>
                        <div className="w-full h-[0.2px] bg-neutral-200" />
                        <div className="flex flex-col gap-[0.5px]">
                          <span className="font-bold text-[1.8px] text-neutral-800 leading-none">Studio A — UX Lead</span>
                          <span className="text-[1.3px] text-neutral-500 leading-none mt-[0.5px]">• Created vector layouts & WebGL interfaces</span>
                        </div>
                        <div className="flex flex-wrap gap-[0.5px] text-[1.2px] font-mono text-secondary">
                          <span>#figma</span> <span>#motion</span> <span>#webgl</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {p.layoutType === 'academic' && (
                    <div className="w-full h-full relative p-[3px] select-none pointer-events-none text-neutral-800 flex flex-col justify-between font-serif leading-[1.3]">
                      <div className="text-center">
                        <div className="text-[3px] font-bold tracking-wide text-neutral-900 leading-none">Dr. Elena Rostova</div>
                        <div className="text-[1.3px] text-neutral-500 leading-none mt-[0.5px]">Research Fellow | MIT</div>
                      </div>
                      <div className="w-full h-[0.2px] bg-neutral-300 my-[1px]" />
                      <div className="flex flex-col gap-[0.5px]">
                        <span className="font-bold text-[1.6px] text-neutral-800 uppercase tracking-wider">Education</span>
                        <span className="text-[1.4px] text-neutral-700">• PhD in Computer Science, 2024</span>
                      </div>
                      <div className="flex flex-col gap-[0.5px]">
                        <span className="font-bold text-[1.6px] text-neutral-800 uppercase tracking-wider">Publications</span>
                        <span className="text-[1.3px] text-neutral-700 italic leading-none">• "Vector Geometry Accretion Dynamics"</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Cinematic birth and branding emergence block */}
            <div className="relative z-10 text-center flex flex-col items-center justify-center">
              <AnimatePresence>
                {openingPhase >= 4 && (
                  <div className="flex flex-col items-center">
                    
                    {/* Z Logo Container (materializes from energy, then travels to navbar) */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)", x: 0, y: 0 }}
                      animate={
                        openingPhase >= 6
                          ? { scale: logoTravelCoords.scale, opacity: 1, filter: "blur(0px)", x: logoTravelCoords.x, y: logoTravelCoords.y }
                          : { scale: 1, opacity: 1, filter: "blur(0px)", x: 0, y: 0 }
                      }
                      transition={
                        openingPhase >= 6
                          ? { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
                          : { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                      }
                      className="relative w-24 h-24 md:w-32 md:h-32 mb-6"
                    >
                      {/* Shockwave expanding ring born in Phase 4 */}
                      <motion.div
                        className="absolute rounded-full border border-secondary/60 bg-transparent pointer-events-none"
                        initial={{ width: 0, height: 0, opacity: 1, x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                        animate={{ width: 500, height: 500, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      
                      <div className="absolute inset-0 bg-primary/25 blur-xl rounded-full scale-150 animate-pulse" />
                      <svg
                        className="w-full h-full drop-shadow-[0_0_30px_rgba(228,22,19,0.4)] relative"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="gradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E41613" />
                            <stop offset="100%" stopColor="#C5A880" />
                          </linearGradient>
                          <linearGradient id="gradDiag" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C5A880" />
                            <stop offset="50%" stopColor="#E41613" />
                            <stop offset="100%" stopColor="#8F0F1E" />
                          </linearGradient>
                          <linearGradient id="gradBot" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8F0F1E" />
                            <stop offset="100%" stopColor="#C5A880" />
                          </linearGradient>
                        </defs>
                        {/* Top Facet */}
                        <path d="M20,20 H80 L68,36 H20 Z" fill="url(#gradTop)" />
                        {/* Diagonal Facet */}
                        <path d="M80,20 L32,80 H44 L80,36 Z" fill="url(#gradDiag)" />
                        {/* Bottom Facet */}
                        <path d="M20,80 H80 L68,64 H32 Z" fill="url(#gradBot)" />
                      </svg>
                    </motion.div>

                    {/* Logo Text (fades in only when openingPhase >= 5, then fades out as it travels) */}
                    {openingPhase >= 5 && (
                      <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={
                          openingPhase >= 6
                            ? { opacity: 0, y: -10 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display-lg text-5xl md:text-8xl font-black tracking-tighter text-white"
                      >
                        Zero<span className="text-secondary">CV</span>
                      </motion.h1>
                    )}

                    {/* Tagline Container */}
                    <div className="h-16 mt-6 flex flex-col items-center justify-center">
                      {openingPhase >= 5 && (
                        <div className="flex flex-col items-center gap-1">
                          {/* Part 1: Hiring is broken. */}
                          <motion.span
                            initial={{ opacity: 0, y: 15 }}
                            animate={
                              openingPhase >= 6
                                ? { opacity: 0, y: -10 }
                                : { opacity: 1, y: 0 }
                            }
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="font-sans text-lg md:text-2xl font-light tracking-wide text-white"
                          >
                            Hiring is broken.
                          </motion.span>
                          
                          {/* Part 2: Talent isn't. */}
                          <motion.span
                            initial={{ opacity: 0, y: 15 }}
                            animate={
                              openingPhase >= 6
                                ? { opacity: 0, y: -10 }
                                : { opacity: 1, y: 0 }
                            }
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
                            className="font-sans text-lg md:text-2xl font-bold text-primary"
                          >
                            Talent isn't.
                          </motion.span>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* 🧊 3. MAIN CONTENT LAYER */}
      <main className="flex-1 bg-black">

        {/* 🧊 3.1 HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-20 text-center relative overflow-hidden">
          {!loaderVisible && (
            <PortalShaderCanvas calm={true} className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none z-0" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/75 to-black z-0 pointer-events-none" />

          <div className="relative z-10 max-w-4xl flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={openingPhase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 px-4 py-1.5 rounded-full text-secondary text-xs font-semibold uppercase tracking-widest"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Vector Semantic Screening Engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={openingPhase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display-lg text-4xl md:text-8xl leading-none font-extrabold text-white tracking-tight"
            >
              Hiring is broken. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">Talent isn't.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={openingPhase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-on-surface-variant text-base md:text-xl max-w-2xl leading-relaxed font-light"
            >
              Traditional keyword filters reject the top 90% of builders. ZeroCV scans the underlying project commits, engineering velocity, and capability DNA directly in vector space.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={openingPhase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center w-full max-w-md"
            >
              <a
                href="#story-section"
                className="bg-primary text-white px-8 py-4 rounded-full font-mono text-xs font-bold glow-button transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group"
              >
                <span>Read Sarah's Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#sandbox-section"
                className="border border-white/20 hover:border-white/40 bg-white/5 text-white px-8 py-4 rounded-full font-mono text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Test Sandbox Workspace
              </a>
            </motion.div>
          </div>
        </section>

        {/* ⚠️ 4. SARAH CHEN STORY SECTION */}
        <section className="py-section-gap px-6 md:px-20 bg-surface-container-lowest scroll-mt-20" id="story-section" ref={storyRef}>
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Sarah's Profile Card */}
            <div
              className={`glass-card p-10 md:p-12 rounded-2xl border border-white/5 transition-all duration-1000 ${
                storyActive ? "grayscale opacity-50 blur-[0.5px]" : ""
              }`}
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    alt="Sarah Chen"
                    className="w-full h-full object-cover"
                    src="/assets/partner_female.png"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDf7s2oPdNHLFl7E3f3OJoxQVj9gHbFyEd3OoQV1iY5bq7dyR5vwFUOKApzuxZvAkTd33RKT2dZMTFxUIa9ZjJnowsCAM7p3JZw9z1DNJF07X2-zx3SlvDPKp0a92R7kju-FaAlyouxIEh9eOcmix0CTTPUk9fBoM2x8CaZZMkUs-H_PECPNJTE6kex1sDccl_E-fXKBWk0wCfL9IMwFYqf7OOuToHV7yTa6Td-wwXgRIO5ZDJjGcb8bHWF13lndwUNT8UwkE-pDX1s";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-3xl text-white">Sarah Chen</h3>
                  <p className="font-mono text-xs text-secondary mt-1 uppercase tracking-wider font-bold">Self-Taught Frontend Developer</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Education</span>
                  <span className="font-mono text-white text-right">BA Architecture (Unfinished)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Experience</span>
                  <span className="font-mono text-white text-right">Freelance Graphic Design</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">Tech Stack</span>
                  <span className="font-mono text-white text-right">React, TypeScript, Tailwind</span>
                </div>
              </div>
            </div>

            {/* Stats Counter */}
            <div className="lg:pl-12 text-center lg:text-left flex flex-col justify-center gap-6">
              <div>
                <span className="font-mono text-xs text-secondary tracking-widest block mb-4 uppercase font-bold">The Filter Struggle</span>
                <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
                  <div>
                    <span className="font-sans font-black text-6xl md:text-8xl block leading-none text-white">
                      <CountUp value={73} trigger={storyActive} />
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant uppercase mt-2 block">Jobs Applied To</span>
                  </div>
                  <div>
                    <span className="font-sans font-black text-6xl md:text-8xl block leading-none text-primary">
                      <CountUp value={69} trigger={storyActive} />
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant uppercase mt-2 block">Automatic Rejections</span>
                  </div>
                </div>
              </div>
              <p className="font-sans text-on-surface-variant text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 font-light mt-4">
                Sarah does not hold a Computer Science degree. On paper, legacy ATS keyword screens drop her instantly. But her capability is hidden in plain sight.
              </p>
            </div>
          </div>
        </section>

        {/* ❌ 5. TRADITIONAL HIRING REJECTION STAMP */}
        <section className="py-section-gap px-6 bg-black flex justify-center items-center relative min-h-[500px]" ref={rejectionRef}>
          <div className="relative glass-card p-8 md:p-12 max-w-2xl w-full text-center border-primary/20 rounded-2xl">
            {/* Rejection Stamp */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-20">
              <div
                className={`reject-stamp border-[8px] md:border-[12px] border-primary text-primary font-sans text-5xl md:text-7xl px-8 py-3 rounded-xl font-black tracking-widest uppercase select-none ${
                  rejectionActive ? "active scale-100" : "scale-150"
                }`}
              >
                REJECTED
              </div>
            </div>

            {/* Screen Content blurred underneath */}
            <div className="opacity-20 select-none">
              <h4 className="font-mono text-lg text-white mb-4">ATS Profile: Candidate #9812</h4>
              <p className="font-mono text-xs text-on-surface-variant mb-8">Match Score: 12%</p>
              <ul className="text-left space-y-4 font-mono text-xs max-w-md mx-auto">
                <li className="flex items-center gap-3">
                  <span className="text-primary font-bold font-sans text-base">✕</span> No Computer Science Degree Found
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary font-bold font-sans text-base">✕</span> No FAANG Corporate Logos
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary font-bold font-sans text-base">✕</span> Inadequate Corporate Tenure (Under 3 Years)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 🎬 5.5 STICKY KEYNOTE TALENT REVEAL SECTION */}
        <section ref={revealRef} className="relative h-[220vh] bg-black">
          <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-6">
            
            {/* Background Eclipse Glow for Triumphant Reveal */}
            <div 
              className="absolute w-[40vw] h-[40vw] max-w-[500px] rounded-full filter blur-[120px] transition-all duration-1000 pointer-events-none z-0"
              style={{
                background: revealProgress > 0.65 ? 'radial-gradient(circle, rgba(197,168,128,0.18) 0%, rgba(228,22,19,0.04) 50%, rgba(0,0,0,0) 100%)' : 'rgba(0,0,0,0)',
                transform: revealProgress > 0.65 ? 'scale(1.2)' : 'scale(0.8)',
                opacity: revealProgress > 0.65 ? 0.85 : 0
              }}
            />

            <div className="relative z-10 text-center flex flex-col items-center max-w-4xl w-full">
              
              {/* Ranking Label */}
              <span 
                className={`font-mono text-xs uppercase tracking-[0.25em] transition-all duration-700 block ${
                  revealProgress > 0.65 ? "text-secondary font-bold" : "text-on-surface-variant/40"
                }`}
              >
                {revealProgress > 0.65 ? "ZeroCV Capability Ranking" : "Traditional ATS Ranking"}
              </span>

              {/* Massive Rank Number */}
              <h2 
                className={`font-display-lg text-[110px] md:text-[230px] my-4 leading-none font-black tracking-tighter transition-all duration-700 select-none ${
                  revealProgress > 0.65 
                    ? "text-secondary drop-shadow-[0_0_35px_rgba(197,168,128,0.35)] scale-105" 
                    : "text-neutral-800 scale-100"
                }`}
              >
                #{revealProgress <= 0.35 
                  ? 47 
                  : revealProgress >= 0.7 
                    ? 3 
                    : Math.round(47 - ((revealProgress - 0.35) / 0.35) * 44)
                }
              </h2>

              {/* Triumphant Content Cards / Reveal Quote */}
              <div 
                className="transition-all duration-1000 w-full"
                style={{
                  opacity: revealProgress > 0.65 ? 1 : 0,
                  transform: revealProgress > 0.65 ? 'translateY(0)' : 'translateY(30px)',
                  pointerEvents: revealProgress > 0.65 ? 'auto' : 'none'
                }}
              >
                {/* Micro-Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto my-12">
                  <div className="glass-card p-4 rounded-lg border-white/5">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">Focus</p>
                    <p className="font-sans text-xs text-white font-semibold">4 Production Codebases</p>
                  </div>
                  <div className="glass-card p-4 rounded-lg border-white/5">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">Contribution</p>
                    <p className="font-sans text-xs text-white font-semibold">Active Open Source</p>
                  </div>
                  <div className="glass-card p-4 rounded-lg border-white/5">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">Velocity</p>
                    <p className="font-sans text-xs text-white font-semibold">3x Trajectory Curve</p>
                  </div>
                  <div className="glass-card p-4 rounded-lg border-white/5">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-secondary font-bold mb-1">Depth</p>
                    <p className="font-sans text-xs text-white font-semibold">No AI Template Rely</p>
                  </div>
                </div>

                {/* Final Apple Keynote Quote */}
                <p className="font-sans text-xl md:text-3xl leading-tight font-extrabold max-w-2xl mx-auto mt-6">
                  <span className="text-neutral-500 block font-light">Traditional systems saw a resume.</span>
                  <span className="text-white block font-black mt-2">ZeroCV saw potential.</span>
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 📊 6. COMPARISON SECTION */}
        <section className="py-section-gap px-6 md:px-20 bg-background relative overflow-hidden" id="comparison-section" ref={comparisonRef}>
          <div className="max-w-container-max mx-auto">
            <h2
              className={`font-sans font-extrabold text-3xl md:text-6xl text-center mb-20 transition-all duration-1000 ${
                comparisonActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Same Candidate. <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">Different Outcome.</span>
            </h2>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0 items-center">
              {/* Vertical divider line */}
              <div
                className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 comparison-divider ${
                  comparisonActive ? "active" : ""
                }`}
              />

              {/* Left Panel: Traditional ATS */}
              <div
                className={`md:pr-20 transition-all duration-1000 ${
                  comparisonActive ? "opacity-45 translate-x-0" : "opacity-0 -translate-x-12"
                }`}
              >
                <div className="space-y-10">
                  <div>
                    <span className="font-mono text-xs text-on-surface-variant/60 uppercase tracking-widest block mb-2">System One</span>
                    <h3 className="font-sans font-bold text-3xl text-on-surface-variant">Traditional ATS</h3>
                  </div>
                  <ul className="space-y-6 font-mono text-sm">
                    <li className="flex items-center gap-4 text-on-surface-variant">
                      <span className="text-primary text-lg font-sans">✕</span>
                      <span>No CS Degree</span>
                    </li>
                    <li className="flex items-center gap-4 text-on-surface-variant">
                      <span className="text-primary text-lg font-sans">✕</span>
                      <span>Keywords mismatched</span>
                    </li>
                    <li className="flex items-center gap-4 text-on-surface-variant">
                      <span className="text-primary text-lg font-sans">✕</span>
                      <span>Minimal corporate experience</span>
                    </li>
                  </ul>
                  <div className="inline-block border-[4px] border-primary/50 px-6 py-2 rounded text-primary/60 font-sans text-2xl font-black uppercase tracking-wider rotate-[-5deg]">
                    REJECTED
                  </div>
                </div>
              </div>

              {/* Right Panel: ZeroCV */}
              <div
                className={`md:pl-20 transition-all duration-1000 ${
                  comparisonActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`}
              >
                <div className="space-y-10">
                  <div>
                    <span className="font-mono text-xs text-secondary uppercase tracking-widest block mb-2 font-bold">System Two</span>
                    <h3 className="font-sans font-bold text-3xl text-white">ZeroCV Analysis</h3>
                  </div>
                  <ul className="space-y-6 font-mono text-sm">
                    <li className="flex items-center gap-4 text-white">
                      <span className="text-secondary text-lg font-sans">✓</span>
                      <span>Built 4 production React codebases</span>
                    </li>
                    <li className="flex items-center gap-4 text-white">
                      <span className="text-secondary text-lg font-sans">✓</span>
                      <span>Active contributor to major open-source web specs</span>
                    </li>
                    <li className="flex items-center gap-4 text-white">
                      <span className="text-secondary text-lg font-sans">✓</span>
                      <span>Product development rate matches senior levels</span>
                    </li>
                  </ul>
                  <div className="flex items-end gap-6">
                    <div>
                      <span className="font-sans font-black text-6xl md:text-8xl text-secondary leading-none">
                        <CountUp value={94} trigger={comparisonActive} />
                      </span>
                      <span className="font-mono text-[10px] block text-secondary/70 uppercase tracking-widest mt-1 font-bold">DNA Fit Score</span>
                    </div>
                    <div className="bg-secondary/10 border border-secondary/30 px-5 py-2 rounded-full text-secondary font-mono text-xs font-bold animate-pulse mb-2">
                      RECOMMENDED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🧬 7. ZEROCV DNA VISUALIZATION BLOCK (Three.js DNA Mesh background) */}
        <section className="py-28 relative overflow-hidden flex flex-col justify-center items-center bg-[#050505]" ref={dnaRef}>
          {/* Three.js Canvas wrapping background (faint background texture) */}
          <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none">
            <ThreeDnaCanvas />
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center gap-6">
            <span className="font-mono text-xs text-secondary tracking-widest block uppercase animate-pulse font-bold">ANALYSIS INITIATED</span>
            <h2 className="font-sans font-black text-3xl md:text-7xl leading-tight text-white">
              We don't match resumes. <br /> We map <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">capability.</span>
            </h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed font-light">
              ZeroCV traces the exact lineage of a developer's accomplishments. By analyzing repository architectures and code complexity, we build a secure model of their technical profile.
            </p>
          </div>
        </section>

        {/* 🔘 8. CANDIDATE DNA RINGS */}
        <section className="py-16 bg-black border-t border-white/5">
          <div className="max-w-container-max mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-12 text-center justify-items-center">
              <RadialRing id="dna-ring-1" percentage={92} colorClass="text-primary" label="Skill Depth" trigger={dnaActive} />
              <RadialRing id="dna-ring-2" percentage={98} colorClass="text-secondary" label="Velocity" trigger={dnaActive} />
              <RadialRing id="dna-ring-3" percentage={85} colorClass="text-secondary" label="Impact" trigger={dnaActive} />
              <RadialRing id="dna-ring-4" percentage={90} colorClass="text-primary" label="Consistency" trigger={dnaActive} />
              <RadialRing id="dna-ring-5" percentage="LOW" colorClass="text-primary" label="Churn Risk" trigger={dnaActive} />
            </div>
          </div>
        </section>

        {/* 🕸️ 9. WHY SARAH? INTERACTIVE EXPLAINABILITY GRAPH */}
        <section className="py-section-gap px-6 bg-background relative overflow-hidden scroll-mt-20" id="explainability-section" ref={explainabilityRef}>
          <div className="max-w-container-max mx-auto text-center mb-20 flex flex-col items-center gap-4">
            <h2 className="font-sans font-extrabold text-3xl md:text-6xl text-white">Every node of advice is auditable.</h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-2xl font-light">
              Hover over the capability attributes around Sarah to inspect the secure codebase validation indicators.
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto aspect-square md:aspect-[4/3] flex items-center justify-center">
            {/* SVG Connection Vectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <g id="connections-group">
                <line className="node-connection connection-line" x1="50%" y1="50%" x2="20%" y2="20%" style={{ stroke: activeExplainId === 0 ? "#C5A880" : "rgba(197,168,128,0.2)", strokeWidth: activeExplainId === 0 ? "2" : "1", strokeDasharray: activeExplainId === 0 ? "none" : "5, 5" }}></line>
                <line className="node-connection connection-line" x1="50%" y1="50%" x2="80%" y2="20%" style={{ stroke: activeExplainId === 1 ? "#C5A880" : "rgba(197,168,128,0.2)", strokeWidth: activeExplainId === 1 ? "2" : "1", strokeDasharray: activeExplainId === 1 ? "none" : "5, 5" }}></line>
                <line className="node-connection connection-line" x1="50%" y1="50%" x2="85%" y2="50%" style={{ stroke: activeExplainId === 2 ? "#C5A880" : "rgba(197,168,128,0.2)", strokeWidth: activeExplainId === 2 ? "2" : "1", strokeDasharray: activeExplainId === 2 ? "none" : "5, 5" }}></line>
                <line className="node-connection connection-line" x1="50%" y1="50%" x2="80%" y2="80%" style={{ stroke: activeExplainId === 3 ? "#C5A880" : "rgba(197,168,128,0.2)", strokeWidth: activeExplainId === 3 ? "2" : "1", strokeDasharray: activeExplainId === 3 ? "none" : "5, 5" }}></line>
                <line className="node-connection connection-line" x1="50%" y1="50%" x2="20%" y2="80%" style={{ stroke: activeExplainId === 4 ? "#C5A880" : "rgba(197,168,128,0.2)", strokeWidth: activeExplainId === 4 ? "2" : "1", strokeDasharray: activeExplainId === 4 ? "none" : "5, 5" }}></line>
                <line className="node-connection connection-line" x1="50%" y1="50%" x2="15%" y2="50%" style={{ stroke: activeExplainId === 5 ? "#C5A880" : "rgba(197,168,128,0.2)", strokeWidth: activeExplainId === 5 ? "2" : "1", strokeDasharray: activeExplainId === 5 ? "none" : "5, 5" }}></line>
                <line className="node-connection connection-line" x1="50%" y1="50%" x2="50%" y2="15%" style={{ stroke: activeExplainId === 6 ? "#C5A880" : "rgba(197,168,128,0.2)", strokeWidth: activeExplainId === 6 ? "2" : "1", strokeDasharray: activeExplainId === 6 ? "none" : "5, 5" }}></line>
              </g>
            </svg>

            {/* Centered avatar */}
            <div className="relative z-20 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary p-1 bg-black shadow-[0_0_50px_rgba(228,22,19,0.4)]">
              <img
                alt="Sarah Chen"
                className="w-full h-full rounded-full object-cover"
                src="/assets/partner_female.png"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDf7s2oPdNHLFl7E3f3OJoxQVj9gHbFyEd3OoQV1iY5bq7dyR5vwFUOKApzuxZvAkTd33RKT2dZMTFxUIa9ZjJnowsCAM7p3JZw9z1DNJF07X2-zx3SlvDPKp0a92R7kju-FaAlyouxIEh9eOcmix0CTTPUk9fBoM2x8CaZZMkUs-H_PECPNJTE6kex1sDccl_E-fXKBWk0wCfL9IMwFYqf7OOuToHV7yTa6Td-wwXgRIO5ZDJjGcb8bHWF13lndwUNT8UwkE-pDX1s";
                }}
              />
            </div>

            {/* Satellite Nodes mapping overlay info cards */}
            {/* GitHub */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(0)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
              {activeExplainId === 0 && (
                <div className="absolute bottom-full mb-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">GitHub Integrity</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Systematic activity trace validating authorship across 42 repositories.</p>
                </div>
              )}
            </div>

            {/* Projects */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(1)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
              {activeExplainId === 1 && (
                <div className="absolute bottom-full mb-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">Project Depth</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Built multi-tenant modular applications with custom styling rendering frameworks.</p>
                </div>
              )}
            </div>

            {/* Learning Velocity */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[50%] left-[85%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(2)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
              {activeExplainId === 2 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left md:-left-20 z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">Learning Curve</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Consistently ships advanced TypeScript configurations 3x faster than average junior trajectory.</p>
                </div>
              )}
            </div>

            {/* Leadership / Collaboration */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(3)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">groups</span>
              {activeExplainId === 3 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left md:-left-20 z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">Collaboration</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Maintains critical dependencies for three widely recognized open-source modules.</p>
                </div>
              )}
            </div>

            {/* React */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(4)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">vitals</span>
              {activeExplainId === 4 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">React Frameworks</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Deep execution flow in React reconciliation loops and concurrent render bindings.</p>
                </div>
              )}
            </div>

            {/* Next.js / Performance */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[50%] left-[15%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(5)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">layers</span>
              {activeExplainId === 5 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">Layout Performance</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">High proficiency optimizing layout shifts, hydration failures, and custom caching.</p>
                </div>
              )}
            </div>

            {/* Problem Solving */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(6)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              {activeExplainId === 6 && (
                <div className="absolute bottom-full mb-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-center left-1/2 -translate-x-1/2 z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">Reasoning DNA</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Resolves deep system defects and asynchronous bottlenecks without oversight.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🧠 10. AI REASONING ENGINE CARDS */}
        <section className="py-20 px-6 md:px-20">
          <div className="max-w-container-max mx-auto">
            <h3 className="font-sans font-bold text-2xl md:text-3xl text-white mb-10">AI Reasoning Logs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="reveal-node glass-card p-8 rounded-2xl relative group min-h-[200px] flex flex-col justify-between overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-secondary">code</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-white">GitHub Activity Audit</span>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Analyzing repository patterns. Evaluated high semantic density in layout controls and API integration logic.
                </p>
                {/* Hover quote overlay */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-[#0f0f0f] p-8 rounded-2xl flex flex-col justify-center border border-primary/20">
                  <p className="font-mono text-xs text-primary italic leading-relaxed">
                    "Sarah designs layout architectures that resolve complex edge cases in responsiveness. Active shipping index exceeds typical baseline."
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="reveal-node glass-card p-8 rounded-2xl relative group min-h-[200px] flex flex-col justify-between overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-secondary">layers</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-white">Stack Architecture</span>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Analyzing Next.js SSR hydration structures. Project histories reveal deep knowledge of layout and state models.
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-[#0f0f0f] p-8 rounded-2xl flex flex-col justify-center border border-secondary/20">
                  <p className="font-mono text-xs text-secondary italic leading-relaxed">
                    "She does not merely import wrappers; she writes custom render optimizations. Exceptionally clean separation of logic."
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="reveal-node glass-card p-8 rounded-2xl relative group min-h-[200px] flex flex-col justify-between overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-white">Delivery Consistency</span>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Audited 12 production web projects. Showcases consistent delivery on layout optimization and state synchronization.
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-[#0f0f0f] p-8 rounded-2xl flex flex-col justify-center border border-secondary/20">
                  <p className="font-mono text-xs text-secondary italic leading-relaxed">
                    "Autonomous project execution indicates strong problem definition capability. Strong developer track, bypasses degree filters."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 📅 11. SCROLL-DRIVEN OUTCOME TIMELINE */}
        <section className="py-section-gap px-6 md:px-20 bg-background overflow-hidden scroll-mt-20" id="outcome-section" ref={outcomeRef}>
          <div className="max-w-container-max mx-auto text-center">
            <h2 className="font-sans font-black text-3xl md:text-6xl text-white mb-24 leading-tight">
              What if your next hire <br /> looked <span className="text-secondary">exactly like Sarah?</span>
            </h2>

            <div className="relative max-w-4xl mx-auto py-20 px-6">
              {/* Line background */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 z-0" />
              {/* Dynamic scroll overlay timeline progress */}
              <div
                className="absolute left-1/2 top-0 w-px bg-primary -translate-x-1/2 timeline-line transition-all duration-300 z-0"
                style={{ height: `${timelineProgress}%` }}
              />

              <div className="space-y-40 relative z-10">
                {/* Step 1 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 15 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 15 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -left-4 md:-left-40 text-right transition-opacity duration-700 hidden md:block ${timelineProgress >= 15 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">Step 01</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">Candidate Scanned</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 ml-24 text-left transition-opacity duration-700 ${timelineProgress >= 15 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">Candidate Scanned</h4>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 35 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 35 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -right-4 md:-right-40 text-left transition-opacity duration-700 hidden md:block ${timelineProgress >= 35 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">Step 02</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">Technical Assessment</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 mr-24 text-right transition-opacity duration-700 ${timelineProgress >= 35 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">Technical Assessment</h4>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 55 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 55 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -left-4 md:-left-40 text-right transition-opacity duration-700 hidden md:block ${timelineProgress >= 55 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">Step 03</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">Validation Audit</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 ml-24 text-left transition-opacity duration-700 ${timelineProgress >= 55 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">Validation Audit</h4>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 75 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 75 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -right-4 md:-right-40 text-left transition-opacity duration-700 hidden md:block ${timelineProgress >= 75 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">Step 04</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">Offer Dispatched</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 mr-24 text-right transition-opacity duration-700 ${timelineProgress >= 75 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">Offer Dispatched</h4>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex justify-center items-center">
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary shadow-[0_0_20px_rgba(197,168,128,0.4)] flex items-center justify-center z-20 transition-opacity duration-500 ${timelineProgress >= 90 ? "opacity-100" : "opacity-20"}`}>
                    <Check className="text-on-secondary w-4 h-4 font-bold" />
                  </div>
                  <div className={`glass-card p-8 rounded-2xl w-full max-w-md border-secondary/20 relative transition-opacity duration-700 ${timelineProgress >= 90 ? "opacity-100 scale-100" : "opacity-10 scale-95"}`}>
                    <div className="absolute -top-4 -right-4 bg-secondary text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hired</div>
                    <span className="font-mono text-xs text-secondary block mb-2 uppercase font-bold">Step 05</span>
                    <h4 className="font-sans font-bold text-2xl text-white">Sarah Chen Onboarded</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-3 leading-relaxed">
                      Sarah's output matched senior engineering metrics within the first 6 weeks of onboarding, representing a substantial hiring savings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-24 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="#sandbox-section"
                className="bg-primary hover:bg-primary-hover text-white px-12 py-5 rounded-full font-mono text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                Try Valuation Engine
              </a>
              <a
                href="#sandbox-section"
                className="border border-white/10 text-white px-12 py-5 rounded-full font-mono text-xs font-bold hover:bg-white/5 hover:border-white/20 transition-all"
              >
                Book Platform Demo
              </a>
            </div>
          </div>
        </section>

        {/* 💻 12. INTERACTIVE SANDBOX WORKSPACE (Valuation Engine) */}
        <section id="sandbox-section" className="py-section-gap px-6 md:px-20 bg-surface-container-lowest border-t border-white/5 scroll-mt-20">
          <div className="max-w-container-max mx-auto flex flex-col gap-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
              <div>
                <span className="text-secondary text-xs uppercase font-bold tracking-widest block font-mono">Sandbox Environment</span>
                <h2 className="font-sans font-black text-3xl md:text-5xl text-white tracking-tight mt-2">Valuation Engine Workspace</h2>
              </div>
              
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Sandbox Inputs */}
              <div className="lg:col-span-6 flex flex-col gap-8">
                
                {/* 1. Job Requirements Spec */}
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-mono font-bold text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      1. Job Requirements Spec
                    </h3>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => selectJd('frontend')}
                        className={`text-[10px] px-2.5 py-1 rounded font-mono font-bold transition-all ${
                          selectedJdKey === 'frontend' ? "bg-primary text-white" : "bg-black text-on-surface-variant border border-white/10"
                        }`}
                      >
                        Frontend Spec
                      </button>
                      <button 
                        onClick={() => selectJd('backend')}
                        className={`text-[10px] px-2.5 py-1 rounded font-mono font-bold transition-all ${
                          selectedJdKey === 'backend' ? "bg-primary text-white" : "bg-black text-on-surface-variant border border-white/10"
                        }`}
                      >
                        Backend Spec
                      </button>
                    </div>
                  </div>

                  <textarea 
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    rows={5}
                    className="w-full bg-black/50 border border-white/10 rounded-xl text-white text-xs p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono resize-none leading-relaxed"
                  />
                </div>

                {/* 2. Candidate Identity DNA */}
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                  <h3 className="font-mono font-bold text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-secondary" />
                    2. Candidate Identity DNA
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">Candidate Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Jane Doe"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl text-white text-xs p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">Years of Experience</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.5"
                        placeholder="e.g. 5"
                        value={calcExp}
                        onChange={(e) => setCalcExp(parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl text-white text-xs p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">GitHub Profile URL</label>
                    <input
                      type="url"
                      placeholder="e.g. https://github.com/username"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl text-white text-xs p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 3. Candidate Experience Text */}
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-mono font-bold text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      3. Candidate Experience Text
                    </h3>
                    {uploadedFileName && (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        {uploadedFileName.length > 18 ? uploadedFileName.substring(0, 15) + '...' : uploadedFileName}
                      </span>
                    )}
                  </div>
                  
                  {/* File Upload Zone */}
                  <label className="border border-dashed border-white/10 hover:border-secondary/35 bg-black/40 hover:bg-black/60 rounded-xl p-6 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group select-none text-center">
                    <input 
                      type="file" 
                      accept=".txt,.md,.json" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <FileText className="w-7 h-7 text-on-surface-variant group-hover:text-secondary group-hover:scale-105 transition-all" />
                    <span className="text-xs text-white font-mono font-bold uppercase tracking-wider">
                      Upload Resume File
                    </span>
                    <span className="text-[10px] text-on-surface-variant/85 font-sans leading-relaxed mt-0.5">
                      Drag & Drop or click to read text from <span className="text-secondary font-mono">.txt, .md, .json</span> files
                    </span>
                  </label>

                  {/* Text editor view */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex justify-between items-center text-[9px] font-mono text-on-surface-variant uppercase tracking-wider font-bold">
                      <span>Resume Content Editor</span>
                      {resumeText && (
                        <button 
                          onClick={() => { setResumeText(""); setUploadedFileName(""); }}
                          className="text-primary hover:text-red-400 transition-colors cursor-pointer"
                        >
                          Clear Text
                        </button>
                      )}
                    </div>
                    <textarea 
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste resume text details here, or upload a resume file above..."
                      rows={5}
                      className="w-full bg-black/50 border border-white/10 rounded-xl text-white text-xs p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono resize-none leading-relaxed"
                    />
                  </div>
                  
                  <button 
                    onClick={handleManualAnalyze}
                    disabled={simulating}
                    className="bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary font-mono font-bold text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 animate-pulse-slow"
                  >
                    {simulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                        <span>Recomputing Similarity Vectors...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4 text-primary" />
                        <span>Run Similarity Evaluation</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Right Sandbox Outputs */}
              <div className="lg:col-span-6 bg-black border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 min-h-[480px] justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                {simulating ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="text-center">
                      <p className="font-mono font-bold text-white text-xs tracking-wider">ANALYZING PORTFOLIOS...</p>
                      <p className="text-[11px] text-on-surface-variant font-sans mt-2">Computing cosine similarities over context profiles</p>
                    </div>
                  </div>
                ) : calcScore === null ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-on-surface-variant gap-3">
                    <ShieldAlert className="w-12 h-12 text-white/25" />
                    <p className="font-mono font-bold text-white text-xs uppercase">Sandbox Offline</p>
                    <p className="text-[11px] font-sans">Modify parameters on the left to trigger the analysis engine.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 animate-fade-in relative z-10">
                    
                    {/* Top candidate header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-sans font-extrabold text-2xl text-white">{candidateName}</h3>
                        <p className="text-[11px] font-mono text-on-surface-variant uppercase mt-1">Valuation Score Sheet</p>
                      </div>
                      {calcTag !== "None" && (
                        <span className="bg-secondary/20 text-secondary border border-secondary/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {calcTag}
                        </span>
                      )}
                    </div>

                    {/* Circular Fit score panel */}
                    <div className="flex items-center gap-6 bg-surface-container-low border border-white/5 p-5 rounded-2xl glow-border">
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" className="fill-none stroke-white/5" strokeWidth="4"></circle>
                          <circle cx="32" cy="32" r="28" className="fill-none stroke-primary transition-all duration-700" strokeWidth="4" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * calcScore) / 100}></circle>
                        </svg>
                        <span className="absolute font-mono font-bold text-white text-xs">{calcScore}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-secondary font-mono font-bold uppercase tracking-wider block">Fit Alignment Score</span>
                        <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                          Reflects relative structural capability and context keywords matching. Prioritizes code output over formal credentials.
                        </p>
                      </div>
                    </div>

                    {/* Metadata summary grid */}
                    <div className="grid grid-cols-2 gap-4 font-mono">
                      <div className="bg-surface-container-lowest border border-white/5 p-4 rounded-xl">
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Parsed Tenure</span>
                        <span className="text-sm font-bold text-white block mt-1">{calcExp} Years</span>
                      </div>
                      <div className="bg-surface-container-lowest border border-white/5 p-4 rounded-xl">
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Skills Cataloged</span>
                        <span className="text-sm font-bold text-white block mt-1">{calcSkills.length} Mapped</span>
                      </div>
                    </div>

                    {/* Skill Badge container */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[9px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">Matched Skills Vectors</span>
                      <div className="flex flex-wrap gap-1.5">
                        {calcSkills.map((s, idx) => (
                          <span key={idx} className="bg-surface-container border border-white/10 text-[10px] text-white px-2.5 py-1 rounded font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Summary output description */}
                    <div className="bg-primary/5 border border-primary/15 p-4 rounded-xl text-xs text-on-surface-variant leading-relaxed">
                      <span className="font-mono font-bold text-primary block mb-1 uppercase text-[10px]">AI Matching Evaluation</span>
                      {aiReasoning || "Evaluating capability alignment..."}
                    </div>
                  </div>
                )}

                {/* Automation Invitation Sync container */}
                <div className="border-t border-white/10 pt-6 mt-4 shrink-0 flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">Automation Pipeline</span>
                    <span className="flex items-center gap-1.5 text-[9px] text-secondary font-mono font-bold uppercase">
                      <Lock className="w-3 h-3 text-secondary" /> Secure Dispatch
                    </span>
                  </div>

                  {schedulingState === 'idle' && (
                    <button 
                      onClick={triggerSchedule}
                      disabled={simulating || calcScore === null}
                      className="w-full bg-secondary hover:bg-secondary-container text-black font-mono font-black py-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-secondary/10"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Dispatch Invitation Sync</span>
                    </button>
                  )}

                  {schedulingState === 'loading' && (
                    <button 
                      disabled 
                      className="w-full bg-surface-container-high text-on-surface-variant font-mono font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/5"
                    >
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                      <span>Locking calendar availability...</span>
                    </button>
                  )}

                  {schedulingState === 'success' && (
                    <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                      <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div className="text-xs font-sans">
                        <p className="font-bold text-white">Pipeline Dispatched</p>
                        <p className="text-on-surface-variant mt-2 leading-relaxed">
                          📧 Calendar invitation and verified technical report sent to candidate's parsed inbox.
                        </p>
                        <p className="text-on-surface-variant mt-1 leading-relaxed">
                          📅 Block scheduled for next Monday at 10:00 AM.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Live Automation Pipeline Logs (Dispatched Syncs) */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col gap-6 mt-8 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5 relative z-10">
                <div>
                  <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-secondary animate-pulse" />
                    Live Automation Pipeline Logs
                  </h3>
                  <p className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mt-1">
                    Verified candidate invitation syncs stored in persistent backend
                  </p>
                </div>
                {invitations.length > 0 && (
                  <button
                    onClick={clearAllHistory}
                    className="border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary hover:text-white font-mono text-[9px] uppercase tracking-widest px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Pipeline Logs
                  </button>
                )}
              </div>

              {invitations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-on-surface-variant gap-2 relative z-10">
                  <ShieldAlert className="w-8 h-8 text-white/20" />
                  <p className="font-mono font-bold text-white text-xs uppercase tracking-wider">No invitations dispatched yet</p>
                  <p className="text-[11px]">Run a similarity evaluation and click "Dispatch Invitation Sync" to record sync events.</p>
                </div>
              ) : (
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left border-collapse font-mono text-xs text-on-surface-variant">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] text-white uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Candidate</th>
                        <th className="pb-3 font-semibold">Alignment</th>
                        <th className="pb-3 font-semibold">Scheduled Sync Event</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {invitations.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 font-sans font-bold text-white text-sm">
                            {inv.githubUrl ? (
                              <a
                                href={inv.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary hover:underline transition-all flex items-center gap-1.5"
                              >
                                {inv.candidateName}
                                <span className="text-[9px] font-mono text-on-surface-variant/70 font-normal">
                                  (@{inv.githubUrl.trim().replace(/\/$/, "").split("/").pop()})
                                </span>
                              </a>
                            ) : (
                              inv.candidateName
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-white bg-black/40 px-2 py-0.5 rounded border border-white/10 text-[10px]">
                                {inv.score}%
                              </span>
                              {inv.tag !== "None" && (
                                <span className="text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full text-[9px] font-bold">
                                  {inv.tag}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 font-sans text-xs text-on-surface-variant/95">
                            {inv.scheduledTime}
                          </td>
                          <td className="py-4">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Dispatched
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => deleteSingleInvitation(inv.id)}
                              className="text-on-surface-variant/60 hover:text-primary transition-colors p-1.5 rounded hover:bg-white/5 cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>


      </main>

      {/* 🧬 13.5 ANTI-GRAVITY HIDDEN CAPABILITY FIELD */}
      <AntiGravityCanvas />

      {/* 📇 14. FOOTER */}
      <footer className="bg-black border-t border-white/5 py-16 px-6 text-center text-xs text-on-surface-variant mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center">
          <div className="font-mono font-bold text-lg text-white">zero<span className="text-secondary">CV</span></div>
          <p className="leading-relaxed max-w-md">
            © 2026 zeroCV Technologies Inc. All rights reserved. Tracing global talent through vector similarity mapping.
          </p>
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">The Manifesto</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
