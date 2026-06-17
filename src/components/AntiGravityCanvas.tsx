"use client";

import React, { useEffect, useState } from "react";

interface FloatingItem {
  id: number;
  label: string;
  isCapability: boolean;
  x: number; // horizontal percentage position (5 to 95)
  duration: number; // drift duration in seconds (20 to 40)
  delay: number; // negative delay to pre-populate field
  rotationStart: number;
  rotationEnd: number;
}

const rawData = [
  // Obsolete/traditional credentials
  { label: "GPA 3.9", isCapability: false },
  { label: "10+ Years Experience", isCapability: false },
  { label: "Ivy League Degree", isCapability: false },
  { label: "Perfect Keyword Match", isCapability: false },
  { label: "MBA Required", isCapability: false },
  { label: "Standardized Test Score", isCapability: false },
  { label: "CS Degree Required", isCapability: false },
  { label: "Corporate Tenure", isCapability: false },
  { label: "Generic Resume Bullet", isCapability: false },
  { label: "ATS Keyword Stuffed", isCapability: false },
  { label: "References Checked", isCapability: false },
  
  // Real capabilities
  { label: "High Learning Velocity", isCapability: true },
  { label: "System Architecture Depth", isCapability: true },
  { label: "Rapid Prototyping", isCapability: true },
  { label: "Deep Problem Solving", isCapability: true },
  { label: "Concurrent Render Optimizations", isCapability: true },
  { label: "WASM Interface Design", isCapability: true },
  { label: "Custom Shader Pipelines", isCapability: true },
  { label: "Production Codebase Scaling", isCapability: true },
  { label: "Refactoring Legacy Bottlenecks", isCapability: true },
  { label: "Autonomous Feature Execution", isCapability: true },
  { label: "Async Event Loop Optimization", isCapability: true },
];

export default function AntiGravityCanvas() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    // Generate randomized animation attributes on client to avoid hydration mismatch
    const generated = rawData.map((item, idx) => {
      const x = 5 + Math.random() * 90; 
      const duration = 20 + Math.random() * 20;
      const delay = -Math.random() * duration; 
      const rotationStart = -15 + Math.random() * 30;
      const rotationEnd = rotationStart + (-15 + Math.random() * 30);

      return {
        id: idx,
        label: item.label,
        isCapability: item.isCapability,
        x,
        duration,
        delay,
        rotationStart,
        rotationEnd,
      };
    });
    setItems(generated);
  }, []);

  return (
    <div className="relative w-full h-[400px] bg-neutral-950 overflow-hidden border-t border-white/5">
      {/* 1. Self-contained CSS Styles for compositor-level translation and clean hover scaling */}
      <style>{`
        @keyframes antiGravityDrift {
          0% {
            transform: translateY(30px) rotate(var(--rot-start));
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(-460px) rotate(var(--rot-end));
            opacity: 0;
          }
        }
        .anti-gravity-tag {
          transform: translateX(-50%) scale(1);
          transform-origin: center center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, color 0.3s, box-shadow 0.3s, background-color 0.3s;
        }
        .anti-gravity-tag-capability:hover {
          transform: translateX(-50%) scale(1.08);
          border-color: rgba(245, 158, 11, 0.4) !important;
          color: #fbbf24 !important;
          background-color: rgba(23, 23, 23, 0.85) !important;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
        }
      `}</style>

      {/* 2. Ambient Background Gradient (Deep Red Hint) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          background: "radial-gradient(circle at center, rgba(153, 27, 27, 0.05) 0%, transparent 75%)"
        }}
      />

      {/* 3. Floating Elements Container (Background - z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${item.x}%`,
              top: "100%", // align at bottom edge of container
              animation: `antiGravityDrift ${item.duration}s linear ${item.delay}s infinite`,
              ["--rot-start" as any]: `${item.rotationStart}deg`,
              ["--rot-end" as any]: `${item.rotationEnd}deg`,
            }}
          >
            <div
              className={`anti-gravity-tag select-none rounded-md px-3 py-1.5 font-mono text-[10px] tracking-tight md:text-xs ${
                item.isCapability
                  ? "anti-gravity-tag-capability text-amber-400 border border-amber-500/15 bg-neutral-900/60 shadow-sm cursor-pointer"
                  : "text-neutral-650 border border-neutral-900/40 bg-neutral-950/20 line-through opacity-35"
              }`}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Center Dark Mask (z-20) to softly fade floating tags *behind* the text */}
      <div 
        className="absolute inset-0 pointer-events-none z-20" 
        style={{
          background: "radial-gradient(circle at center, rgba(10, 10, 10, 0.45) 0%, rgba(10, 10, 10, 0) 70%)"
        }}
      />

      {/* 5. Text Overlay Center (Foreground - z-30) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-30 pointer-events-none text-center px-4">
        <h3 
          className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight mb-2"
          style={{
            textShadow: "0 4px 16px rgba(0, 0, 0, 0.95), 0 2px 4px rgba(0, 0, 0, 0.95)"
          }}
        >
          Let the noise drift away.
        </h3>
        <p 
          className="font-sans text-xs md:text-sm text-neutral-300 max-w-md leading-relaxed"
          style={{
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.95)"
          }}
        >
          ZeroCV filters out the arbitrary keyword constraints and brings raw execution capability to the surface.
        </p>
      </div>
    </div>
  );
}
