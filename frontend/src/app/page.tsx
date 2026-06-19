"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Cpu, Sparkles,
  ArrowRight, Lock, Check, Calendar,
  FileText, CheckCircle, RefreshCw,
  ShieldAlert, LogOut, X,
  Inbox, Filter, GraduationCap, Search, Terminal, Rocket, Zap, Users, Activity, Layers, Code, Dna, Calculator,
  Settings
} from "lucide-react";
import PortalShaderCanvas from "../components/PortalShaderCanvas";
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

const candidates = {
  alex: {
    name: "Alex Mercer",
    resume: "Alex Mercer Resume\nSkills: React, JavaScript, TypeScript, CSS, TailwindCSS, Git.\nProjects: Created SaaS CRM Core Dashboard utilizing hooks and custom states, speeding up ui rendering by 30%.\nTenure: 1.5 years experience.",
    experience: 1.5,
  },
  sarah: {
    name: "Sarah Connor",
    resume: "Sarah Connor Resume\nSkills: Python, Django, SQL, PostgreSQL, Docker, AWS, Kubernetes, Git, Node.js.\nProjects: Designed concurrent billing endpoint in Django and PostgreSQL processing 5M daily requests; automated AWS EKS deployments.\nTenure: 8 years experience.",
    experience: 8.0,
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


export default function Home() {
  const router = useRouter();
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSavedSearchesModal, setShowSavedSearchesModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Settings mock inputs
  const [vectorThreshold, setVectorThreshold] = useState(85);
  const [codeWeight, setCodeWeight] = useState(75);
  const [keywordFilter, setKeywordFilter] = useState(false);
  const [sourcingModel, setSourcingModel] = useState("ZeroCV Core Alpha");

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
  const [birthFlash, setBirthFlashState] = useState(0);
  const birthFlashRef = useRef(0);
  const setBirthFlash = (val: number) => {
    birthFlashRef.current = val;
    setBirthFlashState(val);
  };
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

  // References for scroll observers
  const storyRef = useRef<HTMLDivElement | null>(null);
  const rejectionRef = useRef<HTMLDivElement | null>(null);
  const comparisonRef = useRef<HTMLDivElement | null>(null);
  const explainabilityRef = useRef<HTMLDivElement | null>(null);
  const outcomeRef = useRef<HTMLDivElement | null>(null);

  // Interactive Challenge Selection
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
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
  const [jdText, setJdText] = useState(templates.frontend.jd);
  const [resumeText, setResumeText] = useState(candidates.alex.resume);
  const [candidateName, setCandidateName] = useState(candidates.alex.name);
  const [calcScore, setCalcScore] = useState<number | null>(null);
  const [calcSkills, setCalcSkills] = useState<string[]>([]);
  const [calcExp, setCalcExp] = useState<number>(1.5);
  const [calcTag, setCalcTag] = useState<string>("None");
  const [simulating, setSimulating] = useState(false);
  const [schedulingState, setSchedulingState] = useState<'idle' | 'loading' | 'success'>('idle');

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

  // Trigger evaluation immediately on load for preset
  useEffect(() => {
    calculateMatching(templates.frontend.jd, candidates.alex.resume, candidates.alex.experience);
  }, []);

  // Opening sequence initialization + scroll lock
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const loggedIn = sessionStorage.getItem("zeroCV_logged_in");
        if (loggedIn === "true") {
          setTimeout(() => setIsLoggedIn(true), 0);
        }
        const hasPlayed = sessionStorage.getItem("zeroCV_intro_played");
        if (hasPlayed === "true") {
          const timer = setTimeout(() => {
            setLoaderVisible(false);
            setOpeningPhase(7);
            setLoaderOpacity(0);
            setShowNavbarLogo(true);
            document.body.classList.remove('intro-scroll-lock');
          }, 0);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error(e);
      }
    }

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

    starPhysicsRef.current = starPhysics;

    const initFrameId = requestAnimationFrame(() => {
      setParticles(generated);
      setStars(generatedStars);
    });

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
      } else if (birthFlashRef.current !== 0 && elapsed >= 11.3) {
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
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("zeroCV_intro_played", "true");
          } catch (e) {
            console.error(e);
          }
        }
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
      cancelAnimationFrame(initFrameId);
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

    const observerMap = new Map<React.MutableRefObject<HTMLDivElement | null>, (val: boolean) => void>([
      [storyRef, setStoryActive],
      [rejectionRef, setRejectionActive],
      [comparisonRef, setComparisonActive],
      [explainabilityRef, () => {}],
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
    calculateMatching(templates[key].jd, resumeText, calcExp);
  };

  const loadCandidatePreset = (key: 'alex' | 'sarah') => {
    setResumeText(candidates[key].resume);
    setCandidateName(candidates[key].name);
    setCalcExp(candidates[key].experience);
    calculateMatching(jdText, candidates[key].resume, candidates[key].experience);
  };

  function calculateMatching(jd: string, resume: string, expYears: number) {
    setSimulating(true);
    setSchedulingState('idle');

    setTimeout(() => {
      const cleanTokens = (txt: string) => {
        return txt.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, ' ')
          .split(/\s+/)
          .filter(t => t.length > 2);
      };

      const tokens1 = cleanTokens(jd);
      const tokens2 = cleanTokens(resume);

      const foundSkills: string[] = [];
      skillsVocabulary.forEach(s => {
        const regex = new RegExp(`\\b${s.replace(/\+/g, '\\+')}\\b`, 'i');
        if (regex.test(resume.toLowerCase())) {
          foundSkills.push(s);
        }
      });

      if (tokens1.length === 0 || tokens2.length === 0) {
        setCalcScore(0);
        setSimulating(false);
        return;
      }

      const tfMap1: Record<string, number> = {};
      const tfMap2: Record<string, number> = {};

      tokens1.forEach(t => tfMap1[t] = (tfMap1[t] || 0) + 1);
      tokens2.forEach(t => tfMap2[t] = (tfMap2[t] || 0) + 1);

      const allTerms = new Set([...Object.keys(tfMap1), ...Object.keys(tfMap2)]);

      let dotProduct = 0;
      let magnitude1 = 0;
      let magnitude2 = 0;

      allTerms.forEach(term => {
        const val1 = tfMap1[term] || 0;
        const val2 = tfMap2[term] || 0;

        dotProduct += val1 * val2;
        magnitude1 += val1 * val1;
        magnitude2 += val2 * val2;
      });

      let similarity = 0;
      if (magnitude1 > 0 && magnitude2 > 0) {
        similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
      }

      let skillScore = Math.round(similarity * 100);
      if (skillScore < 45) skillScore = 45 + Math.round(Math.random() * 15);
      if (skillScore > 98) skillScore = 98;

      const expScore = Math.min(100, Math.round((expYears / 5) * 100));
      const finalScore = Math.round(skillScore * 0.6 + expScore * 0.4);

      let tag = "None";
      if (finalScore >= 80 && expYears < 2.5) {
        tag = "🔥 Hidden Talent";
      } else if (finalScore >= 85) {
        tag = "⭐ Top Fit";
      }

      setCalcScore(finalScore);
      setCalcSkills(foundSkills.length > 0 ? foundSkills : ["react", "git", "html"]);
      setCalcTag(tag);
      setSimulating(false);
    }, 800);
  };

  const handleManualAnalyze = () => {
    let years = calcExp;
    const expRegex = /(?:(\d+)\+?\s*(?:year|yr)s?\s*(?:of)?\s*(?:experience|exp|work)?)/gi;
    let match;
    while ((match = expRegex.exec(resumeText.toLowerCase())) !== null) {
      const val = parseInt(match[1]);
      if (val > 0 && val < 20) years = val;
    }
    setCalcExp(years);
    calculateMatching(jdText, resumeText, years);
  };

  const triggerSchedule = () => {
    setSchedulingState('loading');
    setTimeout(() => {
      setSchedulingState('success');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary">

      {/* 🧭 PERSISTENT HEADER/NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-md transition-all duration-1000 ${openingPhase >= 6 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 grid grid-cols-3 items-center">
          
          {/* Column 1: Left - Logo */}
          <div className="flex items-center gap-3 justify-start">
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
          
          {/* Column 2: Center - Home | Platform */}
          <nav className="flex justify-center items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <div className="relative py-1 group">
              <Link 
                href="/" 
                className="text-white font-bold transition-all duration-300 relative"
                style={{ textShadow: "0 0 10px rgba(228, 22, 19, 0.8), 0 0 20px rgba(228, 22, 19, 0.4)" }}
              >
                {"Home"}
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(228,22,19,0.8)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            </div>

            <div className="relative py-1 group opacity-50 hover:opacity-100 transition-opacity duration-300">
              <Link 
                href="/platform" 
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                  }
                }}
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                {"Platform"}
              </Link>
              <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary/60 rounded-full group-hover:w-full group-hover:left-0 transition-all duration-300" />
            </div>
          </nav>

          {/* Column 3: Right - Login / Account */}
          <div className="flex justify-end items-center relative z-50">
            {!isLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="font-mono text-[10px] uppercase tracking-widest text-white/70 hover:text-white px-4 py-2 rounded-full border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10 hover:shadow-[0_0_12px_rgba(228,22,19,0.25)] transition-all duration-300 cursor-pointer"
              >
                {"Login"}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="h-8 w-8 rounded-full border border-amber-500/80 bg-neutral-950 text-amber-400 flex items-center justify-center font-mono text-[11px] font-extrabold shadow-[0_0_12px_rgba(228,22,19,0.35)] hover:shadow-[0_0_18px_rgba(228,22,19,0.5)] hover:border-amber-400 transition-all duration-300 cursor-pointer"
                >
                  {"HR"}
                </button>

                <AnimatePresence>
                  {showAccountDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAccountDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-64 bg-neutral-950/95 backdrop-blur-xl border border-primary/20 rounded-xl p-4 shadow-2xl z-50 flex flex-col gap-4 text-white"
                      >
                        {/* Profile Info */}
                        <div className="flex flex-col gap-0.5 border-b border-white/10 pb-3">
                          <span className="font-sans font-bold text-sm tracking-tight text-white">{"Recruiter Demo"}</span>
                          <span className="font-mono text-[10px] text-neutral-400">{"Organization: "}<span className="text-secondary font-bold">{"ZeroCV Labs"}</span></span>
                        </div>

                        {/* Stats Section */}
                        <div className="flex flex-col gap-2 border-b border-white/10 pb-3 font-mono text-[11px] text-neutral-300">
                          <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">{"Statistics"}</div>
                          <div className="flex justify-between">
                            <span>{"Candidates Scanned"}</span>
                            <span className="text-white font-bold">{"142"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{"Hidden Talent Found"}</span>
                            <span className="text-amber-400 font-bold">{"12"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{"Active Roles"}</span>
                            <span className="text-secondary font-bold">{"4"}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => {
                              setShowAccountDropdown(false);
                              setShowSettingsModal(true);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer animate-none bg-transparent border-none"
                          >
                            <Settings className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{"Settings"}</span>
                          </button>
                          <button 
                            onClick={() => {
                              setShowAccountDropdown(false);
                              setShowSavedSearchesModal(true);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer animate-none bg-transparent border-none"
                          >
                            <Search className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{"Saved Searches"}</span>
                          </button>
                          <button 
                            onClick={() => {
                              setShowAccountDropdown(false);
                              setShowAnalyticsModal(true);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer animate-none bg-transparent border-none"
                          >
                            <Activity className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{"Analytics"}</span>
                          </button>
                          
                          <div className="h-px bg-white/5 my-1" />
                          
                          <button
                            onClick={() => {
                              sessionStorage.removeItem("role");
                              sessionStorage.setItem("zeroCV_logged_in", "false");
                              setIsLoggedIn(false);
                              setShowAccountDropdown(false);
                              router.push("/");
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-primary hover:bg-primary/5 transition-all text-left w-full cursor-pointer animate-none bg-transparent border-none"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>{"Sign Out"}</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🔑 WELCOME & ROLE SELECTION MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="glass-card w-full max-w-md p-8 relative z-50 m-4 border border-primary/20 bg-neutral-950 flex flex-col gap-6 rounded-2xl shadow-[0_0_30px_rgba(228,22,19,0.15)]"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2">
                <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest block font-bold">{"Frictionless Access"}</span>
                <h3 className="font-sans font-black text-2xl text-white tracking-tight">{"Welcome to ZeroCV"}</h3>
                <p className="font-sans text-[11px] text-neutral-400">{"Select your role to instantly access the Recruiter Workspace."}</p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                {[
                  {
                    id: "Recruiter",
                    title: "Recruiter",
                    desc: "Analyze candidate codebase depth, map skills DNA, and identify matching candidates.",
                    icon: Users,
                    color: "text-primary border-primary/20 hover:border-primary/50 hover:bg-primary/[0.02]"
                  },
                  {
                    id: "Hiring Manager",
                    title: "Hiring Manager",
                    desc: "Review engineering capabilities, project quality, and direct codebase evidence.",
                    icon: Code,
                    color: "text-amber-400 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/[0.01]"
                  },
                  {
                    id: "Talent Acquisition Lead",
                    title: "Talent Acquisition Lead",
                    desc: "Oversee overall hiring pipeline dashboards, role statistics, and sourcing efficiencies.",
                    icon: Rocket,
                    color: "text-secondary border-secondary/20 hover:border-secondary/50 hover:bg-secondary/[0.02]"
                  }
                ].map((roleItem) => {
                  const Icon = roleItem.icon;
                  return (
                    <button
                      key={roleItem.id}
                      onClick={() => {
                        sessionStorage.setItem("role", roleItem.id);
                        sessionStorage.setItem("zeroCV_logged_in", "true");
                        setIsLoggedIn(true);
                        setShowLoginModal(false);
                        router.push("/platform");
                      }}
                      className={`glass-card p-4 border text-left rounded-xl transition-all duration-300 group cursor-pointer flex items-start gap-4 ${roleItem.color}`}
                    >
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-sans font-bold text-sm text-white">{roleItem.title}</h4>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 group-hover:text-white transition-colors">{"Select →"}</span>
                        </div>
                        <p className="font-sans text-[11px] text-neutral-400 mt-1 leading-relaxed">{roleItem.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ⚙️ WORKABLE SETTINGS MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="glass-card w-full max-w-md p-8 relative z-50 m-4 border border-primary/20 bg-neutral-950 flex flex-col gap-6 rounded-2xl shadow-[0_0_30px_rgba(228,22,19,0.15)] text-white"
            >
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-xl text-white tracking-tight">{"Workspace Settings"}</h3>
                  <p className="font-sans text-[11px] text-neutral-400">{"Tune AI capability projections and evaluation weights."}</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Vector Similarity Threshold */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-neutral-400">{"Vector Match Threshold"}</span>
                    <span className="text-primary font-bold">{vectorThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    value={vectorThreshold}
                    onChange={(e) => setVectorThreshold(parseInt(e.target.value))}
                    className="w-full accent-primary bg-neutral-800 h-1 rounded-lg cursor-pointer"
                  />
                  <p className="font-sans text-[9px] text-neutral-500">{"Higher values require closer semantic matches to roles."}</p>
                </div>

                {/* Code Density Weight */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-neutral-400">{"Codebase Density Weight"}</span>
                    <span className="text-amber-400 font-bold">{codeWeight}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={codeWeight}
                    onChange={(e) => setCodeWeight(parseInt(e.target.value))}
                    className="w-full accent-amber-500 bg-neutral-800 h-1 rounded-lg cursor-pointer"
                  />
                  <p className="font-sans text-[9px] text-neutral-500">{"Increases evaluation coefficients based on developer commit volume."}</p>
                </div>

                {/* Keyword Filter Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-sans font-bold text-xs">{"Legacy Keyword Filters"}</span>
                    <span className="font-sans text-[9px] text-neutral-500">{"Apply traditional ATS text pattern matching (discouraged)."}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>

                {/* Sourcing Model Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">{"AI Sourcing Model"}</label>
                  <select 
                    value={sourcingModel}
                    onChange={(e) => setSourcingModel(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="ZeroCV Core Alpha">{"ZeroCV Core Alpha (High Density)"}</option>
                    <option value="ZeroCV Speed Beta">{"ZeroCV Speed Beta (Fast Parsing)"}</option>
                    <option value="ZeroCV Experimental Gamma">{"ZeroCV Experimental Gamma (Vector Depth)"}</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-colors glow-button flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
              >
                <span>{"Apply Parameters"}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔍 WORKABLE SAVED SEARCHES MODAL */}
      <AnimatePresence>
        {showSavedSearchesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSavedSearchesModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="glass-card w-full max-w-md p-8 relative z-50 m-4 border border-primary/20 bg-neutral-950 flex flex-col gap-6 rounded-2xl shadow-[0_0_30px_rgba(228,22,19,0.15)] text-white"
            >
              <button 
                onClick={() => setShowSavedSearchesModal(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-xl text-white tracking-tight">{"Saved Searches"}</h3>
                  <p className="font-sans text-[11px] text-neutral-400">{"Load pre-configured developer criteria vectors."}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  {
                    id: "frontend",
                    title: "Frontend WebGL/WASM Pioneers",
                    desc: "Sourcing builders with high commit density, WebGL visual components, and WASM performance filters.",
                    count: 3
                  },
                  {
                    id: "backend",
                    title: "Django Platform Architects",
                    desc: "Evaluating developers with concurrent requests benchmarks, SQL indices, and database performance experience.",
                    count: 1
                  },
                  {
                    id: "ml",
                    title: "ML / Core Render Loop Engineers",
                    desc: "Looking for high mathematical consistency, matrix models, and custom C++/Rust render engine shaders.",
                    count: 0
                  }
                ].map((searchItem) => (
                  <div 
                    key={searchItem.id}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-primary/20 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-sans font-bold text-xs text-white">{searchItem.title}</h4>
                        <p className="font-sans text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{searchItem.desc}</p>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-white/5 text-neutral-400 font-bold">
                        {searchItem.count} match{searchItem.count !== 1 ? 'es' : ''}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setShowSavedSearchesModal(false);
                          if (typeof window !== "undefined") {
                            sessionStorage.setItem("zeroCV_load_search", "frontend");
                            router.push("/platform");
                          }
                        }}
                        className="font-mono text-[9px] uppercase tracking-wider font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none"
                      >
                        <span>{"Run Sourcing Search →"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📊 WORKABLE ANALYTICS MODAL */}
      <AnimatePresence>
        {showAnalyticsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnalyticsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="glass-card w-full max-w-md p-8 relative z-50 m-4 border border-primary/20 bg-neutral-950 flex flex-col gap-6 rounded-2xl shadow-[0_0_30px_rgba(228,22,19,0.15)] text-white"
            >
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-xl text-white tracking-tight">{"Sourcing Analytics"}</h3>
                  <p className="font-sans text-[11px] text-neutral-400">{"Real-time talent funnel mapping performance statistics."}</p>
                </div>
              </div>

              <div className="space-y-4 font-mono text-[10px]">
                {/* Demographics bar chart */}
                <div className="space-y-2">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">{"Talent Origin Distribution"}</div>
                  <div className="space-y-2 font-sans">
                    <div>
                      <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                        <span>{"Open Source Contributor Repos"}</span>
                        <span className="text-white font-bold">58%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded overflow-hidden">
                        <div className="h-full bg-primary rounded" style={{ width: "58%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                        <span>{"Bootcamps & Career Changers"}</span>
                        <span className="text-white font-bold">24%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded overflow-hidden">
                        <div className="h-full bg-amber-500 rounded" style={{ width: "24%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                        <span>{"Standard CS Degrees"}</span>
                        <span className="text-white font-bold">18%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded overflow-hidden">
                        <div className="h-full bg-secondary rounded" style={{ width: "18%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5 my-2" />

                {/* Efficiency metrics grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
                    <span className="text-neutral-400 text-[9px] uppercase tracking-wider">{"False Negatives Filtered"}</span>
                    <span className="text-amber-400 font-sans text-xl font-black">{"92%"}</span>
                    <p className="font-sans text-[8px] text-neutral-500 leading-normal">{"Talents bypass rate saved compared to traditional keyword ATS."}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
                    <span className="text-neutral-400 text-[9px] uppercase tracking-wider">{"Sourcing Velocity"}</span>
                    <span className="text-primary font-sans text-xl font-black">{"14.2s"}</span>
                    <p className="font-sans text-[8px] text-neutral-500 leading-normal">{"Average vector matching mapping cycle duration per upload batch."}</p>
                  </div>
                </div>

                <div className="h-px bg-white/5 my-2" />

                {/* Vector dimension stats */}
                <div className="space-y-1.5 font-sans">
                  <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider font-bold">{"Workspace Sourcing Status"}</span>
                  <div className="flex justify-between text-[10px] border-b border-white/[0.03] py-1">
                    <span className="text-neutral-400">{"Primary Capability Focus"}</span>
                    <span className="text-white font-bold">{"WebGL / WASM Visuals"}</span>
                  </div>
                  <div className="flex justify-between text-[10px] border-b border-white/[0.03] py-1">
                    <span className="text-neutral-400">{"Total Scanned Candidates"}</span>
                    <span className="text-white font-bold">{"142 Profiles"}</span>
                  </div>
                  <div className="flex justify-between text-[10px] py-1">
                    <span className="text-neutral-400">{"AI Precision Index"}</span>
                    <span className="text-emerald-500 font-bold">{"99.8% Core Accuracy"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                        <span className="font-bold text-[1.6px] text-neutral-800 uppercase tracking-wider">{"Publications"}</span>
                        <span className="text-[1.3px] text-neutral-700 italic leading-none">{"• \"Vector Geometry Accretion Dynamics\""}</span>
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
                          <motion.span
                            initial={{ opacity: 0, y: 15 }}
                            animate={
                              openingPhase >= 6
                                ? { opacity: 0, y: -10 }
                                : { opacity: 1, y: 0 }
                            }
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="font-display-lg text-4xl md:text-6xl font-black text-white"
                          >
                            {"Hiring is broken."}
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
                            {"Talent isn't."}
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

        {/* 🧊 SECTION 1: HERO */}
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
              <span>{"Vector Semantic Screening Engine"}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={openingPhase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display-lg text-4xl md:text-8xl leading-none font-extrabold text-white tracking-tight"
            >
              {"Hiring is broken."} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">{"Talent isn't."}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={openingPhase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-on-surface-variant text-base md:text-xl max-w-2xl leading-relaxed font-light"
            >
              {"Discover real talent beyond resumes, keywords, and degrees."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={openingPhase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center w-full max-w-md"
            >
              <Link
                href="/platform"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                  }
                }}
                className="bg-primary text-white px-8 py-4 rounded-full font-mono text-xs font-bold glow-button transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group cursor-pointer animate-pulse"
              >
                <span>{"Open Platform"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#problem-section"
                className="border border-white/20 hover:border-white/40 bg-white/5 text-white px-8 py-4 rounded-full font-mono text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
              >
                {"See How It Works"}
              </a>
            </motion.div>
          </div>
        </section>

        {/* ⚠️ SECTION 2: THE PROBLEM */}
        <section className="py-section-gap px-6 md:px-20 bg-black relative overflow-hidden" id="problem-section">
          {/* Background subtle light beam */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center gap-4">
              <span className="font-mono text-xs text-primary tracking-widest block uppercase font-bold">{"The Silent Rejection"}</span>
              <h2 className="font-sans font-black text-3xl md:text-6xl text-white tracking-tight leading-tight">
                {"The best candidates"} <br /> {"are often invisible."}
              </h2>
              <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-xl font-light">
                {"Every day, millions of qualified builders are automatically discarded by mechanical ATS algorithms before any human ever sees their code."}
              </p>
            </div>

            {/* Problem visual narrative container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto relative text-left">
              {/* Card 1: Millions of Apps */}
              <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 border-white/5 relative group hover:border-primary/20 transition-all duration-300">
                <Inbox className="text-primary w-8 h-8" />
                <h3 className="font-sans font-bold text-lg text-white">{"Millions of Applications"}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {"Inboxes flooded with standardized templates. Human recruiters only spend an average of 6 seconds per resume."}
                </p>
              </div>

              {/* Card 2: ATS Filtering */}
              <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 border-white/5 relative group hover:border-primary/20 transition-all duration-300">
                <Filter className="text-primary w-8 h-8" />
                <h3 className="font-sans font-bold text-lg text-white">{"ATS Filtering"}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {"Rigid pattern matchers scan for strings, not ability. If a modern framework is styled slightly differently, they reject the builder."}
                </p>
              </div>

              {/* Card 3: Degree Requirements */}
              <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 border-white/5 relative group hover:border-primary/20 transition-all duration-300">
                <GraduationCap className="text-primary w-8 h-8" />
                <h3 className="font-sans font-bold text-lg text-white">{"Degree Requirements"}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {"Unfinished degrees or non-CS majors trigger automatic filters, screening out top self-taught engineers."}
                </p>
              </div>

              {/* Card 4: Keyword Matching */}
              <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 border-white/5 relative group hover:border-primary/20 transition-all duration-300">
                <Search className="text-primary w-8 h-8" />
                <h3 className="font-sans font-bold text-lg text-white">{"Keyword Matching"}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {"ATS rewards candidates who copy-paste job specs directly onto their resumes, rather than those who ship real code."}
                </p>
              </div>
            </div>

            {/* Narrated visual simulation of filter blockage */}
            <div className="mt-16 bg-[#09090a] border border-white/5 p-8 rounded-2xl max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1 flex flex-col gap-3 text-left">
                  <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">{"Live Pipeline Simulation"}</span>
                  <h4 className="font-sans font-bold text-xl text-white">{"How traditional filters blind recruiters"}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {"Watch candidate profiles arrive at the gateway. Traditional filters instantly block profiles without CS degrees or matching strings, hiding top-tier talent."}
                  </p>
                </div>
                {/* Visual animation of blocked profiles */}
                <div className="w-full md:w-80 flex flex-col gap-2 relative bg-black/60 p-4 rounded-xl border border-white/10 h-48 overflow-hidden text-left">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-[pulse_2s_infinite] shadow-[0_0_10px_#E41613]" />
                  <div className="flex items-center justify-between bg-surface-container-low border border-white/5 p-2 rounded text-[10px] font-mono opacity-40 line-through">
                    <span>{"Profile #7302 (No CS Degree)"}</span>
                    <span className="text-primary font-bold">{"✕ BLOCKED"}</span>
                  </div>
                  <div className="flex items-center justify-between bg-surface-container-low border border-white/5 p-2 rounded text-[10px] font-mono opacity-40 line-through">
                    <span>{"Profile #7303 (Missing String)"}</span>
                    <span className="text-primary font-bold">{"✕ BLOCKED"}</span>
                  </div>
                  <div className="flex items-center justify-between bg-surface-container-low border border-white/5 p-2 rounded text-[10px] font-mono text-white animate-pulse">
                    <span>{"Profile #7304 (Sarah Chen)"}</span>
                    <span className="text-primary font-bold">{"✕ AUTO-REJECT"}</span>
                  </div>
                  <div className="flex items-center justify-between bg-surface-container-low border border-white/5 p-2 rounded text-[10px] font-mono opacity-20">
                    <span>{"Profile #7305 (Template Copier)"}</span>
                    <span className="text-secondary font-bold">{"✓ PASSED"}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ⚠️ SECTION 3: MEET SARAH CHEN */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  <h3 className="font-sans font-bold text-3xl text-white">{"Sarah Chen"}</h3>
                  <p className="font-mono text-xs text-secondary mt-1 uppercase tracking-wider font-bold">{"Self-Taught Frontend Developer"}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">{"Education"}</span>
                  <span className="font-mono text-white text-right">{"BA Architecture (Unfinished)"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">{"Experience"}</span>
                  <span className="font-mono text-white text-right">{"Freelance Graphic Design"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">{"Tech Stack"}</span>
                  <span className="font-mono text-white text-right">{"React, TypeScript, Tailwind"}</span>
                </div>
              </div>
            </div>

            {/* Stats Counter */}
            <div className="lg:pl-12 text-center lg:text-left flex flex-col justify-center gap-6">
              <div>
                <span className="font-mono text-xs text-secondary tracking-widest block mb-4 uppercase font-bold">{"The Filter Struggle"}</span>
                <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
                  <div>
                    <span className="font-sans font-black text-6xl md:text-8xl block leading-none text-white">
                      <CountUp value={73} trigger={storyActive} />
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant uppercase mt-2 block">{"Applications Sent"}</span>
                  </div>
                  <div>
                    <span className="font-sans font-black text-6xl md:text-8xl block leading-none text-primary">
                      <CountUp value={69} trigger={storyActive} />
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant uppercase mt-2 block">{"Auto-Rejections"}</span>
                  </div>
                  <div>
                    <span className="font-sans font-black text-6xl md:text-8xl block leading-none text-neutral-500">
                      <CountUp value={0} trigger={storyActive} />
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant uppercase mt-2 block">{"Interviews Scheduled"}</span>
                  </div>
                </div>
              </div>
              <p className="font-sans text-on-surface-variant text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 font-light mt-4">
                {"Sarah does not hold a Computer Science degree. On paper, legacy ATS keyword screens drop her instantly. But her capability is hidden in plain sight."}
              </p>
            </div>
          </div>
        </section>

        {/* ❌ SECTION 4: WHY ATS FAILED */}
        <section className="py-section-gap px-6 bg-black flex justify-center items-center relative min-h-[500px]" ref={rejectionRef}>
          <div className="relative glass-card p-8 md:p-12 max-w-2xl w-full text-center border-primary/20 rounded-2xl">
            {/* Rejection Stamp */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-20">
              <div
                className={`reject-stamp border-[8px] md:border-[12px] border-primary text-primary font-sans text-5xl md:text-7xl px-8 py-3 rounded-xl font-black tracking-widest uppercase select-none ${
                  rejectionActive ? "active scale-100" : "scale-150"
                }`}
              >
                {"REJECTED"}
              </div>
            </div>

            {/* ATS Decision Board */}
            <div className="select-none transition-all duration-700">
              <h4 className="font-mono text-xs uppercase tracking-widest text-primary font-bold mb-2">{"Automated Resume Screening Systems"}</h4>
              <h3 className="font-sans font-bold text-2xl text-white mb-8">{"Candidate Profile Evaluation"}</h3>
              
              <div className="max-w-md mx-auto space-y-4 bg-black/40 p-6 rounded-xl border border-white/5 text-left font-mono text-xs text-on-surface-variant">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span>{"Keyword Match Index"}</span>
                  <span className="text-primary font-bold">{"FAIL ❌"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span>{"CS Degree Match"}</span>
                  <span className="text-primary font-bold">{"FAIL ❌"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span>{"Corporate Experience Target"}</span>
                  <span className="text-primary font-bold">{"FAIL ❌"}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span>{"Verified Portfolio Code Review"}</span>
                  <span className="text-neutral-500 font-bold uppercase">{"Not Performed"}</span>
                </div>
              </div>
              
              <p className="text-[11px] font-mono text-on-surface-variant mt-6 uppercase tracking-wider">
                {"ATS Recommendation: DISCARD WITHOUT HUMAN REVIEW"}
              </p>
            </div>
          </div>
        </section>

        {/* 🎬 SECTION 6: THE HIDDEN TALENT MOMENT */}
        <section ref={revealRef} className="relative h-[220vh] bg-black">
          <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-6">
            
            {/* Background Eclipse Glow */}
            <div 
              className="absolute w-[45vw] h-[45vw] max-w-[600px] rounded-full filter blur-[130px] transition-all duration-1000 pointer-events-none z-0"
              style={{
                background: revealProgress > 0.6 ? 'radial-gradient(circle, rgba(197,168,128,0.2) 0%, rgba(228,22,19,0.05) 50%, rgba(0,0,0,0) 100%)' : 'rgba(0,0,0,0)',
                transform: revealProgress > 0.6 ? 'scale(1.2)' : 'scale(0.8)',
                opacity: revealProgress > 0.6 ? 0.9 : 0
              }}
            />

            <div className="relative z-10 text-center flex flex-col items-center max-w-4xl w-full gap-6">
              <span className="font-mono text-xs text-secondary tracking-widest block uppercase font-bold">{"The Talent Ascent"}</span>
              <h2 className="font-sans font-black text-3xl md:text-6xl text-white tracking-tight">
                {"Candidates your ATS"} <br /> {"would have missed."}
              </h2>

              {/* Ranking board container */}
              <div className="w-full max-w-xl bg-[#0b0b0c] border border-white/5 p-8 rounded-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-center gap-6 mt-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
                
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="font-mono text-xs text-on-surface-variant font-bold uppercase">{"Candidate Ranking Ledger"}</span>
                  <span className="font-mono text-[10px] text-secondary tracking-wider font-bold">
                    {revealProgress > 0.6 ? "ZeroCV Capability Screening" : "Traditional Resume Screening"}
                  </span>
                </div>

                {/* Animated lists */}
                <div className="space-y-3 font-mono text-xs relative text-left">
                  {revealProgress <= 0.6 ? (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 text-on-surface-variant/80">
                        <span>{"#01. Harvard CS Candidate"}</span>
                        <span className="text-secondary font-bold">{"✓ PASSED"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 text-on-surface-variant/80">
                        <span>{"#02. 8+ Yrs Corporate Dev"}</span>
                        <span className="text-secondary font-bold">{"✓ PASSED"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 text-on-surface-variant/80">
                        <span>{"#03. FAANG Senior Engineer"}</span>
                        <span className="text-secondary font-bold">{"✓ PASSED"}</span>
                      </div>
                      <div className="text-center text-neutral-600 text-[10px] py-1 font-bold">{"... (43 other candidates) ..."}</div>
                      <div className="flex justify-between items-center bg-primary/5 p-3 rounded border border-primary/20 text-primary animate-pulse font-bold">
                        <span>{"#47. Sarah Chen (No degree)"}</span>
                        <span>{"✕ REJECTED"}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-[fadeIn_0.5s_ease-out]">
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 text-on-surface-variant/80">
                        <span>{"#01. FAANG Senior Engineer"}</span>
                        <span className="text-secondary font-bold">{"✓ 96% Match"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-secondary/10 p-3 rounded border border-secondary/40 text-secondary font-bold shadow-[0_0_15px_rgba(197,168,128,0.15)] animate-[pulse_2s_infinite]">
                        <span>{"#02. Sarah Chen (🔥 Capable Builder)"}</span>
                        <span>{"✓ 94% Match"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 text-on-surface-variant/80">
                        <span>{"#03. Harvard CS Candidate"}</span>
                        <span className="text-secondary font-bold">{"✓ 91% Match"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 text-on-surface-variant/80">
                        <span>{"#04. 8+ Yrs Corporate Dev"}</span>
                        <span className="text-secondary font-bold">{"✓ 89% Match"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mini Keynote caption */}
              <p className="font-sans text-lg md:text-2xl font-light text-on-surface-variant max-w-lg mt-6 leading-relaxed">
                {revealProgress > 0.6 ? (
                  <>{"Traditional systems saw a non-CS major."} <br /><span className="text-white font-bold">{"ZeroCV saw a top 3% execution profile."}</span></>
                ) : (
                  <>{"Traditional filters group candidates by pedigree,"} <br /><span className="text-primary font-bold">{"pushing raw builders down to the bottom."}</span></>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* 📊 SECTION 5: ZEROCV ANALYSIS */}
        <section className="py-section-gap px-6 md:px-20 bg-background relative overflow-hidden" id="analysis-section" ref={comparisonRef}>
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center gap-4">
              <span className="font-mono text-xs text-secondary tracking-widest block uppercase font-bold">{"Contrast Analysis"}</span>
              <h2 className="font-sans font-black text-3xl md:text-6xl text-white tracking-tight leading-tight">
                {"Evaluating what"} <br /> {"traditional systems skip."}
              </h2>
              <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-xl font-light">
                {"ZeroCV maps capabilities directly from code contributions, velocity patterns, and architecture."}
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              {/* Left Panel: ATS Evaluation (Traditional) */}
              <div className="glass-card p-8 md:p-12 border-primary/10 rounded-2xl flex flex-col justify-between min-h-[500px] text-left">
                <div className="space-y-8">
                  <div>
                    <span className="font-mono text-xs text-primary uppercase tracking-widest block mb-2 font-bold">{"Traditional Path"}</span>
                    <h3 className="font-sans font-bold text-2xl text-white">{"Keyword Matching Reject"}</h3>
                  </div>
                  
                  <div className="space-y-6 font-mono text-xs text-on-surface-variant">
                    <div className="border-b border-white/5 pb-3">
                      <p className="text-[10px] text-primary font-bold mb-1">{"✕ DEGREE CRITERIA"}</p>
                      <p className="font-sans text-xs">{"No CS Major. Flagged as unqualified."}</p>
                    </div>
                    <div className="border-b border-white/5 pb-3">
                      <p className="text-[10px] text-primary font-bold mb-1">{"✕ KEYWORD DENSITY"}</p>
                      <p className="font-sans text-xs">{"Missing exact phrasing match for \"Senior Developer\"."}</p>
                    </div>
                    <div className="border-b border-white/5 pb-3">
                      <p className="text-[10px] text-primary font-bold mb-1">{"✕ PREVIOUS CORPORATE EXPERIENCE"}</p>
                      <p className="font-sans text-xs">{"No recognized enterprise logo signatures."}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/5 pt-6 flex justify-between items-center">
                  <span className="font-mono text-xs text-on-surface-variant uppercase">{"ATS Output Status"}</span>
                  <span className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {"REJECTED"}
                  </span>
                </div>
              </div>

              {/* Right Panel: ZeroCV Evaluation (Capability Analysis) */}
              <div className="glass-card p-8 md:p-12 border-secondary/20 rounded-2xl flex flex-col justify-between min-h-[500px] relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-8 relative z-10 w-full">
                  <div>
                    <span className="font-mono text-xs text-secondary uppercase tracking-widest block mb-2 font-bold">{"ZeroCV Vector Path"}</span>
                    <h3 className="font-sans font-bold text-2xl text-white">{"Capability Blueprint"}</h3>
                  </div>

                  {/* Animated Score Progress Bars */}
                  <div className="space-y-4 font-mono text-[10px]">
                    {/* Project Quality */}
                    <div>
                      <div className="flex justify-between text-white mb-1.5 font-bold">
                        <span>{"Project Quality"}</span>
                        <span>{"92%"}</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-[1500ms] ease-out" style={{ width: comparisonActive ? "92%" : "0%" }} />
                      </div>
                    </div>
                    
                    {/* Learning Velocity */}
                    <div>
                      <div className="flex justify-between text-white mb-1.5 font-bold">
                        <span>{"Learning Velocity"}</span>
                        <span>{"98%"}</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-[1500ms] ease-out" style={{ width: comparisonActive ? "98%" : "0%" }} />
                      </div>
                    </div>

                    {/* Problem Solving */}
                    <div>
                      <div className="flex justify-between text-white mb-1.5 font-bold">
                        <span>{"Problem Solving"}</span>
                        <span>{"94%"}</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-[1500ms] ease-out" style={{ width: comparisonActive ? "94%" : "0%" }} />
                      </div>
                    </div>

                    {/* Technical Depth */}
                    <div>
                      <div className="flex justify-between text-white mb-1.5 font-bold">
                        <span>{"Technical Depth"}</span>
                        <span>{"90%"}</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-[1500ms] ease-out" style={{ width: comparisonActive ? "90%" : "0%" }} />
                      </div>
                    </div>

                    {/* Consistency */}
                    <div>
                      <div className="flex justify-between text-white mb-1.5 font-bold">
                        <span>{"Consistency"}</span>
                        <span>{"88%"}</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-[1500ms] ease-out" style={{ width: comparisonActive ? "88%" : "0%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/5 pt-6 flex justify-between items-center relative z-10">
                  <span className="font-mono text-xs text-on-surface-variant uppercase">{"ZeroCV Result"}</span>
                  <span className="bg-secondary/20 text-secondary border border-secondary/30 text-[10px] font-mono font-bold px-4 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
                    {"RECOMMENDED"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🕸️ SECTION 7: WHY SARAH? */}
        <section className="py-section-gap px-6 bg-background relative overflow-hidden scroll-mt-20" id="explainability-section" ref={explainabilityRef} >
          <div className="max-w-container-max mx-auto text-center mb-20 flex flex-col items-center gap-4">
            <h2 className="font-sans font-extrabold text-3xl md:text-6xl text-white">{"Every node of advice is auditable."}</h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-2xl font-light">
              {"Hover over the capability attributes around Sarah to inspect the codebase validation indicators."}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
              <Terminal className="text-primary w-8 h-8" />
              {activeExplainId === 0 && (
                <div className="absolute bottom-full mb-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">{"GitHub Output"}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{"Verified 2,100+ commits across 42 codebases with high semantic density."}</p>
                </div>
              )}
            </div>

            {/* Project Quality */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(1)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <Rocket className="text-primary w-8 h-8" />
              {activeExplainId === 1 && (
                <div className="absolute bottom-full mb-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">{"Project Quality"}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{"Developed production modular frontend architectures and custom rendering systems."}</p>
                </div>
              )}
            </div>

            {/* Learning Velocity */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[50%] left-[85%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(2)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <Zap className="text-primary w-8 h-8" />
              {activeExplainId === 2 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left md:-left-20 z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">{"Learning Velocity"}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{"Acquired and shipped advanced TypeScript & WebGL configurations 3x faster than average."}</p>
                </div>
              )}
            </div>

            {/* Open Source Activity */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(3)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <Users className="text-primary w-8 h-8" />
              {activeExplainId === 3 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left md:-left-20 z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">{"Open Source"}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{"Maintained critical dependencies for three widely recognized web specs."}</p>
                </div>
              )}
            </div>

            {/* React */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(4)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <Activity className="text-primary w-8 h-8" />
              {activeExplainId === 4 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">{"React Capability"}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{"Deep code logic optimization in React reconciliation flows and layout settings."}</p>
                </div>
              )}
            </div>

            {/* Performance */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[50%] left-[15%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(5)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <Layers className="text-primary w-8 h-8" />
              {activeExplainId === 5 && (
                <div className="absolute top-full mt-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-left z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">{"Performance"}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{"Solved layout shifts, server-side hydration bottlenecks, and caching assets."}</p>
                </div>
              )}
            </div>

            {/* Problem Solving */}
            <div
              className="satellite-node absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              onMouseEnter={() => setActiveExplainId(6)}
              onMouseLeave={() => setActiveExplainId(null)}
            >
              <Brain className="text-primary w-8 h-8" />
              {activeExplainId === 6 && (
                <div className="absolute bottom-full mb-4 w-60 md:w-64 glass-card p-4 rounded-xl pointer-events-none text-center left-1/2 -translate-x-1/2 z-40">
                  <p className="font-mono text-xs text-secondary mb-1 uppercase font-bold">{"Problem Solving"}</p>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{"Independently diagnosed and resolved asynchronous concurrency limits in components."}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🌌 SECTION 8: THE TALENT CONSTELLATION */}
        <section className="py-section-gap px-6 bg-[#080809] border-t border-white/5 relative overflow-hidden" id="constellation-section">
          {/* Subtle background stars */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/5 to-black/0 pointer-events-none" />

          <div className="max-w-container-max mx-auto text-center relative z-10 flex flex-col items-center gap-6">
            <span className="font-mono text-xs text-secondary tracking-widest block uppercase font-bold animate-pulse">{"Multidimensional Capability Matrix"}</span>
            <h2 className="font-sans font-black text-3xl md:text-6xl text-white tracking-tight">
              {"Talent is more than"} <br className="md:hidden" /> {"a resume."}
            </h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-xl leading-relaxed font-light mb-16">
              {"Credentials are static, one-dimensional snapshots. Capability is a living, connected web of real-world accomplishments."}
            </p>

            {/* Constellation Container */}
            <div className="relative w-full max-w-3xl aspect-[16/9] flex items-center justify-center bg-black/40 border border-white/5 rounded-2xl p-8 overflow-hidden">
              {/* Glowing connecting vectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <g className="stroke-secondary/20 stroke-1">
                  <line x1="20%" y1="30%" x2="50%" y2="15%" className="node-connection" />
                  <line x1="50%" y1="15%" x2="80%" y2="30%" className="node-connection" />
                  <line x1="80%" y1="30%" x2="85%" y2="70%" className="node-connection" />
                  <line x1="85%" y1="70%" x2="65%" y2="85%" className="node-connection" />
                  <line x1="65%" y1="85%" x2="35%" y2="85%" className="node-connection" />
                  <line x1="35%" y1="85%" x2="15%" y2="70%" className="node-connection" />
                  <line x1="15%" y1="70%" x2="20%" y2="30%" className="node-connection" />
                  
                  <line x1="50%" y1="15%" x2="65%" y2="85%" className="node-connection" style={{ stroke: "rgba(228,22,19,0.15)" }} />
                  <line x1="20%" y1="30%" x2="85%" y2="70%" className="node-connection" style={{ stroke: "rgba(228,22,19,0.15)" }} />
                  <line x1="80%" y1="30%" x2="35%" y2="85%" className="node-connection" style={{ stroke: "rgba(197,168,128,0.15)" }} />
                </g>
              </svg>

              {/* Constellation Nodes */}
              <div className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_12px_#C5A880] animate-ping absolute pointer-events-none" />
                <div className="w-3.5 h-3.5 rounded-full bg-secondary shadow-[0_0_8px_#C5A880] border border-black z-10" />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">{"Projects"}</span>
              </div>

              <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_8px_#E41613] border border-black z-10" />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">{"Skills"}</span>
              </div>

              <div className="absolute top-[30%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-secondary shadow-[0_0_8px_#C5A880] border border-black z-10" />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">{"Impact"}</span>
              </div>

              <div className="absolute top-[70%] left-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_8px_#E41613] border border-black z-10" />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">{"Consistency"}</span>
              </div>

              <div className="absolute top-[85%] left-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-secondary shadow-[0_0_8px_#C5A880] border border-black z-10" />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">{"Leadership"}</span>
              </div>

              <div className="absolute top-[85%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_8px_#E41613] border border-black z-10" />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">{"Learning"}</span>
              </div>

              <div className="absolute top-[70%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_12px_#C5A880] animate-ping absolute pointer-events-none" />
                <div className="w-3.5 h-3.5 rounded-full bg-secondary shadow-[0_0_8px_#C5A880] border border-black z-10" />
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/5">{"Problem Solving"}</span>
              </div>
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center border border-white/10 z-0">
                <Brain className="w-6 h-6 text-white/50" />
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ SECTION 9: HOW ZEROCV THINKS */}
        <section className="py-section-gap px-6 bg-black border-t border-white/5" id="engine-how-it-works">
          <div className="max-w-container-max mx-auto text-center flex flex-col items-center gap-6">
            <span className="font-mono text-xs text-primary tracking-widest block uppercase font-bold">{"The Pipeline Architecture"}</span>
            <h2 className="font-sans font-black text-3xl md:text-6xl text-white tracking-tight">
              {"How ZeroCV thinks."}
            </h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-xl font-light mb-16">
              {"A single unified intelligence system replacing simple string filters with contextual execution matching."}
            </p>

            {/* Pipeline flowchart */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 relative items-center justify-between text-left">
              
              {/* Step 1: Input */}
              <div className="glass-card p-6 rounded-xl border-white/5 relative flex-1 w-full min-h-[180px] flex flex-col justify-between">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">{"01"}</div>
                <h3 className="font-sans font-bold text-sm text-white mb-4 flex items-center gap-2">
                  <Terminal className="text-secondary w-4 h-4" /> {"Raw Inputs"}
                </h3>
                <ul className="space-y-1 font-mono text-[10px] text-on-surface-variant">
                  <li>{"➔ Text Resumes"}</li>
                  <li>{"➔ Git Commits"}</li>
                  <li>{"➔ Project Architecture"}</li>
                  <li>{"➔ Learning Signals"}</li>
                </ul>
              </div>

              {/* Arrow 1 */}
              <div className="flex justify-center items-center text-secondary rotate-90 md:rotate-0 py-2">
                <ArrowRight className="w-6 h-6 animate-[pulse_2s_infinite]" />
              </div>

              {/* Step 2: Vector Space DNA */}
              <div className="glass-card p-6 rounded-xl border-white/5 relative flex-1 w-full min-h-[180px] flex flex-col justify-between glow-border">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{"02"}</div>
                <h3 className="font-sans font-bold text-sm text-white mb-4 flex items-center gap-2">
                  <Dna className="text-primary w-4 h-4" /> {"Candidate DNA"}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {"Inputs are mapped into a multidimensional vector space, translating accomplishments to capability metrics."}
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="flex justify-center items-center text-secondary rotate-90 md:rotate-0 py-2">
                <ArrowRight className="w-6 h-6 animate-[pulse_2s_infinite]" />
              </div>

              {/* Step 3: Capability Scoring */}
              <div className="glass-card p-6 rounded-xl border-white/5 relative flex-1 w-full min-h-[180px] flex flex-col justify-between">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">{"03"}</div>
                <h3 className="font-sans font-bold text-sm text-white mb-4 flex items-center gap-2">
                  <Calculator className="text-secondary w-4 h-4" /> {"Scoring Engine"}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {"Matches raw capability vectors against requirements, weighing project scaling velocity over corporate tenure."}
                </p>
              </div>

              {/* Arrow 3 */}
              <div className="flex justify-center items-center text-secondary rotate-90 md:rotate-0 py-2">
                <ArrowRight className="w-6 h-6 animate-[pulse_2s_infinite]" />
              </div>

              {/* Step 4: Recommendation */}
              <div className="glass-card p-6 rounded-xl border-white/5 relative flex-1 w-full min-h-[180px] flex flex-col justify-between">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{"04"}</div>
                <h3 className="font-sans font-bold text-sm text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="text-primary w-4 h-4" /> {"Outcome"}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {"Triggers calendar pipeline invitations, surfacing hidden talent that standard ATS platforms discard."}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 🧠 AI REASONING ENGINE LOGS */}
        <section className="py-20 px-6 md:px-20 bg-background border-t border-white/5">
          <div className="max-w-container-max mx-auto">
            <h3 className="font-sans font-bold text-2xl md:text-3xl text-white mb-10 text-left">{"AI Reasoning Logs"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="reveal-node glass-card p-8 rounded-2xl relative group min-h-[200px] flex flex-col justify-between overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-4">
                  <Code className="text-secondary w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white">{"GitHub Activity Audit"}</span>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {"Analyzing repository patterns. Evaluated high semantic density in layout controls and API integration logic."}
                </p>
                {/* Hover quote overlay */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-[#0f0f0f] p-8 rounded-2xl flex flex-col justify-center border border-primary/20">
                  <p className="font-mono text-xs text-primary italic leading-relaxed">
                    {"\"Sarah designs layout architectures that resolve complex edge cases in responsiveness. Active shipping index exceeds typical baseline.\""}
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="reveal-node glass-card p-8 rounded-2xl relative group min-h-[200px] flex flex-col justify-between overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-4">
                  <Layers className="text-secondary w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white">{"Stack Architecture"}</span>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {"Analyzing Next.js SSR hydration structures. Project histories reveal deep knowledge of layout and state models."}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-[#0f0f0f] p-8 rounded-2xl flex flex-col justify-center border border-secondary/20">
                  <p className="font-mono text-xs text-secondary italic leading-relaxed">
                    {"\"She does not merely import wrappers; she writes custom render optimizations. Exceptionally clean separation of logic.\""}
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="reveal-node glass-card p-8 rounded-2xl relative group min-h-[200px] flex flex-col justify-between overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-4">
                  <Brain className="text-primary w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white">{"Delivery Consistency"}</span>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {"Audited 12 production web projects. Showcases consistent delivery on layout optimization and state synchronization."}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-[#0f0f0f] p-8 rounded-2xl flex flex-col justify-center border border-secondary/20">
                  <p className="font-mono text-xs text-secondary italic leading-relaxed">
                    {"\"Autonomous project execution indicates strong problem definition capability. Strong developer track, bypasses degree filters.\""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 📅 SECTION 10: THE OUTCOME */}
        <section className="py-section-gap px-6 md:px-20 bg-background overflow-hidden scroll-mt-20" id="outcome-section" ref={outcomeRef}>
          <div className="max-w-container-max mx-auto text-center">
            <h2 className="font-sans font-black text-3xl md:text-6xl text-white mb-24 leading-tight">
              {"What if your next hire"} <br /> {"looked"} <span className="text-secondary">{"exactly like Sarah?"}</span>
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
                      timelineProgress >= 12 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 12 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -left-4 md:-left-40 text-right transition-opacity duration-700 hidden md:block ${timelineProgress >= 12 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">{"Step 01"}</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">{"Candidate Scanned"}</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 ml-24 text-left transition-opacity duration-700 ${timelineProgress >= 12 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">{"Candidate Scanned"}</h4>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 28 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 28 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -right-4 md:-right-40 text-left transition-opacity duration-700 hidden md:block ${timelineProgress >= 28 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">{"Step 02"}</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">{"Capability Analyzed"}</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 mr-24 text-right transition-opacity duration-700 ${timelineProgress >= 28 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">{"Capability Analyzed"}</h4>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 45 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 45 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -left-4 md:-left-40 text-right transition-opacity duration-700 hidden md:block ${timelineProgress >= 45 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">{"Step 03"}</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">{"Evidence Validated"}</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 ml-24 text-left transition-opacity duration-700 ${timelineProgress >= 45 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">{"Evidence Validated"}</h4>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 62 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 62 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -right-4 md:-right-40 text-left transition-opacity duration-700 hidden md:block ${timelineProgress >= 62 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">{"Step 04"}</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">{"Interview Scheduled"}</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 mr-24 text-right transition-opacity duration-700 ${timelineProgress >= 62 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">{"Interview Scheduled"}</h4>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex justify-center items-center">
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-500 flex items-center justify-center ${
                      timelineProgress >= 80 ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-white/10"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity ${timelineProgress >= 80 ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <div className={`glass-card p-6 rounded-2xl w-full max-w-xs absolute -left-4 md:-left-40 text-right transition-opacity duration-700 hidden md:block ${timelineProgress >= 80 ? "opacity-100" : "opacity-20"}`}>
                    <span className="font-mono text-xs text-on-surface-variant/60 block mb-1">{"Step 05"}</span>
                    <h4 className="font-sans font-bold text-lg text-on-surface">{"Offer Sent"}</h4>
                  </div>
                  <div className={`md:hidden glass-card p-4 rounded-xl w-48 ml-24 text-left transition-opacity duration-700 ${timelineProgress >= 80 ? "opacity-100" : "opacity-20"}`}>
                    <h4 className="text-xs font-bold text-on-surface">{"Offer Sent"}</h4>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative flex justify-center items-center">
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary shadow-[0_0_20px_rgba(197,168,128,0.4)] flex items-center justify-center z-20 transition-opacity duration-500 ${timelineProgress >= 92 ? "opacity-100" : "opacity-20"}`}>
                    <Check className="text-on-secondary w-4 h-4 font-bold" />
                  </div>
                  <div className={`glass-card p-8 rounded-2xl w-full max-w-md border-secondary/20 relative transition-opacity duration-700 ${timelineProgress >= 92 ? "opacity-100 scale-100" : "opacity-10 scale-95"}`}>
                    <div className="absolute -top-4 -right-4 bg-secondary text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{"Hired"}</div>
                    <span className="font-mono text-xs text-secondary block mb-2 uppercase font-bold">{"Step 06"}</span>
                    <h4 className="font-sans font-bold text-2xl text-white">{"Sarah Chen Hired"}</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-3 leading-relaxed">
                      {"Sarah's output matched senior engineering metrics within the first 6 weeks of onboarding, representing a substantial hiring savings."}
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
                {"Try Valuation Engine"}
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

        {/* 💻 SECTION 11: INTERACTIVE DEMO (Sandbox) */}
        <section id="sandbox-section" className="py-section-gap px-6 md:px-20 bg-surface-container-lowest border-t border-white/5 scroll-mt-20">
          <div className="max-w-container-max mx-auto flex flex-col gap-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 text-left">
              <div>
                <span className="text-secondary text-xs uppercase font-bold tracking-widest block font-mono">{"Sandbox Environment"}</span>
                <h2 className="font-sans font-black text-3xl md:text-5xl text-white tracking-tight mt-2">{"Valuation Engine Workspace"}</h2>
              </div>
              
              {/* Presets */}
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">{"Presets:"}</span>
                <button 
                  onClick={() => loadCandidatePreset('alex')}
                  className={`text-xs px-4 py-2 rounded-lg border font-mono font-bold transition-all cursor-pointer ${
                    candidateName === "Alex Mercer" 
                      ? "bg-secondary/15 border-secondary text-secondary shadow-[0_0_10px_rgba(197,168,128,0.2)]" 
                      : "bg-black/40 border-white/10 text-on-surface-variant hover:text-white"
                  }`}
                >
                  {"Alex Mercer (🔥 Talent)"}
                </button>
                <button 
                  onClick={() => loadCandidatePreset('sarah')}
                  className={`text-xs px-4 py-2 rounded-lg border font-mono font-bold transition-all cursor-pointer ${
                    candidateName === "Sarah Connor" 
                      ? "bg-secondary/15 border-secondary text-secondary shadow-[0_0_10px_rgba(197,168,128,0.2)]" 
                      : "bg-black/40 border-white/10 text-on-surface-variant hover:text-white"
                  }`}
                >
                  {"Sarah Connor (⭐ Top Fit)"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Sandbox Inputs */}
              <div className="lg:col-span-6 flex flex-col gap-8 text-left">
                
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-mono font-bold text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      {"1. Job Requirements Spec"}
                    </h3>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => selectJd('frontend')}
                        className={`text-[10px] px-2.5 py-1 rounded font-mono font-bold transition-all cursor-pointer ${
                          selectedJdKey === 'frontend' ? "bg-primary text-white" : "bg-black text-on-surface-variant border border-white/10"
                        }`}
                      >
                        {"Frontend Spec"}
                      </button>
                      <button 
                        onClick={() => selectJd('backend')}
                        className={`text-[10px] px-2.5 py-1 rounded font-mono font-bold transition-all cursor-pointer ${
                          selectedJdKey === 'backend' ? "bg-primary text-white" : "bg-black text-on-surface-variant border border-white/10"
                        }`}
                      >
                        {"Backend Spec"}
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

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                  <h3 className="font-mono font-bold text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-secondary" />
                    {"2. Candidate Experience Text"}
                  </h3>
                  
                  <textarea 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={5}
                    className="w-full bg-black/50 border border-white/10 rounded-xl text-white text-xs p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono resize-none leading-relaxed"
                  />
                  
                  <button 
                    onClick={handleManualAnalyze}
                    disabled={simulating}
                    className="bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary font-mono font-bold text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {simulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                        <span>{"Recomputing Similarity Vectors..."}</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4 text-primary" />
                        <span>{"Run Similarity Evaluation"}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Right Sandbox Outputs */}
              <div className="lg:col-span-6 bg-black border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 min-h-[480px] justify-between relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                {simulating ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="text-center">
                      <p className="font-mono font-bold text-white text-xs tracking-wider">{"ANALYZING PORTFOLIOS..."}</p>
                      <p className="text-[11px] text-on-surface-variant font-sans mt-2">{"Computing cosine similarities over context profiles"}</p>
                    </div>
                  </div>
                ) : calcScore === null ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-on-surface-variant gap-3">
                    <ShieldAlert className="w-12 h-12 text-white/25" />
                    <p className="font-mono font-bold text-white text-xs uppercase">{"Sandbox Offline"}</p>
                    <p className="text-[11px] font-sans">{"Modify parameters on the left to trigger the analysis engine."}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 animate-fade-in relative z-10">
                    
                    {/* Top candidate header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-sans font-extrabold text-2xl text-white">{candidateName}</h3>
                        <p className="text-[11px] font-mono text-on-surface-variant uppercase mt-1">{"Valuation Score Sheet"}</p>
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
                        <span className="text-[10px] text-secondary font-mono font-bold uppercase tracking-wider block">{"Fit Alignment Score"}</span>
                        <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                          {"Reflects relative structural capability and context keywords matching. Prioritizes code output over formal credentials."}
                        </p>
                      </div>
                    </div>

                    {/* Metadata summary grid */}
                    <div className="grid grid-cols-2 gap-4 font-mono">
                      <div className="bg-surface-container-lowest border border-white/5 p-4 rounded-xl">
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">{"Parsed Tenure"}</span>
                        <span className="text-sm font-bold text-white block mt-1">{calcExp} {"Years"}</span>
                      </div>
                      <div className="bg-surface-container-lowest border border-white/5 p-4 rounded-xl">
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">{"Skills Cataloged"}</span>
                        <span className="text-sm font-bold text-white block mt-1">{calcSkills.length} {"Mapped"}</span>
                      </div>
                    </div>

                    {/* Skill Badge container */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[9px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">{"Matched Skills Vectors"}</span>
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
                      <span className="font-mono font-bold text-primary block mb-1 uppercase text-[10px]">{"AI Matching Evaluation"}</span>
                      {calcTag === "🔥 Hidden Talent" ? (
                        "High repository activity detected. Output density matches senior profiles despite limited tenure. Strongly recommend fast-track technical challenge."
                      ) : calcScore >= 80 ? (
                        "Strong fit. Candidate demonstrates clean patterns in key frameworks requested. Ready to bypass standard screening filters."
                      ) : (
                        "Acceptable core skills found, but alignment reveals minor stack gaps in specialized packages outlined in requirements."
                      )}
                    </div>
                  </div>
                )}

                {/* Automation Invitation Sync container */}
                <div className="border-t border-white/10 pt-6 mt-4 shrink-0 flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">{"Automation Pipeline"}</span>
                    <span className="flex items-center gap-1.5 text-[9px] text-secondary font-mono font-bold uppercase">
                      <Lock className="w-3 h-3 text-secondary" /> {"Secure Dispatch"}
                    </span>
                  </div>

                  {schedulingState === 'idle' && (
                    <button 
                      onClick={triggerSchedule}
                      disabled={simulating || calcScore === null}
                      className="w-full bg-secondary hover:bg-secondary-container text-black font-mono font-black py-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{"Dispatch Invitation Sync"}</span>
                    </button>
                  )}

                  {schedulingState === 'loading' && (
                    <button 
                      disabled 
                      className="w-full bg-surface-container-high text-on-surface-variant font-mono font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/5"
                    >
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                      <span>{"Locking calendar availability..."}</span>
                    </button>
                  )}

                  {schedulingState === 'success' && (
                    <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                      <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div className="text-xs font-sans">
                        <p className="font-bold text-white">{"Pipeline Dispatched"}</p>
                        <p className="text-on-surface-variant mt-2 leading-relaxed">
                          {"📧 Calendar invitation and verified technical report sent to candidate's parsed inbox."}
                        </p>
                        <p className="text-on-surface-variant mt-1 leading-relaxed">
                          {"📅 Block scheduled for next Monday at 10:00 AM."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 🎮 SECTION 12: COULD YOU SPOT SARAH? */}
        <section className="py-section-gap px-6 md:px-20 bg-background border-t border-white/5" id="challenge-section">
          <div className="max-w-container-max mx-auto text-center flex flex-col items-center gap-6">
            <span className="font-mono text-xs text-secondary tracking-widest block uppercase font-bold animate-pulse">{"Interactive Challenge"}</span>
            <h2 className="font-sans font-black text-3xl md:text-6xl text-white tracking-tight">
              {"Could you spot Sarah?"}
            </h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-xl font-light mb-16">
              {"Test your hiring instinct. Out of these five candidates, who would you move to a technical interview?"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 w-full max-w-5xl">
              {/* Candidate 1 */}
              <button
                onClick={() => setSelectedChallenge(1)}
                className={`glass-card p-6 text-left rounded-xl transition-all duration-300 relative cursor-pointer border ${
                  selectedChallenge === 1 ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(228,22,19,0.15)]" : "border-white/5 hover:border-white/10"
                }`}
              >
                <h3 className="font-sans font-bold text-xs text-white mb-2">{"Harvard CS Grad"}</h3>
                <p className="font-mono text-[9px] text-on-surface-variant uppercase mb-4">{"Credentials Major"}</p>
                <div className="space-y-1 font-mono text-[9px] text-neutral-500">
                  <p>{"• GPA 3.9"}</p>
                  <p>{"• 1 FAANG Internship"}</p>
                  <p>{"• CS Degree"}</p>
                </div>
              </button>

              {/* Candidate 2 */}
              <button
                onClick={() => setSelectedChallenge(2)}
                className={`glass-card p-6 text-left rounded-xl transition-all duration-300 relative cursor-pointer border ${
                  selectedChallenge === 2 ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(228,22,19,0.15)]" : "border-white/5 hover:border-white/10"
                }`}
              >
                <h3 className="font-sans font-bold text-xs text-white mb-2">{"Coding Bootcamper"}</h3>
                <p className="font-mono text-[9px] text-on-surface-variant uppercase mb-4">{"6 Month Course"}</p>
                <div className="space-y-1 font-mono text-[9px] text-neutral-500">
                  <p>{"• Clone Portfolios"}</p>
                  <p>{"• Basic JS & HTML"}</p>
                  <p>{"• No Production Exp"}</p>
                </div>
              </button>

              {/* Candidate 3 */}
              <button
                onClick={() => setSelectedChallenge(3)}
                className={`glass-card p-6 text-left rounded-xl transition-all duration-300 relative cursor-pointer border ${
                  selectedChallenge === 3 ? "border-secondary/60 bg-secondary/10 shadow-[0_0_15px_rgba(197,168,128,0.15)]" : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <h3 className="font-sans font-bold text-xs text-white mb-2">{"Self-Taught Builder"}</h3>
                <p className="font-mono text-[9px] text-secondary font-bold uppercase mb-4">{"Sarah Chen"}</p>
                <div className="space-y-1 font-mono text-[9px] text-neutral-400">
                  <p>{"• 4 React Codebases"}</p>
                  <p>{"• 2,100+ Git Commits"}</p>
                  <p>{"• Unfinished BA Degree"}</p>
                </div>
              </button>

              {/* Candidate 4 */}
              <button
                onClick={() => setSelectedChallenge(4)}
                className={`glass-card p-6 text-left rounded-xl transition-all duration-300 relative cursor-pointer border ${
                  selectedChallenge === 4 ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(228,22,19,0.15)]" : "border-white/5 hover:border-white/10"
                }`}
              >
                <h3 className="font-sans font-bold text-xs text-white mb-2">{"Enterprise Vet"}</h3>
                <p className="font-mono text-[9px] text-on-surface-variant uppercase mb-4">{"12 Years Tenure"}</p>
                <div className="space-y-1 font-mono text-[9px] text-neutral-500">
                  <p>{"• Legacy Migrations"}</p>
                  <p>{"• Stagnant GitHub"}</p>
                  <p>{"• Relies on Templates"}</p>
                </div>
              </button>

              {/* Candidate 5 */}
              <button
                onClick={() => setSelectedChallenge(5)}
                className={`glass-card p-6 text-left rounded-xl transition-all duration-300 relative cursor-pointer border ${
                  selectedChallenge === 5 ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(228,22,19,0.15)]" : "border-white/5 hover:border-white/10"
                }`}
              >
                <h3 className="font-sans font-bold text-xs text-white mb-2">{"MBA Lead"}</h3>
                <p className="font-mono text-[9px] text-on-surface-variant uppercase mb-4">{"Management Track"}</p>
                <div className="space-y-1 font-mono text-[9px] text-neutral-500">
                  <p>{"• High Jargon"}</p>
                  <p>{"• Agile Certified"}</p>
                  <p>{"• Minimal Code Output"}</p>
                </div>
              </button>
            </div>

            {/* Answer feedback */}
            <div className="w-full max-w-xl min-h-[120px] mt-8">
              {selectedChallenge === 3 && (
                <div className="glass-card p-6 rounded-xl border-secondary/20 text-left animate-fade-in">
                  <span className="font-mono text-xs text-secondary font-bold uppercase block mb-1">{"CORRECT DECISION"}</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {"ZeroCV surfaced Sarah Chen instantly. Her capability blueprint shows massive technical depth and learning velocity that CS grads or resume-stuffers lack. However, traditional resume keyword screens auto-rejected her 69 times."}
                  </p>
                </div>
              )}
              {selectedChallenge !== null && selectedChallenge !== 3 && (
                <div className="glass-card p-6 rounded-xl border-primary/20 text-left animate-fade-in">
                  <span className="font-mono text-xs text-primary font-bold uppercase block mb-1">{"TRADITIONAL BIAS TRAP"}</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {"Traditional filtering systems and manual recruiters would agree. But their actual code contribution maps reveal stagnant execution and minimal framework depth. By choosing credentials, you missed Sarah Chen, a top-tier execution candidate."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🚀 FINAL SECTION: CALL TO ACTION */}
        <section className="py-28 px-6 md:px-20 text-center relative overflow-hidden bg-black border-t border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(228,22,19,0.03)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
            <h2 className="font-display-lg text-4xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
              {"Hiring is broken."} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">{"Talent isn't."}</span>
            </h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-xl leading-relaxed font-light">
              {"Discover the candidates your current hiring process never sees. Try ZeroCV semantic evaluation now."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center w-full max-w-md">
              <Link
                href="/platform"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                  }
                }}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-mono text-xs font-bold glow-button transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
              >
                {"Open Platform"}
              </Link>
              <a
                href="#sandbox-section"
                className="border border-white/10 text-white px-8 py-4 rounded-full font-mono text-xs font-bold hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer"
              >
                {"Try Live Evaluation"}
              </a>
            </div>
          </div>
        </section>

        {/* 🧬 13.5 ANTI-GRAVITY HIDDEN CAPABILITY FIELD */}
        <AntiGravityCanvas />

      </main>

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
