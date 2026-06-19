import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Controls from "./components/Controls";
import useKeyboardControls from "./hooks/useKeyboardControls";

export default function App() {
  useKeyboardControls();
 
  return (
    <>
      <Controls />

      <div className="w-screen h-screen">
        <Canvas
          shadows
          camera={{
            position: [7, 7, 7],
            fov: 45,
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </>
  );
}