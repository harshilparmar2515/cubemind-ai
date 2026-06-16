import Sticker from "./Sticker";

export default function Cubie({ position }) {
  const [x, y, z] = position;

  return (
    <group position={position}>
      {/* Black Plastic Body */}
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />

        <meshStandardMaterial
          color="#111111"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Right */}
      {x === 1 && (
        <Sticker
          position={[0.48, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          color="#ff0000"
        />
      )}

      {/* Left */}
      {x === -1 && (
        <Sticker
          position={[-0.48, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          color="#ff8c00"
        />
      )}

      {/* Top */}
      {y === 1 && (
        <Sticker
          position={[0, 0.48, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#ffffff"
        />
      )}

      {/* Bottom */}
      {y === -1 && (
        <Sticker
          position={[0, -0.48, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#ffff00"
        />
      )}

      {/* Front */}
      {z === 1 && (
        <Sticker
          position={[0, 0, 0.48]}
          color="#00ff00"
        />
      )}

      {/* Back */}
      {z === -1 && (
        <Sticker
          position={[0, 0, -0.48]}
          rotation={[0, Math.PI, 0]}
          color="#0000ff"
        />
      )}
    </group>
  );
}