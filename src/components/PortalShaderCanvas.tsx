"use client";

import React, { useEffect, useRef } from "react";

interface PortalShaderCanvasProps {
  className?: string;
  opacity?: number;
  calm?: boolean;
  buildup?: number;
  collapse?: number;
  growth?: number;
}

export default function PortalShaderCanvas({
  className = "",
  opacity = 1,
  calm = false,
  buildup = 0,
  collapse = 0,
  growth = 1
}: PortalShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const calmRef = useRef(calm);
  const buildupRef = useRef(buildup);
  const collapseRef = useRef(collapse);
  const growthRef = useRef(growth);

  useEffect(() => {
    calmRef.current = calm;
  }, [calm]);

  useEffect(() => {
    buildupRef.current = buildup;
  }, [buildup]);

  useEffect(() => {
    collapseRef.current = collapse;
  }, [collapse]);

  useEffect(() => {
    growthRef.current = growth;
  }, [growth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_calm;
      uniform float u_buildup;
      uniform float u_collapse;
      uniform float u_growth;
      varying vec2 v_texCoord;
      
      // 2D Hash function
      float hash21(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      
      // Smooth 2D noise
      float noise2D(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(mix(hash21(i + vec2(0.0, 0.0)), 
                         hash21(i + vec2(1.0, 0.0)), u.x),
                     mix(hash21(i + vec2(0.0, 1.0)), 
                         hash21(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      
      // 4-Octave Fractional Brownian Motion
      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          for (int i = 0; i < 4; i++) {
              value += amplitude * noise2D(p * frequency);
              frequency *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }
      
      void main() {
          vec2 uv = v_texCoord;
          vec2 p = uv - 0.5;
          p.x *= u_resolution.x / u_resolution.y;
          
          float dist = length(p);
          float angle = atan(p.y, p.x);
          
          vec3 finalColor = vec3(0.0);
          
          if (u_calm > 0.5) {
              // 🌌 CALM PREMIUM GALAXY MODE (Hero background - extremely subtle)
              float speed = 0.012;
              float eventHorizon = 0.055;
              float blackHoleMask = smoothstep(eventHorizon - 0.002, eventHorizon + 0.004, dist);
              
              // 1. Einstein Gravitational Lensing Halo (very thin, soft glow)
              float lensingRing = 0.0006 / (abs(dist - (eventHorizon + 0.004)) + 0.001);
              lensingRing = clamp(lensingRing, 0.0, 1.2);
              vec3 ringColor = vec3(0.85, 0.65, 0.35) * lensingRing; // Champagne gold ring
              
              // 2. Majestic Spiral Gaseous Accretion Disk
              float spiralFactor = 2.0;
              vec2 spiralCoord = vec2(dist * 4.5 - angle * spiralFactor - u_time * speed, angle * 1.2 + dist * 1.5);
              float gas = fbm(spiralCoord + vec2(0.0, u_time * speed * 0.15));
              
              // Soft warm palette
              vec3 gasColor = mix(vec3(0.4, 0.03, 0.02), vec3(0.7, 0.45, 0.22), gas);
              float diskFalloff = exp(-dist * 3.0);
              vec3 diskLight = gasColor * gas * diskFalloff * 0.7;
              
              // Relativistic Dust Lanes
              float dustPattern = fbm(p * 10.0 + vec2(0.0, u_time * speed * 0.3));
              diskLight *= (1.0 - 0.35 * dustPattern);
              
              finalColor = (ringColor * 0.4 + diskLight) * blackHoleMask;
              finalColor += vec3(0.001, 0.0005, 0.0008); // Ambient dark obsidian fill
          } else {
              // 🌌 CINEMATIC GALAXY SINGULARITY MODE (Loader - blue/purple accretion + energy buildup surge + collapse)
              float speed = 0.032;
              
              // Coordinate pinch-collapse based on u_collapse uniform
              // As u_collapse goes from 0.0 to 1.0, coordinate scale increases to infinity, shrinking the portal to a point.
              vec2 pColl = p * (1.0 + u_collapse * 25.0);
              float distColl = length(pColl);
              float angleColl = atan(pColl.y, pColl.x);
              
              float eventHorizon = 0.08 * u_growth * (1.0 - u_collapse);
              float currentEH = eventHorizon + u_buildup * 0.022;
              
              float blackHoleMask = smoothstep(currentEH - 0.002, currentEH + 0.004, distColl);
              
              // 1. Einstein Gravitational Lensing Halo (Relativistic bending ring that surges during buildup and collapses)
              float lensingRing = (0.0012 + u_buildup * 0.002 + u_collapse * 0.01) * u_growth / (abs(distColl - (currentEH + 0.006 * u_growth)) + 0.001);
              lensingRing = clamp(lensingRing, 0.0, 1.8 + u_buildup * 1.5 + u_collapse * 8.0);
              // Lensing ring in a beautiful deep blue/purple mix
              vec3 ringColor = mix(vec3(0.08, 0.35, 0.95), vec3(0.55, 0.12, 0.85), distColl * 2.0) * lensingRing;
              
              // 2. Majestic Spiral Gaseous Accretion Disk
              float spiralFactor = 2.8;
              vec2 spiralCoord = vec2(distColl * 6.0 - angleColl * spiralFactor - u_time * speed, angleColl * 1.6 + distColl * 1.8);
              float gas = fbm(spiralCoord);
              
              // Gaseous disk blending: Soft blue-cyan core transitioning to cosmic Indigo/Purple in outer space (exactly like storyboard)
              vec3 innerGasColor = mix(vec3(0.12, 0.38, 0.75), vec3(0.52, 0.78, 1.0), gas);
              vec3 outerGasColor = mix(vec3(0.02, 0.01, 0.08), vec3(0.16, 0.05, 0.36), gas);
              float blendFactor = smoothstep(0.12, 0.38, distColl);
              vec3 gasColor = mix(innerGasColor, outerGasColor, blendFactor);
              
              float diskFalloff = exp(-distColl * (3.5 - u_buildup * 0.8) / max(u_growth, 0.001));
              vec3 diskLight = gasColor * gas * diskFalloff * (1.3 + u_buildup * 0.8) * (1.0 - u_collapse) * u_growth;
              
              // Relativistic Dust Lanes
              float dustPattern = fbm(pColl * 14.0 - vec2(u_time * speed * 0.3));
              diskLight *= (1.0 - 0.5 * dustPattern);
              
              // 3. Faint background starfield elements
              float starNoise = hash21(floor(uv * 300.0));
              float stars = step(0.9992, starNoise) * (0.3 + 0.7 * sin(u_time * 0.4 + starNoise * 10.0)) * (1.0 - u_collapse) * u_growth;
              
              // 4. White-hot central energy core glow that surges during buildup and collapses to zero
              float coreGlow = (0.0006 + u_buildup * 0.002) / (distColl + 0.002);
              coreGlow = clamp(coreGlow, 0.0, 1.5 + u_buildup * 2.0);
              vec3 coreColor = vec3(0.85, 0.92, 1.0) * coreGlow * (1.0 - u_collapse) * u_growth;
              
              finalColor = (ringColor * 0.7 + diskLight) * blackHoleMask;
              finalColor += coreColor; // overlay white-hot core
              finalColor += vec3(stars) * (1.0 - distColl * 1.5) * 0.4;
          }
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uCalm = gl.getUniformLocation(program, "u_calm");
    const uBuildup = gl.getUniformLocation(program, "u_buildup");
    const uCollapse = gl.getUniformLocation(program, "u_collapse");
    const uGrowth = gl.getUniformLocation(program, "u_growth");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = (time: number) => {
      // Canvas size is handled asynchronously by ResizeObserver to prevent layout thrashing.
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime !== null) gl.uniform1f(uTime, time * 0.001);
      if (uResolution !== null) gl.uniform2f(uResolution, canvas.width, canvas.height);
      if (uMouse !== null) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uCalm !== null) gl.uniform1f(uCalm, calmRef.current ? 1.0 : 0.0);
      if (uBuildup !== null) gl.uniform1f(uBuildup, buildupRef.current);
      if (uCollapse !== null) gl.uniform1f(uCollapse, collapseRef.current);
      if (uGrowth !== null) gl.uniform1f(uGrowth, growthRef.current !== undefined ? growthRef.current : 1.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full bg-black transition-opacity duration-1000 ${className}`}
      style={{ opacity }}
    />
  );
}
