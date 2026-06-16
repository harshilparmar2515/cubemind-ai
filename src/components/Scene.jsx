import { OrbitControls } from "@react-three/drei";
import Cube from "./Cube";

export default function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={3}
      />

      <directionalLight
        position={[-5, -5, -5]}
        intensity={1.5}
      />

      <Cube />

      <OrbitControls />
    </>
  );
}