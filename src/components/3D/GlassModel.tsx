'use client';
import React, { useRef } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Mesh, Object3D, Group } from 'three'

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
    const textGroup1 = useRef<Group>(null);
    const textGroup2 = useRef<Group>(null);
    const textGroup3 = useRef<Group>(null);
    
    useFrame((state) => {
        if (torus.current) {
            torus.current.rotation.x += 0.02
        }

        const speed = 0.5;
        const width = 15; // Reduced width for tighter spacing
        
        // Calculate positions with offset to start mid-loop
        const time = state.clock.getElapsedTime() * speed;
        const offset = width / 2; // Start from middle
        
        if (textGroup1.current) {
            textGroup1.current.position.x = -((time + offset) % width);
        }
        if (textGroup2.current) {
            textGroup2.current.position.x = ((time + offset) % width);
        }
        if (textGroup3.current) {
            textGroup3.current.position.x = -((time + offset) % width);
        }
    })

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1},
        backside: { value: true},
    }, { hidden: true })

    const textContent = "Transforming Ideas into Digital Excellence • ".repeat(2);
    
    return (
        <group scale={viewport.width / 3.75}>
            <group position={[0, 0.6, -1]}>
                <group ref={textGroup1}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle" position={[15, 0, 0]}>
                        {textContent}
                    </Text>
                </group>
            </group>
            <group position={[0, 0, -1]}>
                <group ref={textGroup2}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle" position={[15, 0, 0]}>
                        {textContent}
                    </Text>
                </group>
            </group>
            <group position={[0, -0.6, -1]}>
                <group ref={textGroup3}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle" position={[15, 0, 0]}>
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