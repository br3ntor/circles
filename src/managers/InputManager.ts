import { Game } from "../game";
import { ReadyToStartState } from "../fsm/ReadyToStartState";

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

  function handleInput(event: MouseEvent | KeyboardEvent) {
    const currentState = game.stateMachine.currentState;
    if (currentState && "handleInput" in currentState) {
      (currentState as any).handleInput(event);
    }
  }

  addEventListener("click", (event) => {
    const soundIconRect = { x: 20, y: 30, width: 40, height: 30 };
    const clickX = event.clientX;
    const clickY = event.clientY;

    if (
      clickX > soundIconRect.x &&
      clickX < soundIconRect.x + soundIconRect.width &&
      clickY > soundIconRect.y &&
      clickY < soundIconRect.y + soundIconRect.height
    ) {
      if (!game.soundManager.getStarted()) {
        game.initAudio();
      }
      game.soundManager.toggleMute();
      return;
    }

    handleInput(event);
  });
  addEventListener("keydown", handleInput);

  /**
   * Right click event.
   * Resets the game.
   */
  addEventListener("contextmenu", (event: MouseEvent) => {
    event.preventDefault();
    const currentState = game.stateMachine.currentState;
    if (currentState instanceof ReadyToStartState) {
      game.reset();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      game.pause();
    } else {
      if (game.soundManager.getStarted()) {
        game.resume();
      }
    }
  });
}
