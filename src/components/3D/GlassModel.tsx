'use client';
import React, { useRef, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Mesh, Group } from 'three'
import gsap from 'gsap';

type GLTFResult = {
  nodes: {
    Torus002: Mesh
  }
}

useGLTF.preload("/medias/torrus.glb")

export default function GlassModel() {
    const { nodes } = useGLTF("/medias/torrus.glb") as unknown as GLTFResult;
    const { viewport } = useThree()
    const torus = useRef<Mesh>(null);
    const slider = useRef<Group>(null);
    const firstText = useRef<Group>(null);
    const secondText = useRef<Group>(null);

    let xPercent = 0;

    useEffect(() => {
        // Initial setup - position second text at the width of first text
        if (firstText.current && secondText.current) {
            const width = 25; // Width of text + spacing
            secondText.current.position.x = width;
        }
        requestAnimationFrame(animate);
    }, []);

    const animate = () => {
        if (xPercent <= -100) {
            xPercent = 0;
        }
        else if (xPercent > 0) {
            xPercent = -100;
        }
        
        if (firstText.current && secondText.current) {
            const width = 25; // Width of text + spacing
            firstText.current.position.x = (xPercent * width) / 100;
            secondText.current.position.x = (xPercent * width) / 100 + width;
        }
        
        requestAnimationFrame(animate);
        xPercent += 0.75; // Slightly faster for smoother appearance
    }

    useFrame(() => {
        if (torus.current) {
            torus.current.rotation.x += 0.02;
        }
    });

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1},
        backside: { value: true},
    }, { hidden: true })

    return (
        <group scale={viewport.width / 3.75}>
            {/* Scrolling Text */}
            <group position={[0, 0, -2]} ref={slider}>
                <group ref={firstText}>
                    <Text 
                        font={'/fonts/PPNeueMontreal-Bold.otf'} 
                        fontSize={0.8}
                        color="white"
                        anchorX="left"
                        anchorY="middle"
                    >
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText}>
                    <Text 
                        font={'/fonts/PPNeueMontreal-Bold.otf'} 
                        fontSize={0.8}
                        color="white"
                        anchorX="left"
                        anchorY="middle"
                    >
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
            </group>

            {/* 3D Model */}
            <mesh ref={torus} {...nodes.Torus002}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    )
} 