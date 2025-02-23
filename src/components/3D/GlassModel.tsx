'use client';
import React, { useRef, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls, LevaPanel } from 'leva'
import { Mesh, Group } from 'three'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

type GLTFResult = {
  nodes: {
    [key: string]: Mesh
  }
}

useGLTF.preload("/medias/torrus.glb")

export default function GlassModel() {
    const { nodes } = useGLTF("/medias/torrus.glb") as unknown as GLTFResult;
    const customModel = useGLTF("/medias/model.glb") as unknown as GLTFResult;
    const { viewport } = useThree()
    const meshRefs = useRef<Mesh[]>([]);
    
    // Add mouse movement tracking
    const mouseSpeed = useRef(0);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const baseSpeed = useRef(0.02);

    // Speed multipliers for each line
    const speedMultipliers = {
        line1: 0.8,    // 20% slower than base
        line2: 1.6,    // 60% faster than line 1
        line3: 2.4     // 140% faster than line 1
    };

    // First set of rows
    const firstText1 = useRef<Group>(null);
    const secondText1 = useRef<Group>(null);
    const firstText2 = useRef<Group>(null);
    const secondText2 = useRef<Group>(null);
    const firstText3 = useRef<Group>(null);
    const secondText3 = useRef<Group>(null);

    // Second set of rows (offset)
    const offsetText1 = useRef<Group>(null);
    const offsetText2 = useRef<Group>(null);
    const offsetText3 = useRef<Group>(null);
    const offsetText1b = useRef<Group>(null);
    const offsetText2b = useRef<Group>(null);
    const offsetText3b = useRef<Group>(null);

    let xPercent = 0;
    let direction = -1;
    let animationFrameId: number;

    // Create a store for the panel
    const [show, setShow] = React.useState(false);

    // Add model controls to the panel
    const { useCustomMesh, modelScale } = useControls(
        'Model Controls',
        {
            useCustomMesh: { value: false, label: 'Use Custom Model' },
            modelScale: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Zoom' }
        }
    );

    // Add controls to the panel
    const { verticalGap, fontSize, defaultSpeed } = useControls(
        'Text Controls',
        {
            verticalGap: { value: 0.8, min: 0.1, max: 2, step: 0.1, label: 'Vertical Gap' },
            fontSize: { value: 0.43, min: 0.2, max: 2, step: 0.01, label: 'Font Size' },
            defaultSpeed: { value: 0.02, min: 0.001, max: 0.1, step: 0.001, label: 'Default Speed' }
        }
    );

    const materialProps = useControls(
        'Material Controls',
        {
            thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
            roughness: { value: 0, min: 0, max: 1, step: 0.1 },
            transmission: { value: 1, min: 0, max: 1, step: 0.1 },
            ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
            chromaticAberration: { value: 0.02, min: 0, max: 1 },
            backside: { value: true },
            samples: { value: 3, min: 1, max: 32, step: 1 },
            resolution: { value: 256, min: 256, max: 1024, step: 128 },
            anisotropy: { value: 1, min: 0, max: 10, step: 0.1 },
            distortion: { value: 0.5, min: 0, max: 1, step: 0.1 },
            distortionScale: { value: 0.5, min: 0, max: 1, step: 0.1 },
            temporalDistortion: { value: 0.1, min: 0, max: 1, step: 0.1 }
        }
    );

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'l') setShow(s => !s);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const dx = event.clientX - lastMouseX.current;
            const dy = event.clientY - lastMouseY.current;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Update mouse speed with smooth interpolation
            mouseSpeed.current = Math.min(Math.max(distance * 0.005, defaultSpeed), 0.5);
            
            lastMouseX.current = event.clientX;
            lastMouseY.current = event.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [defaultSpeed]);

    // Track separate positions for each line
    const positions = useRef({
        line1: 0,
        line2: 0,
        line3: 0
    });

    // Add Leva panel visibility control
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .leva-c-kWgxhW { 
                opacity: ${show ? 1 : 0} !important;
                pointer-events: ${show ? 'all' : 'none'} !important;
                transition: opacity 0.2s ease;
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, [show]);

    const animate = () => {
        // Calculate base speed from mouse movement, using defaultSpeed as the minimum
        baseSpeed.current += (Math.max(mouseSpeed.current, defaultSpeed) - baseSpeed.current) * 0.1;
        
        // Update positions for each line using multipliers
        positions.current.line1 = positions.current.line1 + (baseSpeed.current * speedMultipliers.line1);
        positions.current.line2 = positions.current.line2 + (baseSpeed.current * speedMultipliers.line2);
        positions.current.line3 = positions.current.line3 + (baseSpeed.current * speedMultipliers.line3);

        // Reset positions when needed
        if(positions.current.line1 > 0) positions.current.line1 = -100;
        if(positions.current.line2 > 0) positions.current.line2 = -100;
        if(positions.current.line3 > 0) positions.current.line3 = -100;

        // Animate first set - each line with its own speed
        if (firstText1.current && secondText1.current) {
            firstText1.current.position.x = positions.current.line1 / 5;
            secondText1.current.position.x = positions.current.line1 / 5 + 20;
        }
        if (firstText2.current && secondText2.current) {
            firstText2.current.position.x = positions.current.line2 / 5;
            secondText2.current.position.x = positions.current.line2 / 5 + 20;
        }
        if (firstText3.current && secondText3.current) {
            firstText3.current.position.x = positions.current.line3 / 5;
            secondText3.current.position.x = positions.current.line3 / 5 + 20;
        }

        // Animate offset set - each line with its own speed
        if (offsetText1.current && offsetText1b.current) {
            offsetText1.current.position.x = positions.current.line1 / 5 + 10;
            offsetText1b.current.position.x = positions.current.line1 / 5 + 30;
        }
        if (offsetText2.current && offsetText2b.current) {
            offsetText2.current.position.x = positions.current.line2 / 5 + 10;
            offsetText2b.current.position.x = positions.current.line2 / 5 + 30;
        }
        if (offsetText3.current && offsetText3b.current) {
            offsetText3.current.position.x = positions.current.line3 / 5 + 10;
            offsetText3b.current.position.x = positions.current.line3 / 5 + 30;
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    useEffect(() => {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Set up initial positions
        positions.current = {
            line1: -100,
            line2: -100,
            line3: -100
        };

        // Set up initial positions for first set
        [
            [firstText1, secondText1],
            [firstText2, secondText2],
            [firstText3, secondText3]
        ].forEach(([first, second]) => {
            if (first.current && second.current) {
                first.current.position.x = 0;
                second.current.position.x = 20;
            }
        });

        // Set up initial positions for offset set
        [
            [offsetText1, offsetText1b],
            [offsetText2, offsetText2b],
            [offsetText3, offsetText3b]
        ].forEach(([first, second]) => {
            if (first.current && second.current) {
                first.current.position.x = 10;
                second.current.position.x = 30;
            }
        });

        // Start animation
        requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    useFrame(() => {
        // Animate all meshes
        meshRefs.current.forEach((mesh) => {
            if (mesh) {
                mesh.rotation.x += 0.02;
                mesh.rotation.y += 0.01;
            }
        });
    });

    return (
        <group scale={(viewport.width / 3.75) * modelScale}>
            {/* Render either the torus or custom model based on the toggle */}
            {!useCustomMesh ? (
                <mesh 
                    ref={(el) => { if (el) meshRefs.current[0] = el; }}
                    {...nodes.Torus002}
                >
                    <MeshTransmissionMaterial {...materialProps} />
                </mesh>
            ) : (
                <>
                    {Object.values(customModel.nodes).map((mesh, index) => (
                        <mesh
                            key={mesh.name}
                            ref={(el) => { if (el) meshRefs.current[index] = el; }}
                            geometry={mesh.geometry}
                            material={mesh.material}
                        />
                    ))}
                </>
            )}

            {/* First set of scrolling text */}
            <group position={[-10, verticalGap, -2]}>
                <group ref={firstText1}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
                <group ref={secondText1}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
            </group>

            <group position={[-10, 0, -2]}>
                <group ref={firstText2}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
                <group ref={secondText2}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
            </group>

            <group position={[-10, -verticalGap, -2]}>
                <group ref={firstText3}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
                <group ref={secondText3}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
            </group>

            {/* Second set of scrolling text (offset) */}
            <group position={[-10, verticalGap, -2]}>
                <group ref={offsetText1}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
                <group ref={offsetText1b}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
            </group>

            <group position={[-10, 0, -2]}>
                <group ref={offsetText2}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
                <group ref={offsetText2b}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
            </group>

            <group position={[-10, -verticalGap, -2]}>
                <group ref={offsetText3}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
                <group ref={offsetText3b}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={0.05}>
                        Transforming Ideas into Digital Excellence ✨ 
                    </Text>
                </group>
            </group>
        </group>
    )
} 