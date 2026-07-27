"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Box, Cylinder } from "@react-three/drei";
import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { HeroPlaceholder } from "./HeroPlaceholder";

// ─── WebGL context-loss recovery hook ───────────────────────────
function ContextGuard({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleLost = (e: Event) => {
      e.preventDefault();            // allows the browser to try restoring
      console.warn("WebGL context lost – falling back to CSS hero.");
      onContextLost();
    };

    const handleRestored = () => {
      console.info("WebGL context restored.");
    };

    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    };
  }, [gl, onContextLost]);

  return null;
}

// ─── Scene child components ─────────────────────────────────────
function SpeakerMesh({ position }: { position: [number, number, number] }) {
  return (
    <Box args={[1.5, 2.5, 1.2]} position={position} castShadow receiveShadow>
      <meshStandardMaterial color="#111111" roughness={0.9} />
      <Box args={[1.2, 1.2, 0.1]} position={[0, 0.4, 0.61]}>
        <meshStandardMaterial color="#222" />
      </Box>
      <Box args={[1.2, 0.6, 0.1]} position={[0, -0.7, 0.61]}>
        <meshStandardMaterial color="#222" />
      </Box>
    </Box>
  );
}

function Truss({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <Cylinder
      args={[0.2, 0.2, 10, 8]}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
    </Cylinder>
  );
}

function MovingLight({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  useFrame((state) => {
    if (lightRef.current && targetRef.current) {
      const time = state.clock.getElapsedTime();
      targetRef.current.position.x = Math.sin(time * speed) * 5;
      targetRef.current.position.z = Math.cos(time * speed) * 5;
      lightRef.current.target = targetRef.current;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <primitive object={targetRef.current} position={[0, -5, 0]} />
      <spotLight
        ref={lightRef}
        color={color}
        intensity={300}
        angle={0.5}
        penumbra={1}
        position={[0, -0.3, 0]}
        castShadow
      />
    </group>
  );
}

// ─── Stage scene (all 3-D objects) ──────────────────────────────
function StageScene({ onContextLost }: { onContextLost: () => void }) {
  return (
    <>
      <ContextGuard onContextLost={onContextLost} />

      <color attach="background" args={["#0B132B"]} />
      <fog attach="fog" args={["#0B132B", 10, 35]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />

      <group position={[0, -2, 0]}>
        {/* Stage floor */}
        <Box args={[20, 0.5, 10]} receiveShadow>
          <meshStandardMaterial color="#1C2541" roughness={0.8} />
        </Box>

        {/* Speakers */}
        <SpeakerMesh position={[-4, 1.5, 0]} />
        <SpeakerMesh position={[4, 1.5, 0]} />
        <SpeakerMesh position={[-4, 4.05, 0]} />
        <SpeakerMesh position={[4, 4.05, 0]} />

        {/* Overhead Truss */}
        <Truss position={[0, 8, 0]} rotation={[0, 0, Math.PI / 2]} />
        <Truss position={[-4, 4, 0]} rotation={[0, 0, 0]} />
        <Truss position={[4, 4, 0]} rotation={[0, 0, 0]} />

        {/* Moving Lights */}
        <MovingLight position={[-3, 7.5, 0]} color="#00F0FF" speed={1.2} />
        <MovingLight position={[3, 7.5, 0]} color="#00F0FF" speed={0.8} />
        <MovingLight position={[0, 7.5, 0]} color="#ffffff" speed={1.5} />
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minPolarAngle={Math.PI / 3}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
      <Environment preset="night" />
    </>
  );
}

// ─── Public component ───────────────────────────────────────────
export default function HeroScene() {
  const [webglOk, setWebglOk] = useState(true);

  // Detect up-front whether the browser even supports WebGL
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("webgl2") || c.getContext("webgl");
      if (!ctx) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  const handleContextLost = useCallback(() => {
    setWebglOk(false);
  }, []);

  // Fallback: beautiful CSS-only hero
  if (!webglOk) {
    return <HeroPlaceholder />;
  }

  return (
    <div
      className="relative w-full min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden"
      style={{ backgroundColor: "#0B132B" }}
    >
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 5, 18], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            // Prevent the browser from marking the context as "permanently lost"
            gl.domElement.addEventListener("webglcontextlost", (e) =>
              e.preventDefault()
            );
          }}
        >
          <StageScene onContextLost={handleContextLost} />
        </Canvas>
      </div>

      {/* HTML Overlay for Hero Text */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pointer-events-none pb-12">
        <div className="inline-flex items-center space-x-2 bg-[#1C2541]/70 border border-[#1C2541] rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
          <span className="text-xs font-medium text-gray-200 uppercase tracking-wider">
            Delhi NCR&apos;s Premier Rental
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-2xl text-white">
          Elevate Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-white text-glow">
            Event Experience
          </span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300 drop-shadow-md max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          Full-system sound, dynamic lighting &amp; robust trussing rentals.{" "}
          <br className="hidden md:block" />
          We deliver, setup, and support. You focus on the show.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center pointer-events-auto">
          <a
            href="/catalog"
            className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-[#0B132B] bg-[#00F0FF] rounded-lg hover:bg-white hover:scale-105 transition-all duration-200 box-glow"
          >
            Browse Equipment
          </a>
          <a
            href="/quote"
            className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-[#1C2541]/80 border-2 border-[#1C2541] rounded-lg hover:border-[#00F0FF] hover:bg-[#1C2541] transition-all duration-200 backdrop-blur-md"
          >
            Get a Quote / Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
