'use client';
import React, { useRef, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Mesh, Group } from 'three'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    let direction = -1;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to(slider.current?.position || {}, {
            scrollTrigger: {
                trigger: document.documentElement,
                scrub: 0.5,
                start: 0,
                end: window.innerHeight,
                onUpdate: e => direction = e.direction * -1
            },
            x: "-500px",
        });

        requestAnimationFrame(animate);
    }, []);

    const animate = () => {
        if (xPercent < -100) {
            xPercent = 0;
        }
        else if (xPercent > 0) {
            xPercent = -100;
        }

        if (firstText.current && secondText.current) {
            gsap.set(firstText.current.position, { x: xPercent * 0.2 });
            gsap.set(secondText.current.position, { x: xPercent * 0.2 });
        }

        requestAnimationFrame(animate);
        xPercent += 0.5 * direction;
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
        <>
            {/* Text Layer */}
            <group position={[0, -2, 0]}>
                <group ref={slider} position={[0, 0, 0]}>
                    <group ref={firstText} position={[-viewport.width/2, 0, 0]}>
                        <Text 
                            font={'/fonts/PPNeueMontreal-Bold.otf'} 
                            fontSize={1} 
                            color="white" 
                            anchorX="left" 
                            anchorY="middle"
                            letterSpacing={-0.05}
                        >
                            Transforming Ideas into Digital Excellence •
                        </Text>
                    </group>
                    <group ref={secondText} position={[viewport.width/2, 0, 0]}>
                        <Text 
                            font={'/fonts/PPNeueMontreal-Bold.otf'} 
                            fontSize={1} 
                            color="white" 
                            anchorX="left" 
                            anchorY="middle"
                            letterSpacing={-0.05}
                        >
                            Transforming Ideas into Digital Excellence •
                        </Text>
                    </group>
                </group>
            </group>

            {/* 3D Model Layer */}
            <group scale={viewport.width / 3.75}>
                <mesh ref={torus} {...nodes.Torus002}>
                    <MeshTransmissionMaterial {...materialProps}/>
                </mesh>
            </group>
        </>
    )
} 