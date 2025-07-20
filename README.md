# Circles

A minimalist canvas game built from scratch with TypeScript, where the objective is to navigate a player-controlled circle through a field of hazardous particles to reach a portal on the other side of the screen.

## Tech Stack

- **TypeScript**
- **HTML Canvas**
- **Vite** for development and builds

## Getting Started

To run the game locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Start the development server:**
    ```bash
    pnpm dev
    ```

The game will be available at `http://localhost:5173` (or the next available port).

## Architectural Patterns

This project emphasizes clean architecture and maintainability by leveraging several key design patterns, avoiding the "God Object" anti-pattern.

### Finite State Machine (FSM)

The game's flow is managed by a robust Finite State Machine (`StateMachine`). This pattern isolates the logic for each phase of the game—such as `ReadyToStart`, `Playing`, `LevelComplete`, and `GameOver`—into distinct state classes. This makes the main game loop simpler and easier to manage, as it only needs to delegate updates to the current state.

### Separation of Concerns

The main `Game` class has been refactored to delegate responsibilities to more specialized classes:

- **`Renderer`**: Handles all drawing operations on the canvas, decoupling rendering logic from the core game logic.
- **`LevelManager`**: Manages loading, resetting, and tracking the current level, centralizing all level-related tasks.
- **`TransitionManager`**: Encapsulates the complex iris wipe transition logic, keeping it separate from other game components.

### Centralized Configuration

To avoid "magic numbers" and make the game easier to tweak, all core gameplay values (e.g., colors, entity sizes, speeds) are stored in a central `game-config.ts` file. This allows for quick adjustments to game balance and aesthetics without searching through the codebase.