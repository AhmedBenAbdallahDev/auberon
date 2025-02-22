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
    
    // Row 1
    const firstText1 = useRef<Group>(null);
    const secondText1 = useRef<Group>(null);
    // Row 2
    const firstText2 = useRef<Group>(null);
    const secondText2 = useRef<Group>(null);
    // Row 3
    const firstText3 = useRef<Group>(null);
    const secondText3 = useRef<Group>(null);

    let xPercent = 0;

    useEffect(() => {
        // Initial setup - position second texts
        const width = 25;
        if (secondText1.current) secondText1.current.position.x = width;
        if (secondText2.current) secondText2.current.position.x = width;
        if (secondText3.current) secondText3.current.position.x = width;
        requestAnimationFrame(animate);
    }, []);

    const animate = () => {
        if (xPercent <= -100) {
            xPercent = 0;
        }
        else if (xPercent > 0) {
            xPercent = -100;
        }
        
        const width = 25;
        // Row 1 - Left to Right
        if (firstText1.current && secondText1.current) {
            firstText1.current.position.x = (xPercent * width) / 100;
            secondText1.current.position.x = (xPercent * width) / 100 + width;
        }
        // Row 2 - Right to Left
        if (firstText2.current && secondText2.current) {
            firstText2.current.position.x = (-xPercent * width) / 100;
            secondText2.current.position.x = (-xPercent * width) / 100 + width;
        }
        // Row 3 - Left to Right
        if (firstText3.current && secondText3.current) {
            firstText3.current.position.x = (xPercent * width) / 100;
            secondText3.current.position.x = (xPercent * width) / 100 + width;
        }
        
        requestAnimationFrame(animate);
        xPercent += 0.08; // Much slower speed
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
            {/* Scrolling Text - Three Rows */}
            <group position={[0, 1, -2]}>
                <group ref={firstText1}>
                    <Text fontSize={0.8} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText1}>
                    <Text fontSize={0.8} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
            </group>

            <group position={[0, 0, -2]}>
                <group ref={firstText2}>
                    <Text fontSize={0.8} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText2}>
                    <Text fontSize={0.8} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
            </group>

            <group position={[0, -1, -2]}>
                <group ref={firstText3}>
                    <Text fontSize={0.8} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText3}>
                    <Text fontSize={0.8} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'}>
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