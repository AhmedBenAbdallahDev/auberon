import { useRef } from "react";
import { MeshTransmissionMaterial, useGLTF, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: {
    Torus002: Mesh
  }
}

useGLTF.preload("/medias/torrus.glb");

export default function Model() {
  const { viewport } = useThree();
  const torus = useRef<Mesh>(null);
  const group = useRef<Group>(null);

  const { nodes } = useGLTF("/medias/torrus.glb") as GLTFResult;

  useFrame((state) => {
    if (torus.current) {
      torus.current.rotation.x += 0.02;
    }
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
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
    <group ref={group} scale={viewport.width / 3.75}>
      {nodes?.Torus002 ? (
        <mesh ref={torus} geometry={nodes.Torus002.geometry}>
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
}
