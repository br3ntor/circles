# Project Roadmap

This document outlines the future plans and desired features for the game.

## High-Level Goals

- [ ] **MVP Definition**: Complete a basic set of levels and evaluate what else is needed for a minimum viable product.

## Gameplay Enhancements

- [x] **Re-enable Particle Patterns**: Restore the `createSpiralPattern`, `createStarPattern`, `createCirclePattern`, `createWavePattern`, and `createOrbitPattern` functions in `src/game-objects.ts` to enable more complex and visually interesting levels.
- [x] **Points System**: Implement a scoring system based on the speed of level completion.
- [ ] **Player Abilities/Power-ups**: Add special abilities for the player, such as a temporary speed boost or invisibility.
- [ ] **Enhanced Guardian-Particle Interactions**: Make guardian collisions with particles more dynamic, causing different effects beyond just lighting up.
- [ ] **Life System**: Implement a life system to track player lives.
- [ ] **Configurable Guardian Behaviors**: Implement a system to add a variety of behaviors to guardians, similar to the particle behavior system.
  - [ ] **Movement Patterns**: Add different movement patterns (e.g., clockwise, counter-clockwise, custom paths).
  - [ ] **Collision Logic**: Allow guardians to have configurable collision (e.g., collide with particles, ignore them).
  - [ ] **Starting Formations**: Create different starting patterns for guardians.
- [ ] **Particle Size Animation**: Add particle behaviors for growing or shrinking in size over time or on events.

## UI/UX Improvements

- [ ] **Start Screen**: Create a dedicated start screen for the game.
- [ ] **Heads-Up Display (HUD)**:
  - [ ] Display the current level number.
  - [ ] Show the player's remaining lives.
- [ ] **Level Transition Display**: Show the level number in the center of the screen during the transition animation.
- [ ] **Configurable Color Schemes**: Implement a system for defining and switching between different color palettes for the game.

## Game Modes

- [ ] **Survival Mode**: A time-based mode where the player must dodge an ever-increasing number of particles for as long as possible.
- [ ] **Acceleration Mode**: A variation of the standard level-based game where the speed of all game elements (player, particles, etc.) increases with each completed level.

## Features

- [ ] **High Score Scoreboard**: Add a persistent high score board. (Backend can be implemented later).
- [ ] **Discord Integration**: Allow users to sign in with Discord to use their avatar in-game.

## Level Design

- [ ] **Add More Levels**: With the restored particle patterns, design and implement a variety of new levels that challenge the player in different ways.

## Code Refactoring

- [x] **Split `game-objects.ts`**: Refactor the monolithic `src/game-objects.ts` file into smaller, more focused modules (e.g., `player.ts`, `particle.ts`, `guardian.ts`, etc.) to improve code navigation and maintainability.
- [ ] **Review Collision Detection**: Investigate collision detection functions to ensure they follow a consistent and efficient pattern.

## Architectural & Systems Improvements (Future Considerations)

- [x] **UI Management System**: Create a dedicated `UIManager` to handle rendering and input for all UI elements (HUD, menus, etc.) to keep UI logic separate from game logic.
- [ ] **Advanced Particle Lighting System**: Enhance the particle lighting system to be more configurable, allowing for different behaviors and animated light patterns.
- [ ] **Centralized Event System (Event Bus)**: Implement an event bus to decouple systems. This allows objects to communicate through events (e.g., `PLAYER_DIED`, `LEVEL_COMPLETE`) without direct dependencies, making the codebase more modular and easier to extend.
- [ ] **Robust Input Handler**: Develop a central `InputManager` to process raw browser inputs (keyboard, mouse) and translate them into game-specific actions, simplifying input handling throughout the application.
- [ ] **Audio Manager**: Create a simple `AudioManager` to control loading and playback of sound effects and music, centralizing all audio-related functionality.
  - [ ] Implement sound effects for key game events (e.g., particle collision, level complete, player death).
- [ ] **Decouple Particle Creation with Emitters**: Refactor the particle creation logic by introducing an "Emitter" or "Generator" system. Each pattern (e.g., spiral, wave) will have its own Emitter class responsible for generating particle positions and initial properties. This will decouple the `ParticleSystem` from the specific creation logic, making the architecture more modular, flexible, and easier to extend with new patterns.
  - [ ] Emitters could be attached to game objects like guardians, allowing them to "shoot" particles.
- [ ] **Runtime Debug Panel**: Create a debug panel to modify patterns and behaviors at runtime.
- [ ] **Dynamic Behavior Chaining**: Allow behaviors to be chained or stacked dynamically at runtime for more complex interactions.
