import { Game } from "./game";
import { distance } from "./utils";

export function setupEventListeners(game: Game) {
  // Updates mouse state
  addEventListener("mousemove", (event: MouseEvent) => {
    game.mouse.x = event.clientX;
    game.mouse.y = event.clientY;
  });

  // Resizing resets game
  addEventListener("resize", () => {
    game.canvas.width = innerWidth;
    game.canvas.height = innerHeight;
    game.reset();
  });

  /**
   * Left click event.
   * Starts the game when player is clicked.
   */
  addEventListener("click", (event) => {
    const clickDistance = distance(
      event.clientX,
      event.clientY,
      game.player.x,
      game.player.y
    );

    // If click happens within radius of player circle, set wall to false
    if (clickDistance < game.player.radius) {
      game.gameRunning = true;
    }
  });

  addEventListener("keydown", (event) => {
    if (event.key === " " || event.code === "Space") {
      if (!game.gameRunning) game.gameRunning = true;
    }
  });

  /**
   * Right click event.
   * Resets the game.
   */
  addEventListener("contextmenu", (event: MouseEvent) => {
    event.preventDefault();
    game.reset();
  });
}
