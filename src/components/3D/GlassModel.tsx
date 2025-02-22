'use client';
import React, { useRef, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls, LevaPanel } from 'leva'
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
    const thirdText1 = useRef<Group>(null);
    // Row 2
    const firstText2 = useRef<Group>(null);
    const secondText2 = useRef<Group>(null);
    const thirdText2 = useRef<Group>(null);
    // Row 3
    const firstText3 = useRef<Group>(null);
    const secondText3 = useRef<Group>(null);
    const thirdText3 = useRef<Group>(null);

    let xPercent = 0;
    let animationFrameId: number;

    // Create a store for the panel
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'l') setShow(s => !s);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Add the controls to the panel
    const { speed, width, verticalGap, fontSize } = useControls(
        'Text Controls',
        {
            speed: { value: 0.08, min: 0.01, max: 1, step: 0.01, label: 'Speed' },
            width: { value: 12, min: 5, max: 30, step: 0.1, label: 'Text Spacing' },
            verticalGap: { value: 0.8, min: 0.1, max: 2, step: 0.1, label: 'Vertical Gap' },
            fontSize: { value: 0.8, min: 0.2, max: 2, step: 0.1, label: 'Font Size' }
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
            backside: { value: true }
        }
    );

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
        // Get the actual width of the text
        const textWidth = 20;
        
        // Reset when first text moves completely off screen
        if (xPercent >= textWidth) {
            xPercent = 0;
        }
        
        [
            [firstText1, secondText1, thirdText1],
            [firstText2, secondText2, thirdText2],
            [firstText3, secondText3, thirdText3]
        ].forEach(([first, second, third]) => {
            if (first.current && second.current && third.current) {
                // Position three texts back to back
                first.current.position.x = -2 * textWidth + xPercent;
                second.current.position.x = -textWidth + xPercent;
                third.current.position.x = xPercent;
            }
        });
        
        xPercent += speed;
        animationFrameId = requestAnimationFrame(animate);
    };

    // Combined effect for animation setup and cleanup
    useEffect(() => {
        // Initial setup - position texts
        xPercent = 0;
        const textWidth = 20;
        
        [
            [firstText1, secondText1, thirdText1],
            [firstText2, secondText2, thirdText2],
            [firstText3, secondText3, thirdText3]
        ].forEach(([first, second, third]) => {
            if (first.current && second.current && third.current) {
                first.current.position.x = -2 * textWidth;
                second.current.position.x = -textWidth;
                third.current.position.x = 0;
            }
        });
        
        // Start animation
        animate();
        
        // Cleanup
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [speed]);

    useFrame(() => {
        if (torus.current) {
            torus.current.rotation.x += 0.02;
        }
    });

    return (
        <group scale={viewport.width / 3.75}>
            {/* Scrolling Text - Three Rows */}
            <group position={[-10, verticalGap, -2]}>
                <group ref={firstText1}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText1}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={thirdText1}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
            </group>

            <group position={[-10, 0, -2]}>
                <group ref={firstText2}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText2}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={thirdText2}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
            </group>

            <group position={[-10, -verticalGap, -2]}>
                <group ref={firstText3}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={secondText3}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
                        Transforming Ideas into Digital Excellence •
                    </Text>
                </group>
                <group ref={thirdText3}>
                    <Text fontSize={fontSize} color="white" anchorX="left" anchorY="middle" font={'/fonts/PPNeueMontreal-Bold.otf'} letterSpacing={-0.15}>
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