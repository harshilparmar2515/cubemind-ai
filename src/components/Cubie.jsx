import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Sticker from "./Sticker";
import { useCubeStore } from "../store/cubeStore";

export default function Cubie({ position, colors, id }) {
  const groupRef = useRef();
  const animatingCubieIds = useCubeStore((state) => state.animatingCubieIds);
  const animationAxis = useCubeStore((state) => state.animationAxis);
  const animationDirection = useCubeStore((state) => state.animationDirection);
  const animationStartTime = useCubeStore((state) => state.animationStartTime);

  // Reset group rotation when animation state changes or cubie is not animating
  useEffect(() => {
    if (groupRef.current && !animatingCubieIds.has(id)) {
      groupRef.current.rotation.set(0, 0, 0);
    }
  }, [animatingCubieIds, id]);

  // Apply rotation animation per frame
  useFrame(() => {
    if (!groupRef.current || !animatingCubieIds.has(id) || !animationStartTime) {
      return;
    }

    const elapsed = performance.now() - animationStartTime;
    const progress = Math.min(elapsed / 300, 1); // 300ms duration
    const rotationAngle = (progress * Math.PI) / 2; // 90 degrees

    // Apply rotation based on animation axis
    groupRef.current.rotation.set(0, 0, 0);

    if (animationAxis === "x") {
      groupRef.current.rotateX(rotationAngle * animationDirection);
    } else if (animationAxis === "y") {
      groupRef.current.rotateY(rotationAngle * animationDirection);
    } else if (animationAxis === "z") {
      groupRef.current.rotateZ(rotationAngle * animationDirection);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Black Plastic Body */}
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Right Face */}
      {colors.right && (
        <Sticker
          position={[0.48, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          color={colors.right}
        />
      )}

      {/* Left Face */}
      {colors.left && (
        <Sticker
          position={[-0.48, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          color={colors.left}
        />
      )}

      {/* Top Face */}
      {colors.top && (
        <Sticker
          position={[0, 0.48, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color={colors.top}
        />
      )}

      {/* Bottom Face */}
      {colors.bottom && (
        <Sticker
          position={[0, -0.48, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          color={colors.bottom}
        />
      )}

      {/* Front Face */}
      {colors.front && (
        <Sticker
          position={[0, 0, 0.48]}
          rotation={[0, 0, 0]}
          color={colors.front}
        />
      )}

      {/* Back Face */}
      {colors.back && (
        <Sticker
          position={[0, 0, -0.48]}
          rotation={[0, Math.PI, 0]}
          color={colors.back}
        />
      )}
    </group>
  );
}