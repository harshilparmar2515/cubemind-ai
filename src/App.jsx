import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

export default function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  );
}