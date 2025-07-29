import { Game } from "../game";
import { distance } from "../lib/utils";
import { ReadyToStartState } from "../fsm/ReadyToStartState";
import { PlayingState } from "../fsm/PlayingState";
import { GameOverState } from "../fsm/GameOverState";

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

    const currentState = game.stateMachine.currentState;

    if (currentState instanceof GameOverState) {
      // Only allow restart after the fade-in is mostly complete
      if (currentState.fadeAlpha >= 0.8) {
        game.reset();
      }
      return;
    }

    if (currentState instanceof ReadyToStartState) {
      const clickDistance = distance(
        event.clientX,
        event.clientY,
        game.player.x,
        game.player.y
      );

      if (clickDistance < game.player.radius) {
        if (!game.soundManager.getStarted()) {
          game.initAudio();
        }
        game.stateMachine.transitionTo(new PlayingState(game));
      }
    }
  });

  addEventListener("keydown", (event) => {
    const currentState = game.stateMachine.currentState;
    if (event.key === " " || event.code === "Space") {
      if (currentState instanceof ReadyToStartState) {
        if (!game.soundManager.getStarted()) {
          game.initAudio();
        }
        game.stateMachine.transitionTo(new PlayingState(game));
      }
      if (currentState instanceof GameOverState) {
        // Only allow restart after the fade-in is mostly complete
        if (currentState.fadeAlpha >= 0.8) {
          game.reset();
        }
        return;
      }
    }
  });

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
