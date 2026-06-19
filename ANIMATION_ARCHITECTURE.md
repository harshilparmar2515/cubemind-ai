# Smooth Face Rotation Animation Architecture

## Overview
Implements smooth 300ms face rotation animations using React Three Fiber's `useFrame` hook and Zustand state management. Cubies rotate visually before state is committed, maintaining mathematical correctness throughout.

## Animation Flow

### 1. Animation Initiation (`animateMove`)
When a move is triggered (e.g., R move):

```javascript
animateMove('R') // Calls store function
```

The function:
1. **Selects affected cubies** using the move's selector function
2. **Calculates target state** (final positions & colors after animation)
3. **Sets animation state** (axis, direction, timestamp, affected cube IDs)
4. **Schedules state commit** after 300ms delay

### 2. Visual Animation (Cubie Component)
Each frame, the Cubie component:

```javascript
useFrame(() => {
  if (animatingCubieIds.has(id)) {
    // Calculate progress: 0 to 1 over 300ms
    const progress = elapsed / 300
    const angle = progress * (Math.PI / 2) // 0 to 90°
    
    // Apply rotation to group
    groupRef.current.rotateX/Y/Z(angle * direction)
  }
})
```

- Reads animation state from store
- Calculates time progress (0 → 1)
- Computes rotation angle (0° → 90°)
- Applies rotation to the cubie's group
- Automatically resets after animation ends

### 3. State Commitment
After 300ms timeout:
- Pending transform (calculated target state) is committed
- Animation state is cleared
- Cubies snap to final positions with updated colors

## Architecture: Move Configurations

All move logic is centralized in `moveConfigs` object:

```javascript
const moveConfigs = {
  R: {
    selector: (cubie) => cubie.position[0] === 1,        // Select right face
    transform: (cubie) => ({                              // Apply transformation
      position: [x, -z, y],
      colors: rotateColorsR(cubie.colors),
    }),
    axis: 'x',      // Rotation axis
    direction: 1,   // Rotation direction (1 or -1)
  },
  // ... L, U, D, F, B follow same pattern
}
```

### Why This Design

