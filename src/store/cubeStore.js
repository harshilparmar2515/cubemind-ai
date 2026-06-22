import { create } from "zustand";

/**
 * Initialize color/sticker state for a cubie at position [x, y, z]
 * Each face tracks which color sticker is currently on it
 */
function initializeColors(x, y, z) {
  return {
    right: x === 1 ? "#ff0000" : null,    
    left: x === -1 ? "#ff8c00" : null,    
    top: y === 1 ? "#ffffff" : null,   
    bottom: y === -1 ? "#ffff00" : null,  
    front: z === 1 ? "#00ff00" : null,    
    back: z === -1 ? "#0000ff" : null,   
  };
}

/**
 * Animation metadata for a move
 */
function createAnimationMetadata(axis, direction) {
  return {
    axis,        // 'x', 'y', or 'z'
    direction,   // 1 or -1
    elapsed: 0,
    duration: 300,  // milliseconds
  };
}

function createSolvedCube() {
  const cubies = [];
  let id = 0;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({
          id: id++,
          position: [x, y, z],
          colors: initializeColors(x, y, z),
        });
      }
    }
  }

  return cubies;
}

/**
 * Rotate colors for R move: Top → Front → Bottom → Back → Top
 * Right face stays on right, Left face stays on left
 */
function rotateColorsR(colors) {
  return {
    right: colors.right,
    left: colors.left,
    top: colors.back,
    bottom: colors.front,
    front: colors.top,
    back: colors.bottom,
  };
}
function rotateColorsRPrime(colors) {
  return {
    right: colors.right,
    left: colors.left,

    top: colors.front,
    front: colors.bottom,
    bottom: colors.back,
    back: colors.top,
  };
}
/**
 * Rotate colors for L move: Top → Back → Bottom → Front → Top
 * Left face stays on left, Right face stays on right
 */
function rotateColorsL(colors) {
  return {
    right: colors.right,
    left: colors.left,
    top: colors.front,
    bottom: colors.back,
    front: colors.bottom,
    back: colors.top,
  };
}

/**
 * Rotate colors for U move: Front → Right → Back → Left → Front
 * Top face stays on top, Bottom face stays on bottom
 */
function rotateColorsU(colors) {
  return {
    right: colors.front,
    left: colors.back,
    top: colors.top,
    bottom: colors.bottom,
    front: colors.left,
    back: colors.right,
  };
}

/**
 * Rotate colors for D move: Front → Left → Back → Right → Front
 * Top face stays on top, Bottom face stays on bottom
 */
function rotateColorsD(colors) {
  return {
    right: colors.back,
    left: colors.front,
    top: colors.top,
    bottom: colors.bottom,
    front: colors.right,
    back: colors.left,
  };
}

/**
 * Rotate colors for F move: Top → Right → Bottom → Left → Top
 * Front face stays on front, Back face stays on back
 */
function rotateColorsF(colors) {
  return {
    right: colors.top,
    left: colors.bottom,
    top: colors.left,
    bottom: colors.right,
    front: colors.front,
    back: colors.back,
  };
}

/**
 * Rotate colors for B move: Top → Left → Bottom → Right → Top
 * Front face stays on front, Back face stays on back
 */
function rotateColorsB(colors) {
  return {
    right: colors.bottom,
    left: colors.top,
    top: colors.right,
    bottom: colors.left,
    front: colors.front,
    back: colors.back,
  };
}

/**
 * Move configuration: selector, transform, color rotation
 */
