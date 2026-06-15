import Cubie from "./Cubie";

export default function Cube() {
  const cubies = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push(
          <Cubie
            key={`${x}-${y}-${z}`}
            position={[x, y, z]}
          />
        );
      }
    }
  }

  return <group>{cubies}</group>;
}