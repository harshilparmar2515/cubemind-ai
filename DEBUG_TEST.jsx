/**
 * MINIMAL TEST: Verify Zustand state changes trigger visual position updates
 * 
 * Steps to test:
 * 1. Add this to your Scene.jsx temporarily (import and render it)
 * 2. Click "Rotate R" button in the UI
 * 3. Watch console for "State updated:" logs
 * 4. Open DevTools → Elements/DOM
 * 5. Inspect the mesh positions in the THREE.js scene
 * 
 * Expected behavior:
 * - Console shows "State updated: [cubies array]" after each R click
 * - Positions in array change (e.g., x:1 cubies have new y,z)
 * - Scene visually shows cubes moving
 */

import { useCubeStore } from "./src/store/cubeStore";
import { useEffect } from "react";

export default function DebugTest() {
  const cubies = useCubeStore((state) => state.cubies);
  const rotateR = useCubeStore((state) => state.rotateR);

  useEffect(() => {
    console.log("=== STATE UPDATED ===");
    console.log("Cubies:", cubies);
    console.log("Sample positions (first 5):", 
      cubies.slice(0, 5).map(c => `ID:${c.id} Pos:[${c.position.join(',')}]`)
    );
  }, [cubies]);

  return (
    <div className="absolute bottom-5 left-5 z-10 bg-black text-white p-3 text-xs font-mono rounded">
      <div>Cubies Count: {cubies.length}</div>
      <button
        onClick={rotateR}
        className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
      >
        DEBUG: Rotate R
      </button>
      <div className="mt-2 max-h-32 overflow-auto">
        {cubies.slice(0, 3).map(c => (
          <div key={c.id} className="text-xs">
            #{c.id}: [{c.position[0]}, {c.position[1]}, {c.position[2]}]
          </div>
        ))}
      </div>
    </div>
  );
}
