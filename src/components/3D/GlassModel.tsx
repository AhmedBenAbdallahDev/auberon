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
    
    // Text animation refs
    const firstText1 = useRef<Group>(null);
    const secondText1 = useRef<Group>(null);
    const firstText2 = useRef<Group>(null);
    const secondText2 = useRef<Group>(null);
    const firstText3 = useRef<Group>(null);
    const secondText3 = useRef<Group>(null);

    let xPercent = 0;
    let direction = -1;

    const animate = () => {
        if (xPercent <= -100) {
            xPercent = 0;
        }
        if (xPercent > 0) {
            xPercent = -100;
        }
        
        if (firstText1.current && secondText1.current) {
            gsap.set(firstText1.current.position, { x: xPercent * 0.3 });
            gsap.set(secondText1.current.position, { x: xPercent * 0.3 });
        }
        if (firstText2.current && secondText2.current) {
            gsap.set(firstText2.current.position, { x: -xPercent * 0.3 });
            gsap.set(secondText2.current.position, { x: -xPercent * 0.3 });
        }
        if (firstText3.current && secondText3.current) {
            gsap.set(firstText3.current.position, { x: xPercent * 0.3 });
            gsap.set(secondText3.current.position, { x: xPercent * 0.3 });
        }
        
        requestAnimationFrame(animate);
        xPercent += 0.1 * direction;
    }

    useEffect(() => {
        requestAnimationFrame(animate);
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

    const textContent = "Transforming Ideas into Digital Excellence • ";
    
    return (
        <group scale={viewport.width / 3.75}>
            {/* Row 1 */}
            <group position={[0, 0.6, -1]}>
                <group ref={firstText1}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
                <group ref={secondText1} position={[15, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
            </group>

            {/* Row 2 */}
            <group position={[0, 0, -1]}>
                <group ref={firstText2}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
                <group ref={secondText2} position={[15, 0, 0]}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
            </group>

            {/* Row 3 */}
            <group position={[0, -0.6, -1]}>
                <group ref={firstText3}>
                    <Text font={'/fonts/PPNeueMontreal-Bold.otf'} fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {textContent}
                    </Text>
                </group>
                <group ref={secondText3} position={[15, 0, 0]}>
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