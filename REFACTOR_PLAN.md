# Refactoring Plan: Decoupling Collision and Lighting Behaviors

This document outlines the steps to refactor the particle behavior system. The primary goal is to separate collision physics from visual feedback (like lighting up) to create a more flexible and scalable architecture.

## Todo List

- [x] **Modify `Particle.ts`**: Change the `behavior` property to `behaviors`, which will be an array (`ParticleBehavior[]`), allowing a particle to have multiple behaviors simultaneously.
- [x] **Create `LightingBehavior.ts`**: Create a new, separate behavior class that specifically handles visual feedback for events like collisions. The initial implementation will move the "light up" logic from `CollisionBehavior` into this new class.
- [x] **Update `CollisionBehavior.ts`**: Remove the "light up" logic, making this class solely responsible for the physical response of a collision (e.g., bouncing or repelling).
- [x] **Update `ParticleManager.ts`**: Modify the particle creation and update logic to work with the new `behaviors` array.
- [x] **Update `PlayingState.ts`**: Adjust the collision event handler to iterate through the `behaviors` array on each particle and call the appropriate methods (like `handleCollision`).
- [x] **Update `level-configs.ts`**: Refactor the level configurations to define behaviors as an array, matching the new data structure.
- [x] **Implement "Repel" Mode**: Add a new "repel" mode to `CollisionBehavior.ts` to provide a smoother, non-instantaneous separation force for overlapping particles.
- [x] **Cleanup and Verification**: Remove any dead code, ensure all types are correct, and test the game to confirm that the new system works as intended.
