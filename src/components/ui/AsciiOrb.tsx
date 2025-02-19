"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ASCII_CHARS = ".:-=+*#%@";

const AsciiOrb = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!containerRef.current || !preRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    const toAscii = (pixels: ImageData) => {
      let ascii = "";
      for (let i = 0; i < pixels.height; i += 2) {
        for (let j = 0; j < pixels.width; j++) {
          const idx = (i * pixels.width + j) * 4;
          const brightness =
            (pixels.data[idx] + pixels.data[idx + 1] + pixels.data[idx + 2]) /
            3;
          const char =
            ASCII_CHARS[
              Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))
            ];
          ascii += char || " ";
        }
        ascii += "\\n";
      }
      return ascii;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);

      const context = document.createElement("canvas").getContext("2d");
      if (context) {
        context.canvas.width = window.innerWidth / 4;
        context.canvas.height = window.innerHeight / 4;
        context.drawImage(
          renderer.domElement,
          0,
          0,
          context.canvas.width,
          context.canvas.height
        );
        const pixels = context.getImageData(
          0,
          0,
          context.canvas.width,
          context.canvas.height
        );
        preRef.current!.textContent = toAscii(pixels);
      }
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={containerRef} className="absolute opacity-0" />
      <pre
        ref={preRef}
        className="absolute top-0 left-0 w-full h-full text-[4px] leading-[4px] text-white font-mono whitespace-pre opacity-50"
      />
    </div>
  );
};

export default AsciiOrb;