const moveConfigs = {
  R: {
    selector: (cubie) => cubie.position[0] === 1,
    transform: (cubie) => ({
      ...cubie,
      position: [cubie.position[0], -cubie.position[2], cubie.position[1]],
      colors: rotateColorsR(cubie.colors),
      
    }),
    axis: 'x',
    direction: 1,
  },
R_PRIME: {
  selector: (cubie) => cubie.position[0] === 1,

  transform: (cubie) => ({
    ...cubie,

    position: [
      cubie.position[0],
      cubie.position[2],
      -cubie.position[1],
    ],

    colors: rotateColorsRPrime(cubie.colors),
  }),

  axis: "x",
  direction: -1,
},
  L: {
    selector: (cubie) => cubie.position[0] === -1,
    transform: (cubie) => ({
      ...cubie,
      position: [cubie.position[0], cubie.position[2], -cubie.position[1]],
      colors: rotateColorsL(cubie.colors),
    }),
    axis: 'x',
    direction: -1,
  },
  U: {
    selector: (cubie) => cubie.position[1] === 1,
    transform: (cubie) => ({
      ...cubie,
      position: [cubie.position[2], cubie.position[1], -cubie.position[0]],
      colors: rotateColorsU(cubie.colors),
    }),
    axis: 'y',
    direction: 1,
  },
  D: {
    selector: (cubie) => cubie.position[1] === -1,
    transform: (cubie) => ({
      ...cubie,
      position: [-cubie.position[2], cubie.position[1], cubie.position[0]],
      colors: rotateColorsD(cubie.colors),
    }),
    axis: 'y',
    direction: -1,
  },
  F: {
    selector: (cubie) => cubie.position[2] === 1,
    transform: (cubie) => ({
      ...cubie,
      position: [cubie.position[1], -cubie.position[0], cubie.position[2]],
      colors: rotateColorsF(cubie.colors),
    }),
    axis: 'z',
    direction: 1,
  },
  B: {
    selector: (cubie) => cubie.position[2] === -1,
    transform: (cubie) => ({
      ...cubie,
      position: [-cubie.position[1], cubie.position[0], cubie.position[2]],
      colors: rotateColorsB(cubie.colors),
    }),
    axis: 'z',
    direction: -1,
  },
};

export const useCubeStore = create((set, get) => ({
  cubies: createSolvedCube(),

  // Animation state
  animatingCubieIds: new Set(),
  animationAxis: null,
  animationDirection: null,
  animationStartTime: null,
  pendingTransform: null,

  /**
   * Core animation function supporting all moves
   * @param {string} moveName - 'R', 'L', 'U', 'D', 'F', or 'B'
   */
  animateMove: (moveName) => {
    const config = moveConfigs[moveName];
    if (!config) {
      console.warn(`Unknown move: ${moveName}`);
      return;
    }

    set((state) => {
      // Find cubies affected by this move
      const affectedCubies = state.cubies.filter(config.selector);
      const affectedIds = new Set(affectedCubies.map((c) => c.id));

      // Calculate target state (what will be committed after animation)
      const targetCubies = state.cubies.map((cubie) => {
        if (!affectedIds.has(cubie.id)) return cubie;
        return config.transform(cubie);
      });

      // Begin animation
      return {
        animatingCubieIds: affectedIds,
        animationAxis: config.axis,
        animationDirection: config.direction,
        animationStartTime: performance.now(),
        pendingTransform: targetCubies,
      };
    });

    // Schedule state commit after 300ms
    const timeout = setTimeout(() => {
      set((state) => {
        if (state.pendingTransform) {
          return {
            cubies: state.pendingTransform,
            animatingCubieIds: new Set(),
            animationAxis: null,
            animationDirection: null,
            animationStartTime: null,
            pendingTransform: null,
          };
        }
        return state;
      });
    }, 300);

    return timeout;
  },

  // Legacy single-move methods for backwards compatibility
  rotateR: () => get().animateMove('R'),
  rotateRPrime: () => get().animateMove("R_PRIME"),
  rotateL: () => get().animateMove('L'),
  rotateU: () => get().animateMove('U'),
  rotateD: () => get().animateMove('D'),
  rotateF: () => get().animateMove('F'),
  rotateB: () => get().animateMove('B'),

  resetCube: () =>
    set({
      cubies: createSolvedCube(),
      animatingCubieIds: new Set(),
      animationAxis: null,
      animationDirection: null,
      animationStartTime: null,
      pendingTransform: null,
    }),
}));
