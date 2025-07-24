# Plan for Refactoring the Pattern and Behavior System

This document outlines a plan to refactor and improve the pattern and behavior system in the game. The plan is based on the analysis provided and is divided into three phases.

## Phase 1: Improve Type Safety

This is the most critical part, as it will make the system more robust and maintainable.

- **1.1: Create discriminated unions for `BehaviorConfig` in `src/level-configs.ts`.**

  - Define specific config types for each behavior (e.g., `WallBehaviorConfig`, `SpiralBehaviorConfig`).
  - Create a `BehaviorConfig` discriminated union from these types.

- **1.2: Create type-safe configuration for each pattern in `src/level-configs.ts`.**

  - Define specific config types for each pattern (e.g., `SpiralPatternConfig`).
  - Create a `PatternConfigMap` to map pattern names to their config types.
  - Update `LevelConfig` to use generics for `patternConfig`.

- **1.3: Update `_createBehaviorsFromConfig` in `src/game-objects.ts` to use the new type-safe `BehaviorConfig`.**

  - Use a `switch` statement on `config.type` to leverage type narrowing.
  - Pass the correct, type-safe properties to the behavior constructors.

- **1.4: Update pattern creation methods in `src/game-objects.ts` to use the new type-safe `patternConfig`.**
  - Cast the `patternConfig` to the correct type within each `create<PatternName>Pattern` method.

## Phase 2: Refactor to Object-Oriented Patterns

This will improve the structure and scalability of the pattern creation system.

- **2.1: Define a `Pattern` interface in a new file `src/patterns/Pattern.ts`.**

  - The interface will have a `createParticles` method.

- **2.2: Create a class for each pattern (e.g., `SpiralPattern`, `RandomPattern`) in new files under `src/patterns/`.**

  - Each class will implement the `Pattern` interface.
  - The logic from the `create<PatternName>Pattern` methods will be moved into the `createParticles` method of the corresponding class.

- **2.3: Update `ParticleSystem` in `src/game-objects.ts` to use the new pattern classes.**
  - The `patterns` property in `ParticleSystem` will be a map of pattern names to `Pattern` instances.
  - The `createPattern` method will be updated to use the new pattern classes.

## Phase 3: Optional Enhancements

These are ideas for future development that we can plan for now.

- **3.1: Plan for a runtime debug panel to modify patterns and behaviors.**

  - This would allow for live experimentation with different patterns and behaviors.
  - The panel could export the configuration to JSON.

- **3.2: Plan for dynamically chaining/stacking behaviors at runtime.**
  - This would allow for more complex and emergent behaviors.
  - For example, a particle could gain a new behavior when it collides with another particle.
