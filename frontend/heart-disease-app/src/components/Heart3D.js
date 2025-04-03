import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";

export default function Heart3D() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="red" />
      </Sphere>
    </Canvas>
  );
}
