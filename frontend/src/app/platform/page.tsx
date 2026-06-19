"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Cpu, Check, Calendar, CheckCircle, User,
  Award, Search, Upload, HelpCircle, ChevronDown,
  Sparkles, X, Mail, FileText, LogOut,
  Settings, Activity, Users, Code, Rocket
} from "lucide-react";

// Types
interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: number;
  score: number;
  learningVelocity: number;
  potential: number;
  risk: "Low" | "Medium" | "High";
  recommendation: "Recommended" | "Review" | "Watchlist";
  tag?: string;
  skills: string[];
  resume: string;
  capabilities: {
    skillDepth: number;
    learningVelocity: number;
    problemSolving: number;
    projectQuality: number;
    consistency: number;
  };
  evidence: string[];
  reasoning: string;
  funnelStep: "Applied" | "Evaluated" | "Shortlisted" | "Interview" | "Offer" | "Hired";
}

// Preset candidates data
const defaultCandidates: Candidate[] = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "Self-Taught Builder",
    experience: 2,
    score: 94,
    learningVelocity: 91,
    potential: 96,
    risk: "Low",
    recommendation: "Recommended",
    skills: ["React", "TypeScript", "WASM", "WebGL", "Rust", "Tailwind"],
    resume: "Self-taught developer with 2+ years of intensive repository building. Created 4 production-grade React codebases from scratch. 2,100+ Git commits with high code density. Contributed to open-source renderers. Unfinished BA degree in literature.",
    capabilities: {
      skillDepth: 93,
      learningVelocity: 91,
      problemSolving: 95,
      projectQuality: 96,
      consistency: 94
    },
    evidence: [
      "2,100+ verified commits across 4 repositories",
      "Built custom WebGL portal shader rendering engine",
      "Integrated WebAssembly modules for client-side processing",
      "Maintained 98% test coverage on personal projects"
    ],
    reasoning: "Outstanding capability profile. Displays extreme learning velocity and project depth that vastly outperforms standard mid-level industry benchmarks. Resume keyword filters would auto-reject her due to an unfinished degree, but zeroCV vector mapping identifies her code output as senior-grade.",
    tag: "🔥 Hidden Talent",
    funnelStep: "Evaluated"
  },
  {
    id: "alex",
    name: "Alex Mercer",
    role: "Harvard CS Graduate",
    experience: 1,
    score: 68,
    learningVelocity: 60,
    potential: 55,
    risk: "Medium",
    recommendation: "Review",
    skills: ["Java", "Python", "React", "SQL", "Git"],
    resume: "Harvard University BS in Computer Science (GPA 3.9). Completed 1 FAANG software engineering summer internship. Built portfolio website using template. Proficient in algorithms and data structures.",
    capabilities: {
      skillDepth: 72,
      learningVelocity: 60,
      problemSolving: 80,
      projectQuality: 58,
      consistency: 55
    },
    evidence: [
      "Harvard CS Degree (GPA 3.9)",
      "1 FAANG Summer Internship (12 weeks)",
      "Stagnant personal GitHub activity (14 commits)",
      "Relies heavily on standard boilerplate templates"
    ],
    reasoning: "Strong theoretical credentials and algorithm foundation. However, codebase contribution maps reveal low development density and lack of production-level project execution. High risk of stagnating in fast-paced startup teams.",
    funnelStep: "Applied"
  },
  {
    id: "sophia",
    name: "Sophia Martinez",
    role: "Bootcamp Graduate",
    experience: 1,
    score: 55,
    learningVelocity: 70,
    potential: 50,
    risk: "High",
    recommendation: "Watchlist",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    resume: "Completed intensive 6-month full-stack development bootcamp. Built 2 cloned clone-projects (Airbnb clone, Todo list) in JavaScript and React. Eager to transition to software engineering.",
    capabilities: {
      skillDepth: 55,
      learningVelocity: 70,
      problemSolving: 50,
      projectQuality: 45,
      consistency: 65
    },
    evidence: [
      "6-Month Web Development Boot Camp Certificate",
      "Built 2 boilerplate clones (Airbnb & Todo App)",
      "Familiar with standard JS & React ecosystem",
      "Active weekly learning patterns"
    ],
    reasoning: "High energy transition profile. Demonstrates solid fundamental knowledge of React and Node.js. Currently lacks experience with production codebase scaling, custom render loops, or complex performance optimization.",
    funnelStep: "Applied"
  }
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

