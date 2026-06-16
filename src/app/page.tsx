"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Brain, Cpu, Zap, Sparkles, Clock, 
  ArrowRight, Lock, Check, Mail, Calendar, 
  Flame, FileText, CheckCircle, RefreshCw
} from "lucide-react";

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
    roleKey: "roleReactSpecialist",
    resume: "Alex Mercer Resume\nSkills: React, JavaScript, TypeScript, CSS, TailwindCSS, Git.\nProjects: Created SaaS CRM Core Dashboard utilizing hooks and custom states, speeding up ui rendering by 30%.\nTenure: 1.5 years experience.",
    experience: 1.5,
  },
  sarah: {
    name: "Sarah Connor",
    roleKey: "roleSeniorPlatform",
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

// Interactive Particle Background for Hero
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const particleCount = Math.min(50, Math.floor((width * height) / 24000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.8,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(228, 22, 19, 0.08)'; 
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.03)'; 

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(197, 168, 128, ${0.1 * (1 - dist / 140)})`;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(228, 22, 19, ${0.15 * (1 - dist / 180)})`;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />;
};

export default function Home() {
  // Simulator State
  const [selectedJdKey, setSelectedJdKey] = useState<'frontend' | 'backend'>('frontend');
  const [jdText, setJdText] = useState(templates.frontend.jd);
  const [resumeText, setResumeText] = useState(candidates.alex.resume);
  const [candidateName, setCandidateName] = useState(candidates.alex.name);
  const [calcScore, setCalcScore] = useState<number | null>(null);
  const [calcSkills, setCalcSkills] = useState<string[]>([]);
  const [calcExp, setCalcExp] = useState<number>(1.5);
  const [calcTag, setCalcTag] = useState<string>("None");
  const [simulating, setSimulating] = useState(false);

  // Automation simulator state
  const [schedulingState, setSchedulingState] = useState<'idle' | 'loading' | 'success'>('idle');

  // Trigger evaluation immediately on load for Alex Mercer
  useEffect(() => {
    calculateMatching(templates.frontend.jd, candidates.alex.resume, candidates.alex.experience);
  }, []);

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

  const calculateMatching = (jd: string, resume: string, expYears: number) => {
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

      // Extract skills
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
    // Attempt parsing years of experience from custom text if user edited it
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
    <div className="flex flex-col min-h-screen bg-dark-bg selection:bg-primary/20 selection:text-red-200">
      
      {/* 🧭 NAVIGATION HEADER */}
      <header className="fixed top-0 w-full z-40 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border/40 py-5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-sans font-extrabold text-2xl tracking-tighter text-white">
              zero<span className="text-primary">CV</span>
            </span>
            <span className="bg-primary/10 text-primary text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-primary/25">
              Hiring Redefined
            </span>
          </div>

          <a 
            href="#engine"
            className="bg-primary hover:bg-primary-hover active:bg-primary/90 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all"
          >
            Launch Engine
          </a>
        </div>
      </header>

      {/* 🧊 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dark-bg pt-20">
        <ParticleCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/20 via-dark-bg/70 to-dark-bg z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 bg-accent/10 border border-accent/25 px-3 py-1 rounded-full text-accent text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Talent Matching Platform</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-sans font-extrabold text-5xl md:text-8xl text-white tracking-tight leading-none select-none max-w-4xl"
          >
            Hiring is broken.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">We fixed it with AI.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-300 text-lg md:text-2xl max-w-2xl leading-relaxed font-light"
          >
            Discover real talent beyond resumes and degrees. Contextual, vector-similarity mapping identifying top fits in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex mt-4"
          >
            <a 
              href="#engine"
              className="bg-primary hover:bg-primary-hover active:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl shadow-primary/20 flex items-center gap-3 group"
            >
              <span>Test Matching Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ⚠️ 2. THE MANIFESTO (Simplifying Problem/Solution) */}
      <section className="py-24 px-6 md:px-12 bg-dark-bg border-t border-dark-border/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider">The Problem</span>
            <h3 className="font-sans font-bold text-3xl text-white tracking-tight leading-tight">
              Traditional filters ignore the top 90% of talent.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mt-1">
              Legacy ATS keyword screeners discard outstanding builders simply because their resumes lack explicit credential labels, degree names, or precise keywords. Skill is buried under format.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">The Solution</span>
            <h3 className="font-sans font-bold text-3xl text-white tracking-tight leading-tight">
              zeroCV score actual capability DNA.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mt-1">
              We translate candidate contributions and Job Descriptions into vector semantic spaces, executing Cosine Similarity formulas client-side. We identify true capability, highlighting hidden talent with low tenure.
            </p>
          </div>
        </div>
      </section>

      {/* 💻 3. THE LIVE MATCHING ENGINE WORKSPACE (Core of the idea) */}
      <section id="engine" className="py-32 px-6 md:px-12 bg-dark-card border-t border-dark-border/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-dark-border/40">
            <div>
              <span className="text-primary text-xs uppercase font-bold tracking-widest block">Interactive Sandbox</span>
              <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight mt-1">Valuation Engine</h2>
            </div>
            
            {/* Quick Candidate Preset Selectors */}
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="text-xs text-slate-500 font-medium">Load Preset:</span>
              <button 
                onClick={() => loadCandidatePreset('alex')}
                className={`text-xs px-3.5 py-2 rounded-lg border font-semibold transition-colors ${
                  candidateName === "Alex Mercer" 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-[#050B14] border-dark-border text-slate-400 hover:text-white"
                }`}
              >
                Alex Mercer (🔥 Hidden Talent)
              </button>
              <button 
                onClick={() => loadCandidatePreset('sarah')}
                className={`text-xs px-3.5 py-2 rounded-lg border font-semibold transition-colors ${
                  candidateName === "Sarah Connor" 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-[#050B14] border-dark-border text-slate-400 hover:text-white"
                }`}
              >
                Sarah Connor (⭐ Top Fit)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input Sandbox Panel */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    1. Job Requirements
                  </h3>
                  
                  {/* JD Preset selection */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => selectJd('frontend')}
                      className={`text-[10px] px-2.5 py-1 rounded font-bold transition-all ${
                        selectedJdKey === 'frontend' ? "bg-primary text-white" : "bg-dark-bg text-slate-400 border border-dark-border"
                      }`}
                    >
                      Frontend Spec
                    </button>
                    <button 
                      onClick={() => selectJd('backend')}
                      className={`text-[10px] px-2.5 py-1 rounded font-bold transition-all ${
                        selectedJdKey === 'backend' ? "bg-primary text-white" : "bg-dark-bg text-slate-400 border border-dark-border"
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
                  className="w-full bg-[#050B14] border border-dark-border rounded-xl text-slate-300 text-xs p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  2. Candidate Experience Text
                </h3>
                
                <textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={5}
                  className="w-full bg-[#050B14] border border-dark-border rounded-xl text-slate-300 text-xs p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono resize-none leading-relaxed"
                />
                
                <button 
                  onClick={handleManualAnalyze}
                  disabled={simulating}
                  className="bg-[#172336] border border-dark-border hover:border-primary/50 text-white font-semibold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {simulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                      <span>Re-calculating Alignment Vectors...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 text-accent" />
                      <span>Analyze Custom Input</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right: Valuation Results Panel */}
            <div className="lg:col-span-6 bg-[#050B14] border border-dark-border rounded-2xl p-8 shadow-xl flex flex-col gap-6 min-h-[460px] justify-between">
              
              {simulating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="font-sans font-bold text-slate-200">Recomputing Cosine Similarities...</p>
                    <p className="text-xs text-slate-500 mt-1">Executing text token mapping in browser sandbox</p>
                  </div>
                </div>
              ) : calcScore === null ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-slate-500">
                  <Cpu className="w-12 h-12 text-dark-border mb-3" />
                  <p className="font-bold text-slate-300">Matching Offline</p>
                  <p className="text-xs text-slate-600 mt-1">Pasting customized data will trigger cosine computations.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 animate-fade-in">
                  
                  {/* Top header row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-sans font-extrabold text-2xl text-white">{candidateName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Parsed Capability Valuation</p>
                    </div>
                    {calcTag !== "None" && (
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {calcTag}
                      </span>
                    )}
                  </div>

                  {/* Similarity score block */}
                  <div className="flex items-center gap-6 bg-dark-card border border-dark-border/40 p-5 rounded-2xl glow-border">
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" className="fill-none stroke-dark-border" strokeWidth="4"></circle>
                        <circle cx="32" cy="32" r="28" className="fill-none stroke-primary" strokeWidth="4" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * calcScore) / 100}></circle>
                      </svg>
                      <span className="absolute font-sans font-extrabold text-white text-sm">{calcScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Fit Score</span>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                        Matches contextual keyword vectors to requirements. Bypasses strict years boundaries to prioritize output capability.
                      </p>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-card border border-dark-border/60 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Parsed Tenure</span>
                      <span className="text-sm font-bold text-white block mt-0.5">{calcExp} Years</span>
                    </div>
                    <div className="bg-dark-card border border-dark-border/60 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Skills Mapped</span>
                      <span className="text-sm font-bold text-white block mt-0.5">{calcSkills.length} Mapped</span>
                    </div>
                  </div>

                  {/* Skill Badge Box */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Matched Skill Vector</span>
                    <div className="flex flex-wrap gap-1.5">
                      {calcSkills.map((s, idx) => (
                        <span key={idx} className="bg-slate-900 border border-dark-border text-[10px] text-slate-300 px-2.5 py-0.5 rounded font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Assessment */}
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-primary block mb-1">AI Valuation Summary</span>
                    {calcTag === "🔥 Hidden Talent" ? (
                      "Highly competent project contributions parsed despite minimal years of experience. Strong candidate for fast-track interview."
                    ) : calcScore >= 80 ? (
                      "Strong candidate. Parsed skill mappings cover key operational requirements requested in job description."
                    ) : (
                      "Competent base skills parsed, but displays matching gaps in specialized frameworks requested in the job description."
                    )}
                  </div>
                </div>
              )}

              {/* Automation Calendar Sync Section */}
              <div className="border-t border-dark-border/40 pt-6 mt-6 shrink-0 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Recruitment Automation</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                    <Lock className="w-3 h-3" /> Secure Sync
                  </span>
                </div>

                {schedulingState === 'idle' && (
                  <button 
                    onClick={triggerSchedule}
                    disabled={simulating}
                    className="w-full bg-primary hover:bg-primary-hover active:bg-primary/95 text-white font-bold py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Autonomous Invitation</span>
                  </button>
                )}

                {schedulingState === 'loading' && (
                  <button 
                    disabled 
                    className="w-full bg-[#172336] text-slate-400 font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                    <span>Drafting email and scheduling calendar sync...</span>
                  </button>
                )}

                {schedulingState === 'success' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold">Automation Dispatched</p>
                      <p className="text-slate-300 mt-1">📧 Calendar invite and valuation summary sent to candidate's parsed inbox.</p>
                      <p className="text-slate-300 mt-0.5">📅 Availability locked for next Monday at 10:00 AM.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 📇 FOOTER */}
      <footer className="bg-dark-bg border-t border-dark-border/60 py-12 px-6 text-center text-xs text-slate-500 mt-auto">
        <p className="max-w-xl mx-auto leading-relaxed">
          © 2026 zeroCV Technologies Inc. All rights reserved. Powered by client-side browser embeddings similarity matching.
        </p>
      </footer>

    </div>
  );
}
