import { useCubeStore } from "../store/cubeStore";

export default function Controls() {
  const resetCube = useCubeStore((state) => state.resetCube);
  const rotateR = useCubeStore((state) => state.rotateR);
  const rotateL = useCubeStore((state) => state.rotateL);
  const rotateU = useCubeStore((state) => state.rotateU);
  const rotateD = useCubeStore((state) => state.rotateD);
  const rotateF = useCubeStore((state) => state.rotateF);
  const rotateB = useCubeStore((state) => state.rotateB);
  const isAnimating = useCubeStore((state) => state.animatingCubieIds.size > 0);

  const buttonClass = (bgColor) =>
    `px-4 py-2 ${bgColor} rounded font-bold transition-opacity ${
      isAnimating ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
    }`;

  return (
    <div className="absolute top-5 left-5 z-10 flex flex-col gap-3">
      {/* Top Row: U, D */}
      <div className="flex gap-2">
        <button
          onClick={rotateU}
          disabled={isAnimating}
          className={buttonClass("bg-white text-black")}
          title="Rotate Up"
        >
          U
        </button>
        <button
          onClick={rotateD}
          disabled={isAnimating}
          className={buttonClass("bg-yellow-500 text-black")}
          title="Rotate Down"
        >
          D
        </button>
      </div>

      {/* Middle Row: L, F, R, B */}
      <div className="flex gap-2">
        <button
          onClick={rotateL}
          disabled={isAnimating}
          className={buttonClass("bg-orange-500 text-white")}
          title="Rotate Left"
        >
          L
        </button>
        <button
          onClick={rotateF}
          disabled={isAnimating}
          className={buttonClass("bg-green-500 text-white")}
          title="Rotate Front"
        >
          F
        </button>
        <button
          onClick={rotateR}
          disabled={isAnimating}
          className={buttonClass("bg-red-500 text-white")}
          title="Rotate Right"
        >
          R
        </button>
        <button
          onClick={rotateB}
          disabled={isAnimating}
          className={buttonClass("bg-blue-600 text-white")}
          title="Rotate Back"
        >
          B
        </button>
      </div>

      {/* Bottom Row: Reset */}
      <button
        onClick={resetCube}
        disabled={isAnimating}
        className={buttonClass("bg-gray-600 text-white")}
        title="Reset Cube"
      >
        Reset
      </button>
    </div>
  );
}