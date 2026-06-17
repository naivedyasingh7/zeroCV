"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeDnaCanvasProps {
  className?: string;
  opacity?: number;
}

export default function ThreeDnaCanvas({ className = "", opacity = 1 }: ThreeDnaCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Center Node (Capability DNA Core) - Restored to primary Red (0xe41613)
    const centralGeometry = new THREE.SphereGeometry(1.2, 64, 64);
    const centralMaterial = new THREE.MeshPhongMaterial({
      color: 0xe41613,
      emissive: 0x5e0002,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    });
    const centralNode = new THREE.Mesh(centralGeometry, centralMaterial);
    scene.add(centralNode);

    // Satellite Nodes (Skills, Projects, etc.) - Restored to accent Gold (0xc5a880)
    const nodes: THREE.Mesh[] = [];
    const lines: { line: THREE.Line; target: THREE.Mesh }[] = [];

    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0xc5a880,
      emissive: 0x5a4d3b,
      shininess: 80,
    });

    // Connection lines - Red (0xe41613)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xe41613,
      transparent: true,
      opacity: 0.35,
    });

    for (let i = 0; i < 5; i++) {
      const geo = new THREE.SphereGeometry(0.3, 32, 32);
      const node = new THREE.Mesh(geo, nodeMaterial);

      const angle = (i / 5) * Math.PI * 2;
      const radius = 4;
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      scene.add(node);
      nodes.push(node);

      // Connection line from center (0,0,0) to node position
      const points = [new THREE.Vector3(0, 0, 0), node.position.clone()];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMaterial);
      scene.add(line);
      lines.push({ line, target: node });
    }

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 8;

    // Animation Loop
    const animate = () => {
      const time = Date.now() * 0.001;

      centralNode.rotation.y += 0.005;
      centralNode.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

      nodes.forEach((node, i) => {
        const angle = (i / 5) * Math.PI * 2 + time * 0.2;
        node.position.x = Math.cos(angle) * 3.8;
        node.position.y = Math.sin(angle) * 3.8;
        node.position.z = Math.sin(time + i) * 1.2;

        // Update line geometries
        const line = lines[i].line;
        const positions = line.geometry.attributes.position.array as Float32Array;
        
        // Target point is the satellite position
        positions[3] = node.position.x;
        positions[4] = node.position.y;
        positions[5] = node.position.z;
        line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Clean up geometries and materials
      centralGeometry.dispose();
      centralMaterial.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      
      nodes.forEach(node => node.geometry.dispose());
      lines.forEach(item => {
        item.line.geometry.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-transparent overflow-hidden ${className}`}
      style={{ opacity }}
    />
  );
}
