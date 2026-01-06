"use client";

import { useGLTF, Float, Html } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url, scale = 1, ...props }) {
  const { scene } = useGLTF(url);
  
  return (
    <Float 
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
    >
      <primitive 
        object={scene} 
        scale={scale} 
        {...props} 
      />
    </Float>
  );
}

// Preload all seasonal models
useGLTF.preload('/spring.glb');
useGLTF.preload('/summer.glb');
useGLTF.preload('/autumn.glb');
useGLTF.preload('/winter.glb');

export default function SeasonalModel({ season }) {
  // Map season name to file
  const modelFiles = {
    spring: '/spring.glb',
    summer: '/summer.glb',
    autumn: '/autumn.glb',
    winter: '/winter.glb',
  };

  const url = modelFiles[season.toLowerCase()] || '/spring.glb';

  return (
    <Suspense fallback={<Html center>Loading...</Html>}>
      <Model url={url} scale={2.5} position={[0, -2, 0]} />
    </Suspense>
  );
}
