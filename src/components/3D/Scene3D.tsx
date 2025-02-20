'use client';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import dynamic from 'next/dynamic';

const GlassModel = dynamic(() => import('./GlassModel'), {
    ssr: false
});

export default function Scene3D() {
    return (
        <Canvas style={{background: 'transparent'}}>
            <GlassModel />
            <directionalLight intensity={2} position={[0, 2, 3]}/>
            <Environment preset="city" />
        </Canvas>
    );
} 