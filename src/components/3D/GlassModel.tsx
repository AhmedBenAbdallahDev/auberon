'use client';
import React, { useRef, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Mesh, Object3D, Group } from 'three'
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
    const row1 = useRef<Group>(null);
    const row2 = useRef<Group>(null);
    const row3 = useRef<Group>(null);
    const slider1 = useRef<Group>(null);
    const slider2 = useRef<Group>(null);
    const slider3 = useRef<Group>(null);
    
    useEffect(() => {
        if (slider1.current && slider2.current && slider3.current) {
            // Infinite scroll animation for each row
            gsap.to(slider1.current.position, {
                x: -30,
                duration: 20,
                repeat: -1,
                ease: "none",
            });
            
            gsap.to(slider2.current.position, {
                x: 30,
                duration: 20,
                repeat: -1,
                ease: "none",
            });
            
            gsap.to(slider3.current.position, {
                x: -30,
                duration: 20,
                repeat: -1,
                ease: "none",
            });
        }
    }, []);

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

    const textContent = "Transforming Ideas into Digital Excellence • ".repeat(3);
    
    return (
        <group scale={viewport.width / 3.75}>
            <group position={[0, 0.6, -1]} ref={row1}>
                <group ref={slider1} position={[0, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle" position={[30, 0, 0]}>
                        {textContent}
                    </Text>
                </group>
            </group>
            <group position={[0, 0, -1]} ref={row2}>
                <group ref={slider2} position={[0, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle" position={[30, 0, 0]}>
                        {textContent}
                    </Text>
                </group>
            </group>
            <group position={[0, -0.6, -1]} ref={row3}>
                <group ref={slider3} position={[0, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle" position={[30, 0, 0]}>
                        {textContent}
                    </Text>
                </group>
            </group>
            <mesh ref={torus} {...nodes.Torus002}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    )
} 