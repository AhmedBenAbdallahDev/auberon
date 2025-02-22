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
            gsap.set(firstText.current.position, { x: xPercent });
            gsap.set(secondText.current.position, { x: xPercent });
        }

        requestAnimationFrame(animate);
        xPercent += 0.1 * direction;
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
            <group position={[0, 0, -1]} ref={slider}>
                <group ref={firstText}>
                    <Text 
                        font={'/fonts/PPNeueMontreal-Bold.otf'} 
                        fontSize={0.6} 
                        color="white" 
                        anchorX="left" 
                        anchorY="middle"
                        letterSpacing={-0.05}
                        maxWidth={20}
                    >
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText} position={[20, 0, 0]}>
                    <Text 
                        font={'/fonts/PPNeueMontreal-Bold.otf'} 
                        fontSize={0.6} 
                        color="white" 
                        anchorX="left" 
                        anchorY="middle"
                        letterSpacing={-0.05}
                        maxWidth={20}
                    >
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
            </group>

            <mesh ref={torus} {...nodes.Torus002}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    )
} 