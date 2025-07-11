import { init } from "./game-loop";
import {
  canvas,
  mouse,
  player,
  gameRunning,
  setGameRunning,
} from "./game-state";
import { distance } from "./utils";

export function setupEventListeners() {
  // Updates mouse state
  addEventListener("mousemove", (event: MouseEvent) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  // Resizing resets game
  addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });

  /**
   * Left click event.
   * Starts the game when player is clicked.
   */
  addEventListener("click", (event) => {
    const clickDistance = distance(
      event.clientX,
      event.clientY,
      player!.x,
      player!.y
    );

    // If click happens within radius of player circle, set wall to false
    if (clickDistance < player!.radius) {
      setGameRunning(true);
    }

    /**
     * Starting some particle manipulation functions
     * triggered at the start game event
     */

    // changeParticlesSequential(particles);
    // changeParticlesConcurrent(particles);
  });

  addEventListener("keydown", (event) => {
    if (event.key === " " || event.code === "Space") {
      if (!gameRunning) setGameRunning(true);
    }
  });

  /**
   * Events to add a mouse boost
   */
  // addEventListener("mousedown", () => {
  //   if (player !== null) player.speed = 5;
  // });
  // addEventListener("mouseup", () => {
  //   if (player !== null) player.speed = 2;
  // }); // Not sure how if i should use these, maybe as power ups or only for certain level set?

  /**
   * Right click event.
   * Resets the game.
   */
  addEventListener("contextmenu", (event: MouseEvent) => {
    event.preventDefault();
    init();
  });
}
