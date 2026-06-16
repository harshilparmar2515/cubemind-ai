import React from "react";

export default function Cubie({ position }) {
  const [x, y, z] = position;

  const colors = [
    x === 1 ? "#ff0000" : "#111111", // Right
    x === -1 ? "#ff8c00" : "#111111", // Left

    y === 1 ? "#ffffff" : "#111111", // Top
    y === -1 ? "#ffff00" : "#111111", // Bottom

    z === 1 ? "#00ff00" : "#111111", // Front
    z === -1 ? "#0000ff" : "#111111", // Back
  ];

  return (
    <mesh position={position}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />

      {colors.map((color, index) => (
        <meshStandardMaterial
          key={index}
          attach={`material-${index}`}
          color={color}
        />
      ))}
    </mesh>
  );
}