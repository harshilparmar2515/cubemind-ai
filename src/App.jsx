import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

export default function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [6, 6, 6], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}