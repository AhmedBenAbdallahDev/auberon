'use client';
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import { Mesh } from 'three'
import { useControls } from 'leva'

export default function GlassModel() {
  const mesh = useRef<Mesh>(null)

  const { nodes } = useGLTF('/medias/torrus.glb')

  const { 
    thickness,
    roughness,
    chromaticAberration,
    anisotropy,
    distortion,
    distortionScale,
    temporalDistortion,
    clearcoat,
    attenuationDistance,
    attenuationColor,
    color
  } = useControls({
    thickness: { value: 0.5, min: 0, max: 2, step: 0.1 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    chromaticAberration: { value: 0.2, min: 0, max: 1, step: 0.1 },
    anisotropy: { value: 0.3, min: 0, max: 1, step: 0.1 },
    distortion: { value: 0.2, min: 0, max: 1, step: 0.1 },
    distortionScale: { value: 0.4, min: 0, max: 1, step: 0.1 },
    temporalDistortion: { value: 0.4, min: 0, max: 1, step: 0.1 },
    clearcoat: { value: 0.1, min: 0, max: 1, step: 0.1 },
    attenuationDistance: { value: 1.0, min: 0, max: 2, step: 0.1 },
    attenuationColor: '#ffffff',
    color: '#ffffff'
  })

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.3
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <mesh ref={mesh} scale={1.5} geometry={nodes.Torus002.geometry}>
      <MeshTransmissionMaterial
        thickness={thickness}
        roughness={roughness}
        chromaticAberration={chromaticAberration}
        anisotropy={anisotropy}
        distortion={distortion}
        distortionScale={distortionScale}
        temporalDistortion={temporalDistortion}
        clearcoat={clearcoat}
        attenuationDistance={attenuationDistance}
        attenuationColor={attenuationColor}
        color={color}
        samples={4}
        resolution={512}
        transmission={1}
      />
    </mesh>
  )
} 