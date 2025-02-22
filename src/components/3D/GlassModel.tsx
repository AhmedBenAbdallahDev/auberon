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
    
    // Text refs
    const slider1 = useRef<Group>(null);
    const firstText1 = useRef<Group>(null);
    const secondText1 = useRef<Group>(null);
    
    const slider2 = useRef<Group>(null);
    const firstText2 = useRef<Group>(null);
    const secondText2 = useRef<Group>(null);
    
    const slider3 = useRef<Group>(null);
    const firstText3 = useRef<Group>(null);
    const secondText3 = useRef<Group>(null);

    let xPercent = 0;
    let direction = -1;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Set up scroll trigger for each row
        [slider1, slider2, slider3].forEach((slider, i) => {
            if (slider.current) {
                gsap.to(slider.current.position, {
                    scrollTrigger: {
                        trigger: document.documentElement,
                        scrub: 0.5,
                        start: 0,
                        end: window.innerHeight,
                        onUpdate: e => direction = e.direction * -1 * (i % 2 ? -1 : 1)
                    },
                    x: i % 2 ? "500px" : "-500px",
                });
            }
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

        // Update each row's text positions
        [
            [firstText1, secondText1],
            [firstText2, secondText2],
            [firstText3, secondText3]
        ].forEach(([first, second], i) => {
            if (first.current && second.current) {
                const dir = i % 2 ? -1 : 1;
                gsap.set(first.current.position, { x: xPercent * dir });
                gsap.set(second.current.position, { x: xPercent * dir });
            }
        });

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

    const textContent = "Transforming Ideas into Digital Excellence • ";
    
    return (
        <group scale={viewport.width / 3.75}>
            {/* Row 1 */}
            <group position={[0, 0.6, -1]} ref={slider1}>
                <group ref={firstText1}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
                <group ref={secondText1} position={[20, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
            </group>

            {/* Row 2 */}
            <group position={[0, 0, -1]} ref={slider2}>
                <group ref={firstText2}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
                <group ref={secondText2} position={[20, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
            </group>

            {/* Row 3 */}
            <group position={[0, -0.6, -1]} ref={slider3}>
                <group ref={firstText3}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
                <group ref={secondText3} position={[20, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
            </group>

            {/* 3D Model */}
            {nodes?.Torus002 && (
                <mesh ref={torus} {...nodes.Torus002}>
                    <MeshTransmissionMaterial {...materialProps}/>
                </mesh>
            )}
        </group>
    )
} 