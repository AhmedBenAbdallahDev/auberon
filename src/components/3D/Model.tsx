import { useRef } from "react";
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh } from "three";

export default function Model() {
  const { nodes } = useGLTF("/medias/torrus.glb");
  const { viewport } = useThree();
  const torus = useRef<Mesh>(null);

  useFrame(() => {
    if (torus.current) {
      torus.current.rotation.x += 0.02;
    }
  });

  const materialProps = {
    thickness: 0.2,
    roughness: 0,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.02,
    backside: true,
  };

  return (
    <group scale={viewport.width / 3.75}>
      <Text
        font="/fonts/PPNeueMontreal-Bold.otf"
        position={[0, 0, -1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        AUBERON
      </Text>
      <mesh ref={torus} {...nodes.Torus002}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
}
