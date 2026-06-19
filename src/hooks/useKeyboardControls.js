import { useEffect } from "react";
import { useCubeStore } from "../store/cubeStore";

export default function useKeyboardControls() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const store = useCubeStore.getState();

      switch (e.key.toUpperCase()) {
        case "R":
          store.rotateR();
          break;
        case "L":
          store.rotateL();
          break;
        case "U":
          store.rotateU();
          break;
        case "D":
          store.rotateD();
          break;
        case "F":
          store.rotateF();
          break;
        case "B":
          store.rotateB();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);
}