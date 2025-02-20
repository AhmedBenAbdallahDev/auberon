'use client';
import { Canvas } from '@react-three/fiber'
import Model from './Model';
import { Environment, Html } from '@react-three/drei'
import { Suspense, useState } from 'react';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <Html center>
      <div className="text-red-500 bg-black/80 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error loading 3D scene</h2>
        <p>{error.message}</p>
      </div>
    </Html>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white bg-black/80 p-4 rounded-lg">
        <p>Loading 3D scene...</p>
      </div>
    </Html>
  );
}

export default function Scene() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    console.error('3D Scene Error:', error);
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20">
        <div className="text-red-500 bg-black/80 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Failed to load 3D scene</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas 
      style={{width: '100%', height: '100%', position: 'absolute', background: 'transparent'}}
      onError={(e) => {
        console.error('Canvas Error:', e);
        setError(e);
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Model />
        <directionalLight intensity={2} position={[0, 2, 3]}/>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
} 