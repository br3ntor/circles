# Game Code Improvement Plan

Here are the top three suggested improvements for the `Game` class in `src/game.ts` to enhance its structure, maintainability, and scalability.

### 1. Implement a Finite State Machine (FSM) for Game State

**Problem:** The game's flow is currently managed by a set of boolean flags: `gameRunning`, `gameOver`, `levelComplete`, and `transitioning`. This approach can become complex and error-prone as you add more states.

**Suggestion:** Refactor the boolean flags into a more robust finite state machine. This will clarify the game's state and simplify the logic within the main `animate()` loop. Each state would encapsulate its own specific logic for updating and drawing.

**Example States:**

- `ReadyToStart`: The initial state before the game begins. Handles drawing the start message.
- `Playing`: The main game state. Runs the core game logic.
- `LevelComplete`: Triggered when the player reaches the goal. Manages the end-of-level sequence and transition.
- `GameOver`: Triggered on player collision. Handles the "YOU DIED" screen and restart logic.
- `Transitioning`: Manages the visual transition between levels.

```mermaid
graph TD
    A[ReadyToStart] -->|start()| B(Playing);
    B -->|player reaches goal| C(LevelComplete);
    B -->|player dies| D(GameOver);
    C -->|transition ends| A;
    D -->|user clicks| A;
```

### 2. Separate Concerns by Refactoring the `Game` Class

**Problem:** The `Game` class is currently a "God Object"—it manages everything from rendering and game logic to state and level management. This makes the class large, hard to read, and difficult to maintain.

**Suggestion:** Break down the `Game` class into smaller, more specialized classes, each with a single responsibility.

**Recommended Classes:**

- **`Renderer`:** This class would be responsible for all drawing operations on the canvas. It would have methods like `drawPlayer()`, `drawGuardians()`, `drawUI()`, etc.
- **`LevelManager`:** This class would handle loading, resetting, and tracking the current level.
- **`TransitionManager`:** The complex iris wipe logic could be encapsulated within its own class.

### 3. Centralize Configuration and Remove "Magic Numbers"

**Problem:** The code contains many "magic numbers" (hardcoded values) for things like UI text styling, colors, entity counts, and animation speeds.

**Suggestion:** Externalize these values into a central configuration object or file. This makes it much easier to tweak game balance, change aesthetics, or add new features without hunting through the codebase.

**Example:**
You could create a `config.ts` file:

```typescript
export const gameConfig = {
  player: {
    radius: 30,
  },
  goal: {
    width: 120,
    height: 120,
  },
  guardians: {
    count: 6,
    radius: 50,
  },
  transitions: {
    speed: 1500, // Pixels per second
  },
  ui: {
    startMessage: "Click the white circle or press space bar to start the game",
    startFont: "26px Arial",
    gameOverFont: "100px 'Times New Roman'",
    restartFont: "24px 'Times New Roman'",
    primaryColor: "#DEDEDE",
  },
};
```
