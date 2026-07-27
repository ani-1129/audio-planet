"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Cylinder } from "@react-three/drei";

export function ProductViewer({ category }: { category: string }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} castShadow />
        <pointLight position={[-2, -2, -2]} intensity={0.5} color="#00F0FF" />
        
        {category === "Audio" && (
          <Box args={[1.5, 2.5, 1.2]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color="#111" roughness={0.8} />
          </Box>
        )}
        
        {category === "Lighting" && (
          <group position={[0, -0.5, 0]}>
            <Cylinder args={[0.5, 0.5, 1, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#222" metalness={0.5} roughness={0.3} />
            </Cylinder>
            <Box args={[0.6, 0.2, 0.6]} position={[0, -0.6, 0]}>
              <meshStandardMaterial color="#111" />
            </Box>
          </group>
        )}
        
        {category === "Trussing" && (
          <Cylinder args={[0.2, 0.2, 3, 6]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#888" metalness={0.7} roughness={0.2} />
          </Cylinder>
        )}

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}
