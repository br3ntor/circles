# Plan: Centralized Collision System

This document outlines the plan to refactor the game's collision detection into a centralized `CollisionManager` class. This will solve the issue of collisions not working with "ghost" particles in `seamless` wrap mode and will provide a more robust and scalable architecture for future development.

## 1. Create `CollisionManager.ts`

This new class will be the heart of the collision system.

- **`CollisionManager.ts`:**
  - **`constructor(canvas)`:** Takes the canvas element to know the boundaries for wrapping.
  - **`getWrappedPositions(object)`:** A helper method that takes a game object (like a `Particle` or `Player`) and returns an array of all its current positions (primary and any "ghosts" if it's in `seamless` mode).
  - **`checkCollisions(objects)`:** The main method. It will take an array of all collidable game objects. It will iterate through all pairs of objects, check for collisions between them (including their ghost positions), and dispatch events when collisions occur.
  - **Event Dispatching:** It will use a simple event emitter or `CustomEvent` to dispatch a `'collision'` event with the two colliding objects as the payload.

## 2. Refactor `Guardian.ts`

The `Guardian` will no longer check for collisions itself. Instead, it will react to collision events.

- **Remove Collision Logic:** Delete the particle collision loop from the `update` method and the `detectPlayerCollision` method.
- **Add Event Listener:** The `Guardian` will need a way to listen for `collision` events from the `CollisionManager`. When it receives an event where it is one of the colliding objects, it will trigger its "light up" effect.

## 3. Refactor `CollisionBehavior.ts`

The `CollisionBehavior` for particle-particle collisions will also be simplified.

- **Remove Collision Logic:** The `update` method will be cleared of its collision detection logic.
- **Add Event Listener:** Similar to the `Guardian`, particles with this behavior will listen for `collision` events and react accordingly (e.g., by changing direction).

## 4. Integrate into `Game.ts`

The main game loop will be updated to use the new `CollisionManager`.

- **Instantiate `CollisionManager`:** Create a single instance of the `CollisionManager`.
- **Update Game Loop:** In the main `update` function, after all objects have had their positions updated, call `collisionManager.checkCollisions()` and pass in all the relevant game objects (player, guardians, particles).

## Implementation Steps

1.  **Create `collision-system-plan.md`:** Document the plan.
2.  **Create `CollisionManager.ts`:** Build the core class.
3.  **Refactor `Guardian.ts`:** Remove old logic and add event handling.
4.  **Refactor `CollisionBehavior.ts`:** Remove old logic and add event handling.
5.  **Update `Game.ts`:** Integrate the new manager into the game loop.
6.  **Test:** Thoroughly test all collision scenarios, especially with `seamless` wrapping.