export default function PlatformPage() {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const loggedIn = sessionStorage.getItem("zeroCV_logged_in");
        if (loggedIn === "true") {
          setTimeout(() => setIsLoggedIn(true), 0);
        } else {
          setTimeout(() => setShowLoginModal(true), 0);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isLoggedIn) {
      try {
        const loadSearch = sessionStorage.getItem("zeroCV_load_search");
        if (loadSearch === "frontend") {
          sessionStorage.removeItem("zeroCV_load_search");
          setTimeout(() => {
            loadDemoData();
          }, 400);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isLoggedIn]);

  const [hasData, setHasData] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  
  // Active Jd text and custom inputs
  const [jdText, setJdText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRec, setFilterRec] = useState<string>("All");
  const [sortField, setSortField] = useState<"score" | "learningVelocity" | "potential">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selected details drawer
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Recruiter action triggers
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionText, setActionText] = useState<string | null>(null);

  // Assistant states
  const [assistantOpen, setAssistantOpen] = useState<Record<string, boolean>>({
    work: false,
    help: false,
    rank: false
  });

  const [inputError, setInputError] = useState<string | null>(null);

  // Simulated drag-and-drop dragover
  const [isDragging, setIsDragging] = useState(false);

  // Load sample demo payload
  function loadDemoData() {
    setJdText("Looking for a Senior Frontend Architect to build responsive rendering modules, WebGL custom shaders, and WebAssembly systems. Codebase contributions are primary, credentials secondary.");
    setUploadedFiles([
      { name: "sarah_chen_resume.pdf", size: "142 KB" },
      { name: "alex_mercer_resume.pdf", size: "128 KB" },
      { name: "sophia_martinez_resume.pdf", size: "115 KB" }
    ]);
    setCandidates(defaultCandidates);
    setHasData(true);
    setSelectedId("sarah");
  }

  // Run AI processing sequences
  const triggerAnalysis = () => {
    if (!jdText.trim() && uploadedFiles.length === 0) {
      setInputError("Please enter a job description or upload candidate profiles first.");
      return;
    }
    setInputError(null);
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            // Ensure candidates exist
            if (candidates.length === 0) {
              setCandidates(defaultCandidates);
            }
            setHasData(true);
            setSelectedId("sarah");
          }, 300);
          return 6;
        }
        return prev + 1;
      });
    }, 550);
  };

  // Drag and drop mock actions
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Read names of files
    const files = Array.from(e.dataTransfer.files);
    const addedFiles = files.map(f => ({
      name: f.name,
      size: `${Math.round(f.size / 1024)} KB`
    }));

    setUploadedFiles(prev => [...prev, ...addedFiles]);
    
    // Simulate loading data automatically
    if (candidates.length === 0) {
      setCandidates(defaultCandidates);
    }
  };

  const triggerFileUpload = () => {
    // Add mock files
    const fileCount = uploadedFiles.length + 1;
    const names = ["github_profile_import.json", "linkedin_candidate_export.pdf", "dev_portfolio_scrape.docx", "cv_contribution_logs.pdf"];
    const name = names[fileCount % names.length];
    
    setUploadedFiles(prev => [...prev, { name, size: "184 KB" }]);
    if (candidates.length === 0) {
      setCandidates(defaultCandidates);
    }
  };

  const clearWorkspace = () => {
    setHasData(false);
    setUploadedFiles([]);
    setCandidates([]);
    setJdText("");
    setSelectedId(null);
  };

  // Recruiter action execution mock
  const runRecruiterAction = (actionKey: string, candidateName: string) => {
    setActionLoading(actionKey);
    setActionSuccess(null);
    setActionText(null);

    setTimeout(() => {
      setActionLoading(null);
      setActionSuccess(actionKey);
      
      let msg = "";
      if (actionKey === "questions") {
        msg = `Generated custom technical questions for ${candidateName}:\n1. "Explain your concurrent rendering optimization in WebGL."\n2. "How did you manage state sync in WASM?"`;
      } else if (actionKey === "summary") {
        msg = `${candidateName} summary compiled: High delivery consistency. Highly skilled with canvas layers. Unfinished credential bias resolved. Recommended for immediate funnel fast-track.`;
      } else if (actionKey === "outreach") {
        msg = `Outreach email template queued for ${candidateName}: "Hi ${candidateName.split(" ")[0]}, we verified your repository metrics on GitHub and would love to chat about our Frontend Architect position..."`;
      } else if (actionKey === "schedule") {
        msg = `Interview session scheduler dispatched to ${candidateName}'s verified inbox. Syncing availability next Monday at 10 AM.`;
      }
      setActionText(msg);
    }, 1200);
  };

  // Change funnel phase for selected candidate
  const setCandidateFunnel = (id: string, step: Candidate["funnelStep"]) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, funnelStep: step } : c));
  };

  // Sort candidates
  const handleSort = (field: "score" | "learningVelocity" | "potential") => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Filter candidates list
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRec = filterRec === "All" ? true : c.recommendation === filterRec;
    return matchesSearch && matchesRec;
  }).sort((a, b) => {
    const mult = sortOrder === "desc" ? 1 : -1;
    return (b[sortField] - a[sortField]) * mult;
  });

  const selectedCandidate = candidates.find(c => c.id === selectedId) || null;
  const hiddenTalent = candidates.find(c => c.tag === "🔥 Hidden Talent") || null;

  return (
    <div className="flex flex-col min-h-screen bg-black text-on-surface selection:bg-primary selection:text-on-primary font-sans">
      
      {/* 🧭 TOP NAVIGATION BAR */}
      <header className="border-b border-white/5 bg-neutral-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 grid grid-cols-3 items-center">
          
          {/* Column 1: Left - Logo */}
          <div className="flex items-center gap-3 justify-start">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 relative drop-shadow-[0_0_15px_rgba(228,22,19,0.3)]">
                <div className="absolute inset-0 bg-primary/15 blur-md rounded-full scale-150 animate-pulse" />
                <svg className="w-full h-full relative" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="navGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E41613" />
                      <stop offset="100%" stopColor="#C5A880" />
                    </linearGradient>
                    <linearGradient id="navGradDiag" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C5A880" />
                      <stop offset="50%" stopColor="#E41613" />
                      <stop offset="100%" stopColor="#8F0F1E" />
                    </linearGradient>
                    <linearGradient id="navGradBot" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8F0F1E" />
                      <stop offset="100%" stopColor="#C5A880" />
                    </linearGradient>
                  </defs>
                  <path d="M20,20 H80 L68,36 H20 Z" fill="url(#navGradTop)" />
                  <path d="M80,20 L32,80 H44 L80,36 Z" fill="url(#navGradDiag)" />
                  <path d="M20,80 H80 L68,64 H32 Z" fill="url(#navGradBot)" />
                </svg>
              </div>
              <span className="font-display-lg text-lg font-black tracking-tight text-white">
                Zero<span className="text-secondary">CV</span>
              </span>
            </Link>
          </div>

          {/* Column 2: Center - Home | Platform */}
          <nav className="flex justify-center items-center gap-8 font-mono text-[10px] uppercase tracking-widest">
            <div className="relative py-1 group opacity-50 hover:opacity-100 transition-opacity duration-300">
              <Link 
                href="/" 
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                {"Home"}
              </Link>
              <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary/60 rounded-full group-hover:w-full group-hover:left-0 transition-all duration-300" />
            </div>

            <div className="relative py-1 group">
              <Link 
                href="/platform" 
                className="text-white font-bold transition-all duration-300 relative"
                style={{ textShadow: "0 0 10px rgba(228, 22, 19, 0.8), 0 0 20px rgba(228, 22, 19, 0.4)" }}
              >
                {"Platform"}
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(228,22,19,0.8)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
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
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer bg-transparent border-none"
                          >
                            <Settings className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{"Settings"}</span>
                          </button>
                          <button 
                            onClick={() => {
                              setShowAccountDropdown(false);
                              setShowSavedSearchesModal(true);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer bg-transparent border-none"
                          >
                            <Search className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{"Saved Searches"}</span>
                          </button>
                          <button 
                            onClick={() => {
                              setShowAccountDropdown(false);
                              setShowAnalyticsModal(true);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer bg-transparent border-none"
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
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-primary hover:bg-primary/5 transition-all text-left w-full cursor-pointer bg-transparent border-none"
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
              onClick={() => {
                setShowLoginModal(false);
                router.push("/");
              }}
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
                onClick={() => {
                  setShowLoginModal(false);
                  router.push("/");
                }}
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
                          loadDemoData();
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

      {/* 💻 MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative">
        
        {/* Workspace Overview Card */}
        <div className="col-span-1 md:col-span-12">
          <div className="glass-card p-6 border border-primary/20 bg-neutral-950/40 relative overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(228,22,19,0.05)] animate-fade-in">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-80 h-40 bg-[radial-gradient(circle_at_top_right,rgba(228,22,19,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-40 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold">{"Workspace Active"}</span>
                </div>
                <h1 className="font-sans font-black text-2xl md:text-3xl text-white tracking-tight">
                  {"Harvard Recruiting Team"}
                </h1>
                <p className="font-sans text-xs text-neutral-400 mt-1">
                  {"Managing engineering searches and deep-dive developer evaluations."}
                </p>
              </div>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-3 gap-4 w-full md:w-auto min-w-[320px] sm:min-w-[480px]">
                {/* Active Roles */}
                <div className="glass-card p-3 border border-white/5 bg-white/[0.02] hover:border-primary/25 transition-all duration-300 rounded-xl flex flex-col gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block">{"Active Roles"}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans text-2xl font-black text-white leading-none animate-pulse">
                      <CountUp value={4} trigger={true} />
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">{"roles"}</span>
                  </div>
                </div>

                {/* Candidates Processed */}
                <div className="glass-card p-3 border border-white/5 bg-white/[0.02] hover:border-primary/25 transition-all duration-300 rounded-xl flex flex-col gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block">{"Candidates Processed"}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans text-2xl font-black text-white leading-none">
                      <CountUp value={142} trigger={true} />
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">{"profiles"}</span>
                  </div>
                </div>

                {/* Hidden Talent Discoveries */}
                <div className="glass-card p-3 border border-amber-500/10 bg-amber-500/[0.01] hover:border-amber-500/30 transition-all duration-300 rounded-xl flex flex-col gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400/80 block">{"Hidden Talent"}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans text-2xl font-black text-amber-400 leading-none">
                      <CountUp value={12} trigger={true} />
                    </span>
                    <span className="text-[10px] font-mono text-amber-500/70">{"found"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT STICKY ASSISTANT COLUMN (MD: 3/12) */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="md:sticky md:top-24 space-y-4">
            
            {/* Assistant Card 1: How does ZeroCV work? */}
            <div 
              onMouseEnter={() => setAssistantOpen(prev => ({ ...prev, work: true }))}
              onMouseLeave={() => setAssistantOpen(prev => ({ ...prev, work: false }))}
              className="glass-card p-4 hover:border-primary/30 transition-all duration-300 relative group cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-secondary uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  <span>How does ZeroCV work?</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${assistantOpen.work ? 'rotate-180 text-primary' : ''}`} />
              </div>
              
              <AnimatePresence>
                {assistantOpen.work && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-3 border-t border-white/5 overflow-hidden"
                  >
                    <ol className="space-y-3 font-mono text-[10px] text-neutral-400">
                      <li className="flex gap-2">
                        <span className="text-secondary">1.</span>
                        <span>Upload Job Description</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-secondary">2.</span>
                        <span>Upload Candidates</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-secondary">3.</span>
                        <span>Candidate DNA Generated</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-secondary">4.</span>
                        <span>Hidden Talent Detected</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-secondary">5.</span>
                        <span>Review Recommendations</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-secondary">6.</span>
                        <span>Schedule Interviews</span>
                      </li>
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Assistant Card 2: Need Help? */}
            <div 
              onMouseEnter={() => setAssistantOpen(prev => ({ ...prev, help: true }))}
              onMouseLeave={() => setAssistantOpen(prev => ({ ...prev, help: false }))}
              className="glass-card p-4 hover:border-primary/30 transition-all duration-300 relative group cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-secondary uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Need Help?</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${assistantOpen.help ? 'rotate-180 text-primary' : ''}`} />
              </div>

              <AnimatePresence>
                {assistantOpen.help && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-3 border-t border-white/5 overflow-hidden text-[10px] space-y-4"
                  >
                    <div>
                      <span className="font-mono font-bold text-white uppercase text-[9px] tracking-wider block mb-1">Supported Inputs:</span>
                      <p className="text-neutral-400 font-mono">PDF, DOCX, GitHub, LinkedIn, Portfolio URLs</p>
                    </div>
                    <div>
                      <span className="font-mono font-bold text-white uppercase text-[9px] tracking-wider block mb-1">Supported Outputs:</span>
                      <p className="text-neutral-400 font-mono">Candidate Ranking, Interview Questions, AI Summaries</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Assistant Card 3: How are candidates ranked? */}
            <div 
              onMouseEnter={() => setAssistantOpen(prev => ({ ...prev, rank: true }))}
              onMouseLeave={() => setAssistantOpen(prev => ({ ...prev, rank: false }))}
              className="glass-card p-4 hover:border-primary/30 transition-all duration-300 relative group cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-secondary uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>How are candidates ranked?</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${assistantOpen.rank ? 'rotate-180 text-primary' : ''}`} />
              </div>

              <AnimatePresence>
                {assistantOpen.rank && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-3 border-t border-white/5 overflow-hidden text-[10px]"
                  >
                    <p className="text-neutral-400 leading-relaxed font-mono">
                      ZeroCV evaluates Skill Depth, Project Quality, Learning Velocity, Problem Solving, and Consistency. Not keywords alone.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platform mission banner */}
            <div className="border border-white/5 p-4 rounded bg-neutral-950/20 text-center font-mono text-[9px] text-neutral-600">
              Hiring is broken. Talent isn&apos;t.
            </div>

          </div>
        </div>

        {/* RIGHT ACTIVE WORKSPACE COLUMN (MD: 9/12) */}
        <div className="md:col-span-9 flex flex-col gap-6">
          
          {/* Header titles */}
          <div>
            <h1 className="font-sans font-black text-3xl md:text-5xl text-white tracking-tight">{"Find talent beyond resumes."}</h1>
            <p className="font-sans text-on-surface-variant text-sm md:text-base mt-2 max-w-2xl font-light">
              {"Upload a role. Upload candidates. Let ZeroCV discover who deserves attention."}
            </p>
          </div>

          {/* Action cards: Upload JD vs Candidates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Job Description */}
            <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/2 blur-2xl group-hover:bg-primary/5 transition-colors" />
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white">{"Upload Job Description"}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{"Paste JD details, import roles, or upload files."}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setJdText("Senior Frontend Architect looking for WebGL custom shaders, responsive canvas design, and WASM performance tuning.")}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase tracking-wider py-2 px-3 border border-white/5 transition-colors cursor-pointer"
                >
                  {"Paste JD"}
                </button>
                <button 
                  disabled
                  title="Coming soon"
                  className="bg-neutral-900 text-neutral-600 font-mono text-[9px] uppercase tracking-wider py-2 px-3 border border-white/5 cursor-not-allowed"
                >
                  {"Import LinkedIn"}
                </button>
              </div>
            </div>

            {/* Card 2: Candidates */}
            <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/2 blur-2xl group-hover:bg-secondary/5 transition-colors" />
              <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center border border-secondary/20 text-secondary">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white">{"Upload Candidates"}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{"Import candidate resumes, portfolios, or Github links."}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={triggerFileUpload}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] uppercase tracking-wider py-2 px-3 border border-white/5 transition-colors cursor-pointer"
                >
                  {"Add Resumes"}
                </button>
                <button 
                  disabled
                  title="Coming soon"
                  className="bg-neutral-900 text-neutral-600 font-mono text-[9px] uppercase tracking-wider py-2 px-3 border border-white/5 cursor-not-allowed"
                >
                  {"Link GitHub"}
                </button>
              </div>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileUpload}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? "border-primary/80 bg-primary/5 scale-[0.99]" 
                : "border-white/10 hover:border-white/20 bg-neutral-950/20"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center border border-white/5 text-neutral-400 mb-4 animate-bounce">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-bold text-white text-base">{"Drop candidate resumes here"}</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm">
              {"Drag files, paste links, or import profiles. Supported inputs: PDF, DOCX, GitHub, LinkedIn, Portfolio."}
            </p>
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 max-w-md justify-center">
                {uploadedFiles.map((f, i) => (
                  <span key={i} className="bg-neutral-900 border border-white/5 rounded px-2.5 py-1 text-[9px] font-mono text-white flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-secondary" /> {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Job Description editor area */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-secondary tracking-widest uppercase font-bold">{"Job Description Intake"}</span>
              {hasData && (
                <button 
                  onClick={clearWorkspace}
                  className="text-neutral-500 hover:text-primary font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                >
                  {"Clear Workspace"}
                </button>
              )}
            </div>
            <textarea
              value={jdText}
              onChange={(e) => { setJdText(e.target.value); setInputError(null); }}
              placeholder="Paste your job description here..."
              className="w-full h-24 p-3 focus:outline-none focus:border-primary/50 text-xs text-white leading-relaxed resize-none bg-neutral-900 border border-white/5 rounded"
            />
            {inputError && (
              <p className="text-[10px] font-mono text-primary">{inputError}</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={triggerAnalysis}
                disabled={isAnalyzing}
                className="bg-primary hover:bg-primary-hover text-white font-mono font-bold text-[10px] uppercase tracking-wider py-3 px-6 rounded transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Cpu className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{"Analyze Role"}</span>
              </button>
            </div>
          </div>

          {/* AI Processing console */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6 bg-black border border-primary/20 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <h3 className="font-sans font-bold text-white text-sm">{"Analyzing candidate capabilities..."}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 p-2.5 bg-neutral-950 border border-white/5 rounded">
                    <span>{"1. Parsing Resumes"}</span>
                    {analysisProgress >= 1 ? <CheckCircle className="w-4 h-4 text-secondary" /> : <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" />}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 p-2.5 bg-neutral-950 border border-white/5 rounded">
                    <span>{"2. Analyzing Projects"}</span>
                    {analysisProgress >= 2 ? <CheckCircle className="w-4 h-4 text-secondary" /> : <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" />}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 p-2.5 bg-neutral-950 border border-white/5 rounded">
                    <span>{"3. Evaluating Learning Velocity"}</span>
                    {analysisProgress >= 3 ? <CheckCircle className="w-4 h-4 text-secondary" /> : <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" />}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 p-2.5 bg-neutral-950 border border-white/5 rounded">
                    <span>{"4. Building Candidate DNA"}</span>
                    {analysisProgress >= 4 ? <CheckCircle className="w-4 h-4 text-secondary" /> : <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" />}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 p-2.5 bg-neutral-950 border border-white/5 rounded">
                    <span>{"5. Detecting Hidden Talent"}</span>
                    {analysisProgress >= 5 ? <CheckCircle className="w-4 h-4 text-secondary" /> : <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" />}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 p-2.5 bg-neutral-950 border border-white/5 rounded">
                    <span>{"6. Ranking Candidates"}</span>
                    {analysisProgress >= 6 ? <CheckCircle className="w-4 h-4 text-secondary" /> : <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" />}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results dashboard */}
          <div className="flex flex-col gap-6">
            {!hasData ? (
              
              /* Empty state workspace */
              <div className="glass-card p-10 text-center flex flex-col items-center justify-center gap-6 min-h-[350px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.02)_0%,transparent_60%)] pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center relative z-10">
                  <Brain className="w-7 h-7 text-secondary" />
                </div>
                <div className="max-w-md relative z-10">
                  <h3 className="font-sans font-bold text-lg text-white">{"Platform Awaiting Input"}</h3>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed font-light">
                    {"Upload a role and candidate profiles to begin discovering hidden talent. No candidate data is analyzed yet."}
                  </p>
                </div>
                <button
                  onClick={loadDemoData}
                  className="bg-secondary hover:bg-secondary-container text-black font-mono font-bold text-[10px] uppercase tracking-wider py-3 px-6 rounded-md transition-all z-10 cursor-pointer"
                >
                  {"Load Story Presets"}
                </button>
              </div>

            ) : (
              
              /* Active results workspace */
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Candidates table results (XL: 8/12) */}
                <div className="xl:col-span-8 flex flex-col gap-4">
                  <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-neutral-950/40">
                      <h3 className="font-sans font-bold text-sm text-white">{"AI Evaluated Pipeline"}</h3>
                      
                      {/* Search & Recommendations filter */}
                      <div className="flex flex-col sm:flex-row gap-2.5 items-center">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search name, skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-[10px] bg-neutral-900 border border-white/5 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-primary/50 w-40 font-mono"
                          />
                        </div>
                        
                        <div className="flex gap-1.5">
                          {["All", "Recommended", "Review", "Watchlist"].map(opt => (
                            <button
                              key={opt}
                              onClick={() => setFilterRec(opt)}
                              className={`text-[9px] font-mono font-bold uppercase tracking-wider py-1 px-2.5 rounded transition-all border ${
                                filterRec === opt 
                                  ? "bg-primary/10 border-primary/20 text-primary" 
                                  : "border-white/5 hover:bg-white/5 text-neutral-400"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Table element */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/5 text-neutral-500 font-mono uppercase tracking-wider text-[9px] bg-neutral-950/20 select-none">
                            <th className="p-4">{"Candidate"}</th>
                            <th 
                              className="p-4 cursor-pointer hover:text-white"
                              onClick={() => handleSort("score")}
                            >
                              {"Capability Score"} {sortField === "score" && (sortOrder === "desc" ? "↓" : "↑")}
                            </th>
                            <th 
                              className="p-4 cursor-pointer hover:text-white"
                              onClick={() => handleSort("learningVelocity")}
                            >
                              {"Learning Velocity"} {sortField === "learningVelocity" && (sortOrder === "desc" ? "↓" : "↑")}
                            </th>
                            <th 
                              className="p-4 cursor-pointer hover:text-white"
                              onClick={() => handleSort("potential")}
                            >
                              {"Potential"} {sortField === "potential" && (sortOrder === "desc" ? "↓" : "↑")}
                            </th>
                            <th className="p-4">{"Risk"}</th>
                            <th className="p-4">{"Recommendation"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCandidates.map((c) => {
                            const active = selectedId === c.id;
                            return (
                              <tr
                                key={c.id}
                                onClick={() => setSelectedId(c.id)}
                                className={`border-b border-white/5 hover:bg-white/2 cursor-pointer transition-all ${
                                  active ? "bg-neutral-900/40" : ""
                                }`}
                              >
                                <td className="p-4">
                                  <span className="font-bold text-white block">{c.name}</span>
                                  <span className="text-[9px] font-mono text-neutral-500">{c.role}</span>
                                </td>
                                <td className="p-4 font-mono font-bold text-primary">
                                  {c.score}
                                </td>
                                <td className="p-4 font-mono text-secondary">
                                  {c.learningVelocity}
                                </td>
                                <td className="p-4 font-mono text-white">
                                  {c.potential}
                                </td>
                                <td className="p-4 font-mono">
                                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                                    c.risk === "Low" ? "text-green-400 bg-green-500/5" : c.risk === "Medium" ? "text-yellow-400 bg-yellow-500/5" : "text-primary bg-primary/5"
                                  }`}>
                                    {c.risk}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider font-bold ${
                                    c.recommendation === "Recommended" ? "text-secondary bg-secondary/15" : c.recommendation === "Review" ? "text-amber-400 bg-amber-500/10" : "text-neutral-500 bg-neutral-900"
                                  }`}>
                                    {c.recommendation}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredCandidates.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center font-mono text-neutral-600">
                                {"No candidates match the active search filters."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Hidden Talent Card (XL: 4/12) */}
                {hiddenTalent && (
                  <div className="xl:col-span-4">
                    <div className="glass-card p-6 border-secondary/30 bg-gradient-to-br from-neutral-950 to-neutral-900/60 relative overflow-hidden flex flex-col gap-4">
                      {/* Glow background */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center z-10">
                        <span className="font-mono text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{"Hidden Talent Detected"}</span>
                        </span>
                        <span className="bg-primary/10 border border-primary/20 text-primary font-mono text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                          {"Vector Match"}
                        </span>
                      </div>

                      <div className="z-10 mt-1">
                        <h4 className="font-sans font-black text-2xl text-white leading-none">{hiddenTalent.name}</h4>
                        <span className="text-[10px] font-mono text-neutral-500 mt-2 block">{hiddenTalent.role}</span>
                      </div>

                      {/* Rank shift stats */}
                      <div className="grid grid-cols-2 gap-4 font-mono border-t border-b border-white/5 py-4 my-1 z-10">
                        <div className="bg-neutral-950/40 p-3 rounded">
                          <span className="text-[9px] text-neutral-500 block uppercase">{"Traditional ATS Rank"}</span>
                          <span className="text-xl font-bold text-red-500 block mt-1">{"#47"}</span>
                        </div>
                        <div className="bg-secondary/5 border border-secondary/10 p-3 rounded">
                          <span className="text-[9px] text-secondary font-bold block uppercase">{"ZeroCV Rank"}</span>
                          <span className="text-xl font-bold text-white block mt-1">{"#3"}</span>
                        </div>
                      </div>

                      <div className="z-10">
                        <span className="text-[9px] font-mono text-neutral-500 block uppercase mb-1">{"Mismatch Calibration Reason"}</span>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {hiddenTalent.reasoning}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedId(hiddenTalent.id)}
                        className="w-full bg-secondary hover:bg-secondary-container text-black font-mono font-bold text-[9px] uppercase tracking-wider py-2.5 rounded transition-all mt-2 z-10 cursor-pointer"
                      >
                        {"Inspect Capability DNA"}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </main>

      {/* 🧬 DETAILED CANDIDATE SIDE PANEL (SLIDE-OVER DRAWER) */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto cursor-pointer"
            />

            {/* Slide-over Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-neutral-950 border-l border-white/5 shadow-2xl z-50 overflow-y-auto flex flex-col pointer-events-auto"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-neutral-950 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-xl text-white leading-none">{selectedCandidate.name}</h3>
                    <span className="font-mono text-[9px] text-on-surface-variant block mt-1.5">{selectedCandidate.role} • {selectedCandidate.experience} Years Exp</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-neutral-500 hover:text-white p-2 rounded-full border border-white/5 bg-neutral-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-6 flex-1">
                
                {/* 1. Candidate DNA metrics grid */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block">{"Candidate DNA Calibration"}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-900 border border-white/5 p-4 rounded-lg">
                    <div className="space-y-3">
                      {/* Skill Depth */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                          <span>{"Skill Depth"}</span>
                          <span>{selectedCandidate.capabilities.skillDepth}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${selectedCandidate.capabilities.skillDepth}%` }} />
                        </div>
                      </div>
                      
                      {/* Learning Velocity */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                          <span>{"Learning Velocity"}</span>
                          <span>{selectedCandidate.capabilities.learningVelocity}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${selectedCandidate.capabilities.learningVelocity}%` }} />
                        </div>
                      </div>

                      {/* Problem Solving */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                          <span>{"Problem Solving"}</span>
                          <span>{selectedCandidate.capabilities.problemSolving}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${selectedCandidate.capabilities.problemSolving}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Project Quality */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                          <span>{"Project Quality"}</span>
                          <span>{selectedCandidate.capabilities.projectQuality}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${selectedCandidate.capabilities.projectQuality}%` }} />
                        </div>
                      </div>

                      {/* Consistency */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                          <span>{"Consistency"}</span>
                          <span>{selectedCandidate.capabilities.consistency}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${selectedCandidate.capabilities.consistency}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Why ZeroCV Recommended This Candidate */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block">{"Matching Intelligence"}</span>
                  <div className="bg-primary/5 border border-primary/15 p-4 rounded-xl text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-mono font-bold text-primary block mb-1 uppercase text-[10px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{"AI Matching Diagnosis"}</span>
                    </span>
                    {selectedCandidate.reasoning}
                  </div>
                </div>

                {/* 3. Verified Repository Evidence list */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block">{"Codebase & Portfolio Evidence"}</span>
                  <div className="flex flex-col gap-2 bg-neutral-900 border border-white/5 p-4 rounded-lg">
                    {selectedCandidate.evidence.map((ev, index) => (
                      <div key={index} className="flex gap-2.5 items-start text-xs text-on-surface-variant leading-relaxed">
                        <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Skills badge bar */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((s, idx) => (
                    <span key={idx} className="bg-neutral-900 border border-white/5 rounded px-2.5 py-1 text-[9px] font-mono text-white uppercase">
                      {s}
                    </span>
                  ))}
                </div>

                {/* 5. Mini Hiring Funnel */}
                <div className="flex flex-col gap-3 border-t border-white/5 pt-5">
                  <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block">{"Pipeline Funnel Status"}</span>
                  <div className="flex items-center justify-between gap-1 w-full bg-neutral-900 p-2.5 border border-white/5 rounded-lg select-none">
                    {(["Applied", "Evaluated", "Shortlisted", "Interview", "Offer", "Hired"] as Candidate["funnelStep"][]).map((step, idx, arr) => {
                      const active = selectedCandidate.funnelStep === step;
                      // Find index of current candidate step to highlight path
                      const currentStepIdx = arr.indexOf(selectedCandidate.funnelStep);
                      const processed = idx <= currentStepIdx;

                      return (
                        <React.Fragment key={step}>
                          <div
                            onClick={() => setCandidateFunnel(selectedCandidate.id, step)}
                            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                              active 
                                ? "text-primary scale-110" 
                                : processed 
                                  ? "text-secondary" 
                                  : "text-neutral-600 hover:text-neutral-400"
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                              active 
                                ? "border-primary bg-primary/10 text-primary" 
                                : processed 
                                  ? "border-secondary bg-secondary/10 text-secondary" 
                                  : "border-white/5 bg-neutral-950 text-neutral-500"
                            }`}>
                              {idx + 1}
                            </div>
                            <span className="text-[8px] font-mono mt-1 hidden sm:block">{step}</span>
                          </div>
                          {idx < arr.length - 1 && (
                            <div className={`h-[1px] flex-1 transition-colors ${
                              idx < currentStepIdx ? "bg-secondary" : "bg-white/5"
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Contextual Recruiter Actions */}
                <div className="flex flex-col gap-3 border-t border-white/5 pt-5">
                  <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block">{"Intelligent Actions"}</span>
                  
                  {/* Action triggers */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-wider">
                    <button
                      onClick={() => runRecruiterAction("questions", selectedCandidate.name)}
                      disabled={actionLoading !== null}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded border border-white/5 flex items-center gap-2 justify-center cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                      <span>{"Get Questions"}</span>
                    </button>
                    <button
                      onClick={() => runRecruiterAction("summary", selectedCandidate.name)}
                      disabled={actionLoading !== null}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded border border-white/5 flex items-center gap-2 justify-center cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-secondary" />
                      <span>{"Get Summary"}</span>
                    </button>
                    <button
                      onClick={() => runRecruiterAction("outreach", selectedCandidate.name)}
                      disabled={actionLoading !== null}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded border border-white/5 flex items-center gap-2 justify-center cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-secondary" />
                      <span>{"Draft Outreach"}</span>
                    </button>
                    <button
                      onClick={() => runRecruiterAction("schedule", selectedCandidate.name)}
                      disabled={actionLoading !== null}
                      className="p-3 bg-secondary hover:bg-secondary-container text-black font-bold rounded flex items-center gap-2 justify-center cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{"Schedule Call"}</span>
                    </button>
                  </div>

                  {/* Feedback states */}
                  <AnimatePresence mode="wait">
                    {actionLoading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-neutral-900 p-3 rounded text-neutral-400 font-mono text-[9px] flex items-center gap-2 mt-2"
                      >
                        <div className="w-3 h-3 rounded-full border border-neutral-600 border-t-white animate-spin" />
                        <span>{"ZeroCV AI engine compiling context parameters..."}</span>
                      </motion.div>
                    )}

                    {actionSuccess && actionText && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-neutral-900 border border-white/5 p-4 rounded text-xs text-on-surface-variant font-mono whitespace-pre-line leading-relaxed relative mt-2"
                      >
                        <button 
                          onClick={() => { setActionSuccess(null); setActionText(null); }}
                          className="absolute top-2.5 right-2.5 text-neutral-500 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="text-secondary font-bold block mb-2 uppercase text-[9px] tracking-wider">{"Compiled AI Response:"}</span>
                        {actionText}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 📇 FOOTER */}
      <footer className="bg-black border-t border-white/5 py-12 px-6 text-center text-[10px] text-on-surface-variant mt-auto select-none">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 items-center">
          <div className="font-mono font-bold text-sm text-white">zero<span className="text-secondary">CV</span></div>
          <p className="leading-relaxed max-w-sm">
            © 2026 zeroCV Technologies Inc. Workspace matches context nodes against requirements using vector space projection.
          </p>
        </div>
      </footer>

    </div>
  );
}
