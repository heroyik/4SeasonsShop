"use client";

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import SeasonalModel from './SeasonalModel';

export default function Scene({ season }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 10], fov: 45 }}
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0, // Behind UI
        pointerEvents: 'auto', // Allow interaction
      }}
    >
      {/* Lighting */}
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Environment preset="city" />

      {/* Main Object */}
      <SeasonalModel season={season} />

      {/* Ground Shadow */}
      <ContactShadows 
         position={[0, -2.5, 0]} 
         opacity={0.4} 
         scale={10} 
         blur={2.5} 
         far={4} 
      />

      {/* Controls */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
        // Rotate automatically slowly
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
