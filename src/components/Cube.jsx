import Cubie from "./Cubie";
import { useCubeStore } from "../store/cubeStore";

export default function Cube() {
  const cubies = useCubeStore((state) => state.cubies);

  return (
    <group>
      {cubies.map((cubie) => (
        <Cubie
          key={cubie.id}
          position={cubie.position}
          colors={cubie.colors}
          id={cubie.id}
        />
      ))}
    </group>
  );
}