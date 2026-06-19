# Rubik's Cube Engine Architecture

## Overview
A clean, maintainable foundation for a Rubik's Cube simulator built with React, Vite, React Three Fiber, Three.js, and Zustand.

## Core Concepts

### Cubie Structure
Each of the 27 cubies is tracked with:
```javascript
{
  id: 0-26,
  position: [x, y, z],           // Grid position: -1, 0, or 1 per axis
  colors: {
    right: "#ff0000" | null,     // Red or null (no sticker on right face)
    left: "#ff8c00" | null,      // Orange
    top: "#ffffff" | null,       // White
    bottom: "#ffff00" | null,    // Yellow
    front: "#00ff00" | null,     // Green
    back: "#0000ff" | null,      // Blue
  }
}
```

### Coordinate System
- **X-axis**: -1 (left) → 0 (center) → 1 (right)
- **Y-axis**: -1 (bottom) → 0 (center) → 1 (top)
- **Z-axis**: -1 (back) → 0 (center) → 1 (front)

### Sticker Colors
- **Right face**: Red (#ff0000)
- **Left face**: Orange (#ff8c00)
- **Top face**: White (#ffffff)
- **Bottom face**: Yellow (#ffff00)
- **Front face**: Green (#00ff00)
- **Back face**: Blue (#0000ff)

## How Moves Work

### Movement Pattern
Each move rotates 9 cubies on one face:
1. **Select cubies** where the target axis matches the target value
   - R move: select all cubies where `x === 1`
   - L move: select all cubies where `x === -1`
   - U move: select all cubies where `y === 1`
   - D move: select all cubies where `y === -1`
   - F move: select all cubies where `z === 1`
   - B move: select all cubies where `z === -1`

2. **Transform position** using rotation formula
3. **Permute colors** to match the new orientation

### Position Transformation Formulas
- **R move** (90° CW from right): `[x, y, z]` → `[x, -z, y]`
- **L move** (90° CW from left): `[x, y, z]` → `[x, z, -y]`
- **U move** (90° CW from top): `[x, y, z]` → `[z, y, -x]`
- **D move** (90° CW from bottom): `[x, y, z]` → `[-z, y, x]`
- **F move** (90° CW from front): `[x, y, z]` → `[y, -x, z]`
- **B move** (90° CW from back): `[x, y, z]` → `[-y, x, z]`

### Color Permutation Examples

**R move** (Top → Front → Bottom → Back → Top):
```javascript
{
  right: colors.right,      // stays
  left: colors.left,        // stays
  top: colors.back,         // receives back
  bottom: colors.front,     // receives front
  front: colors.top,        // receives top
  back: colors.bottom,      // receives bottom
}
```

**U move** (Front → Left → Back → Right → Front):
```javascript
{
  right: colors.front,      // receives front
  left: colors.back,        // receives back
  top: colors.top,          // stays
  bottom: colors.bottom,    // stays
  front: colors.right,      // receives right
  back: colors.left,        // receives left
}
```

## Rendering Pipeline

### Scene.jsx (Entry point)
- Configures Three.js scene with lighting
- Renders Cube component and controls

### Cube.jsx (State bridge)
- Reads all cubies from Zustand
- Maps each cubie to a Cubie component
- Passes `position` and `colors` props

### Cubie.jsx (3D unit)
- Renders black plastic body (0.95×0.95×0.95 cm)
- Conditionally renders stickers based on `colors` object
- Each sticker is positioned/rotated relative to cubie

### Sticker.jsx (Visual element)
- Renders 2D plane with color
- Positioned relative to cubie face

## Zustand Store Architecture

### State
- `cubies`: Array of 27 cubie objects

### Actions
- `rotateR()`: Rotates right face 90° clockwise
- `rotateL()`: Rotates left face 90° clockwise
- `rotateU()`: Rotates top face 90° clockwise
- `rotateD()`: Rotates bottom face 90° clockwise
- `rotateF()`: Rotates front face 90° clockwise
- `rotateB()`: Rotates back face 90° clockwise
- `resetCube()`: Resets to solved state

## Key Design Principles

### ✅ Single Source of Truth
- Zustand store holds all state
- React Three Fiber renders from state
- No DOM manipulation needed

### ✅ Color Independence from Position
- Stickers follow cubie's `colors` object, not position
- Allows any cubie to be in any position with correct stickers
- Essential for scrambled states and move sequences

### ✅ Extensible Move System
- All moves follow identical pattern
- Position formula + color permutation function
- Easy to add inverse moves (R', L2, etc.)

### ✅ Clean Rendering
- Conditional rendering: `{colors.right && <Sticker />}`
- No manual THREE.js manipulation
- React Three Fiber handles transforms

## Cubie Types (Reference)

### Corner Pieces (8 total)
- Positions: all where |x| + |y| + |z| = 3
- Has 3 colored stickers
- Can rotate into 3 orientations

### Edge Pieces (12 total)
- Positions: all where |x| + |y| + |z| = 2
- Has 2 colored stickers
- Can rotate into 2 orientations

### Center Pieces (6 total)
- Positions: (±1,0,0), (0,±1,0), (0,0,±1)
- Has 1 colored sticker
- Only 1 orientation

*Note: Current system treats all uniformly; optimization possible for advanced features*

## Next Steps (When Ready)

1. **Inverse moves**: Add R', L', U', D', F', B' (counter-clockwise)
2. **Double moves**: Add R2, L2, U2, D2, F2, B2 (180°)
3. **Move sequences**: String concatenation (e.g., "RUR'U'")
4. **Animations**: Smooth transitions between states
5. **State validation**: Verify cube is solvable
6. **Solver**: Implement solving algorithms
7. **AI features**: As requested later

## Production Checklist

- ✅ No console.log statements
- ✅ No debug components
- ✅ Clean component tree
- ✅ Proper prop passing
- ✅ Correct color permutation logic
- ✅ All 6 moves implemented
- ✅ State and visual sync verified
- ✅ Ready for animations
- ✅ Ready for solver integration

## Testing Moves

1. Click any move button (R, L, U, D, F, B)
2. Verify stickers rotate with cubies (not staying in place)
3. Click same move 4 times
4. Cube should return to identical state (move is cyclic)
5. Click Reset to verify initial state restoration