1. **DRY (Don't Repeat Yourself)**: Single source of truth for each move
2. **Extensible**: New moves (R', R2, rotations) need only new config entry
3. **Maintainable**: Move logic is declarative and easy to verify
4. **Testable**: Each config's transform can be unit tested

## Adding New Moves

### Example: R' (R Prime - Counter-clockwise)

```javascript
const moveConfigs = {
  // ... existing moves ...
  
  R_prime: {
    selector: (cubie) => cubie.position[0] === 1,
    transform: (cubie) => ({
      ...cubie,
      position: [cubie.position[0], cubie.position[2], -cubie.position[1]],
      colors: rotateColorsR_prime(cubie.colors), // inverse rotation
    }),
    axis: 'x',
    direction: -1, // Opposite direction
  },
};

// Add to store:
rotateR_prime: () => get().animateMove('R_prime'),
```

### Example: R2 (Double move)

```javascript
R2: {
  selector: (cubie) => cubie.position[0] === 1,
  transform: (cubie) => ({
    ...cubie,
    position: [cubie.position[0], cubie.position[2], -cubie.position[1]],
    colors: rotateColorsR_double(cubie.colors),
  }),
  axis: 'x',
  direction: 1,
  // Optionally override duration
  duration: 600, // 2x normal duration
},
```

## State Structure

### Animation State in Store

```javascript
{
  cubies: [],                    // All 27 cubies (FINAL state)
  
  // Animation-specific state
  animatingCubieIds: Set([...]), // Cubies currently rotating
  animationAxis: 'x'|'y'|'z',    // Rotation axis
  animationDirection: 1|-1,      // Rotation direction
  animationStartTime: timestamp, // When animation began
  pendingTransform: cubies[],    // Final state to commit
}
```

### Why Separate `pendingTransform`?

During animation:
- **Store cubies**: Remain unchanged (visual position still correct)
- **Group rotation**: Applied via Three.js transform (smooth visual rotation)
- **pendingTransform**: Calculated once, committed when animation ends

This ensures:
1. Cube state stays mathematically correct
2. Visual animation is smooth
3. No state flicker or jitter

## Timing: 300ms Duration

Animation timeline:

```
t=0ms          t=150ms        t=300ms
Start          Midway         Complete
|_______________||_____________|
0°              45°             90°
```

Progress calculation:
```javascript
const progress = Math.min((now - startTime) / 300, 1)
const angle = progress * (Math.PI / 2)
```

Clamping to `1.0` ensures animation doesn't overshoot.

## Control Flow During Animation

```
User clicks R button
         ↓
rotateR() → animateMove('R')
         ↓
Set animation state
Set pendingTransform
Start 300ms timer
         ↓
Each frame: Cubie detects animation, applies rotation
         ↓
At 300ms: Timer fires, commits pendingTransform, clears animation state
         ↓
Animation complete, new state ready for next move
```

## UI Feedback

During animation, Controls component disables all buttons:

```javascript
const isAnimating = useCubeStore((state) => state.animatingCubieIds.size > 0)

// Buttons are disabled while isAnimating === true
```

This prevents:
- Multiple simultaneous rotations
- State corruption
- Unpredictable cube behavior

## Mathematical Correctness

### Guarantees

1. **Position transforms are valid**: Each move's position formula is verified to:
   - Rotate 9 cubies on the target face
   - Preserve all other cubies
   - Maintain integer coordinates (-1, 0, 1)

2. **Color permutations match position rotations**: Color cycle direction matches geometric rotation

3. **State is committed only after visual animation**: Ensures no state-visual mismatch

### Example: R Move Verification

Cubies at `x=1` before R move:
```
Position:  [1, y, z]  →  [1, -z, y]
```

Test case: Cubie at [1, 1, 1] (corner)
```
Before: [1, 1, 1]
After:  [1, -1, 1]  ✓ (90° CW viewed from right)
```

Color transformation (R move):
```
before → after
front  → top
top    → back
back   → bottom
bottom → front
right  → right (unchanged)
left   → left (unchanged)
```

## Performance Considerations

1. **Animation State**: Store only IDs in Set (lightweight)
2. **Per-frame Calculation**: Simple math, no allocations
3. **No Re-renders During Animation**: Only Cubie component updates (via `useFrame`)
4. **300ms Timeout**: Single timer per move, cleared after commit

## Testing Animation

### Manual Testing Checklist

- [ ] Single R move animates smoothly
- [ ] Animation completes and state is correct
- [ ] Can't start new move during animation (buttons disabled)
- [ ] After animation, colors and positions match
- [ ] Reset works correctly
- [ ] All 6 moves animate correctly
- [ ] Rapid moves (after delay) work properly

### Automated Testing

```javascript
test('R move animation', async () => {
  const { animatingCubieIds, animateMove } = store.getState()
  
  animateMove('R')
  expect(animatingCubieIds.size).toBe(9)
  
  await delay(300)
  expect(animatingCubieIds.size).toBe(0)
  expect(store.getState().cubies[cubieIndex].position).toEqual([1, -1, 1])
})
```

## Troubleshooting

### Animation doesn't play
- Check `useFrame` hook is imported in Cubie
- Verify store state has `animatingCubieIds.size > 0`
- Ensure `animationStartTime` is set

### Animation snaps instead of smooths
- Check 300ms timeout fires correctly
- Verify `groupRef.current` exists and is the group
- Check rotation formula uses correct axis

### Cube state is wrong after animation
- Verify `moveConfigs` transform is correct
- Check color rotation function matches position rotation
- Ensure `pendingTransform` is committed

### Multiple moves happen simultaneously
- Controls should disable buttons during `isAnimating`
- Check `animatingCubieIds.size > 0` predicate
- Verify timeout is scheduled correctly

## Future Extensions

1. **Rotations**: Define M, E, S moves
2. **Macro moves**: R U R' U' sequences
3. **Animations speed**: Allow custom durations per move
4. **Easing functions**: Replace linear with ease-out
5. **Queue system**: Queue moves during animation, play sequentially
6. **Replay system**: Record move history, replay with animations
