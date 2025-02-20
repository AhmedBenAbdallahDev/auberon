import { useRef, useEffect, useState } from "react";
import { MeshTransmissionMaterial, useGLTF, Text, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh } from "three";

useGLTF.preload("/medias/torrus.glb");

export default function Model() {
  const [modelError, setModelError] = useState<Error | null>(null);
  const { viewport } = useThree();
  const torus = useRef<Mesh>(null);

  // Load model with error handling
  const { nodes } = useGLTF("/medias/torrus.glb");

  useFrame(() => {
    if (torus.current) {
      try {
        torus.current.rotation.x += 0.02;
      } catch (error) {
        console.error('Animation Error:', error);
      }
    }
  });

  if (modelError) {
    return (
      <Html center>
        <div className="text-red-500 bg-black/80 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Failed to load 3D model</h2>
          <p>{modelError.message}</p>
        </div>
      </Html>
    );
  }

  const materialProps = {
    thickness: 0.2,
    roughness: 0,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.02,
    backside: true,
  };

  try {
    return (
      <group scale={viewport.width / 3.75}>
        <Text
          position={[0, 0, -1]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="sans-serif"
        >
          AUBERON
        </Text>
        {nodes?.Torus002 ? (
          <mesh ref={torus} {...nodes.Torus002}>
            <MeshTransmissionMaterial {...materialProps} />
          </mesh>
        ) : (
          <Html center>
            <div className="text-yellow-500 bg-black/80 p-4 rounded-lg">
              Loading model...
            </div>
          </Html>
        )}
      </group>
    );
  } catch (error) {
    console.error('Render Error:', error);
    return (
      <Html center>
        <div className="text-red-500 bg-black/80 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Rendering error</h2>
          <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        </div>
      </Html>
    );
  }
}
