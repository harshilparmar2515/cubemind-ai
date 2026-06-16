export default function Sticker({
  position,
  rotation = [0, 0, 0],
  color,
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
    >
      <planeGeometry args={[0.72, 0.72]} />

      <meshStandardMaterial
        color={color}
      />
    </mesh>
  );
}