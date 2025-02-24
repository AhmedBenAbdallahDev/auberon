'use client';
import React, { useRef, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text, OrbitControls } from "@react-three/drei";
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
    const sonicModel = useGLTF("/medias/sonic.glb") as unknown as GLTFResult;
    const { viewport } = useThree()
    const meshRefs = useRef<Mesh[]>([]);
    const customModelGroupRef = useRef<Group>(null);
    const sonicGroupRef = useRef<Group>(null);
    
    // Add mouse movement tracking
    const mouseSpeed = useRef(0);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const baseSpeed = useRef(0.02);
    const mouse = useRef({ x: 0, y: 0 });

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
    const { useCustomMesh, useSonic, torusScale, textScale } = useControls(
        'General Controls',
        {
            useCustomMesh: { value: false, label: 'Use Custom Model' },
            useSonic: { value: true, label: 'Use Sonic Model' },
            torusScale: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Torus Zoom' },
            textScale: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Text Zoom' },
        }
    );

    const { customModelScale, customModelSize, customModelRotation, customModelPosition } = useControls(
        'Custom Model Controls',
        {
            customModelScale: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'View Zoom' },
            customModelSize: { 
                value: { x: 1, y: 1, z: 1 }, 
                step: 0.1, 
                label: 'Model Size' 
            },
            customModelRotation: {
                value: { x: 0, y: 6.2, z: 0 },
                step: 0.1,
                label: 'Model Rotation'
            },
            customModelPosition: {
                value: { x: 0, y: -0.6, z: 0 },
                step: 0.1,
                label: 'Model Position'
            }
        },
        { collapsed: true }
    );

    const { sonicModelScale, sonicModelSize, sonicModelRotation, sonicModelPosition } = useControls(
        'Sonic Model Controls',
        {
            sonicModelScale: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'View Zoom' },
            sonicModelSize: { 
                value: { x: 0.04, y: 0.04, z: 0.04 }, 
                min: 0.0001,
                max: 5,
                step: 0.0001, 
                label: 'Model Size' 
            },
            sonicModelRotation: {
                value: { x: 0, y: 6.2, z: 0 },
                step: 0.1,
                label: 'Model Rotation'
            },
            sonicModelPosition: {
                value: { x: 0, y: 0, z: 0 },
                step: 0.1,
                label: 'Model Position'
            }
        },
        { collapsed: true }
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
            // Convert mouse position to normalized coordinates (-1 to 1)
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
        // Only rotate the torus model
        if (!useCustomMesh && !useSonic && meshRefs.current[0]) {
            meshRefs.current[0].rotation.x += 0.02;
            meshRefs.current[0].rotation.y += 0.01;
        }

        // Animate Sonic model
        if (useSonic && sonicGroupRef.current) {
            // Simple floating animation
            sonicGroupRef.current.position.y = sonicModelPosition.y + Math.sin(Date.now() * 0.001) * 0.05;
            
            // Look at mouse position with clamping
            const targetX = Math.max(-0.5, Math.min(0.5, mouse.current.x)) * 1.5; // Clamp horizontal rotation
            const targetY = Math.max(-0.3, Math.min(0.3, -mouse.current.y)) * 1.5; // Clamp vertical rotation with inversion
            const targetZ = -2;

            // Smoothly rotate towards mouse with slower interpolation
            sonicGroupRef.current.rotation.x += (targetY - sonicGroupRef.current.rotation.x) * 0.02;
            sonicGroupRef.current.rotation.y += (targetX - sonicGroupRef.current.rotation.y) * 0.02;
        }
    });

    return (
        <group scale={viewport.width / 3.75}>
            {/* Model group with separate zoom scale based on model type */}
            <group scale={!useCustomMesh && !useSonic ? torusScale : (useSonic ? sonicModelScale : customModelScale)}>
                {/* Render either the torus, custom model, or sonic based on the toggle */}
                {!useCustomMesh && !useSonic ? (
                    <mesh 
                        ref={(el) => { if (el) meshRefs.current[0] = el; }}
                        {...nodes.Torus002}
                    >
                        <MeshTransmissionMaterial {...materialProps} />
                    </mesh>
                ) : (
                    <group>
                        <OrbitControls 
                            enablePan={false}
                            enableZoom={true}
                            minDistance={1}
                            maxDistance={10}
                            makeDefault={false}
                            enabled={!useSonic} // Disable controls for Sonic
                        />
                        <group 
                            ref={useSonic ? sonicGroupRef : customModelGroupRef}
                            rotation={useSonic ? 
                                [0, 0, 0] : // Let the animation handle Sonic's rotation
                                [customModelRotation.x, customModelRotation.y, customModelRotation.z]}
                            position={useSonic ?
                                [sonicModelPosition.x, sonicModelPosition.y, sonicModelPosition.z] :
                                [customModelPosition.x, customModelPosition.y, customModelPosition.z]}
                            scale={useSonic ? 
                                [sonicModelSize.x, sonicModelSize.y, sonicModelSize.z] : 
                                [customModelSize.x, customModelSize.y, customModelSize.z]}
                        >
                            {Object.values(useSonic ? sonicModel.nodes : customModel.nodes).map((mesh, index) => (
                                <mesh
                                    key={mesh.name}
                                    ref={(el) => { if (el) meshRefs.current[index] = el; }}
                                    geometry={mesh.geometry}
                                    material={mesh.material}
                                />
                            ))}
                        </group>
                    </group>
                )}
            </group>

            {/* Text group with its own scale */}
            <group scale={textScale}>
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
        </group>
    )
} 