import { Spotlight } from "./ui/Spotlight";
import HeroContent from "./ui/HeroContent";
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

const GlassModel = dynamic(() => import('./3D/GlassModel'), {
    ssr: false
});

export default function Hero() {
    return (
        <div className="flex flex-col h-screen w-full relative items-center justify-center bg-black bg-grid-white/[0.1]">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="orange"
            />
            <Spotlight
                className="-top-40 left-20 md:left-80 md:-top-20"
                fill="blue"
            />
            <HeroContent />
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <GlassModel />
                    <directionalLight intensity={2} position={[0, 2, 3]}/>
                    <Environment preset="city" />
                </Canvas>
            </div>
        </div>
    );
}