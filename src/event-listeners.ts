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
   * Left click events
   */
  addEventListener("click", (event) => {
    // If the game is over and the fade-out is complete, reset the game
    if (game.gameOver && game.fadeAlpha >= 1) {
      game.reset();
      return;
    }

    // If the game is not running, check if the player is clicked to start the game
    if (!game.gameRunning) {
      const clickDistance = distance(
        event.clientX,
        event.clientY,
        game.player.x,
        game.player.y
      );

      if (clickDistance < game.player.radius) {
        // game.gameRunning = true;
        game.start();
      }
    }
  });

  addEventListener("keydown", (event) => {
    if (event.key === " " || event.code === "Space") {
      if (!game.gameRunning) {
        game.gameRunning = true;
        game.start();
      }
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
