import React from "react";

export default function Cubie({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />

      <meshStandardMaterial
        color="#111827"
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}