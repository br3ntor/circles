import { init } from "./game-loop";
import { canvas, mouse, player, setWall } from "./game-state";
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
  addEventListener("click", (event: MouseEvent) => {
    const clickDistance = distance(
      event.clientX,
      event.clientY,
      player!.x,
      player!.y
    );

    // If click happens within radius of player circle, set wall to false
    if (clickDistance < player!.radius) {
      setWall(false);
    }

    /**
     * Starting some particle manipulation functions
     * triggered at the start game event
     */

    // changeParticlesSequential(particles);
    // changeParticlesConcurrent(particles);
  });

  /**
   * Events to add a mouse boost
   */
  // addEventListener("mousedown", (event) => {
  //   player.speed = 5;
  // });
  // addEventListener("mouseup", (event) => {
  //   player.speed = 2;
  // });

  /**
   * Right click event.
   * Resets the game.
   */
  addEventListener("contextmenu", (event: MouseEvent) => {
    event.preventDefault();
    init();
  });
}
