import { Game } from "./game";
import { distance } from "./utils";
import { ReadyToStartState } from "./fsm/ReadyToStartState";
import { PlayingState } from "./fsm/PlayingState";
import { GameOverState } from "./fsm/GameOverState";
import { Guardian, Particle, Player } from "./game-objects";
import { CollisionBehavior } from "./particle-behaviors";

export function setupEventListeners(game: Game) {
  game.collisionManager.addEventListener("collision", (event: Event) => {
    const customEvent = event as CustomEvent;
    const { object1, object2 } = customEvent.detail;

    if (object1 instanceof Player || object2 instanceof Player) {
      const collidedObject = (object1 instanceof Player ? object2 : object1) as
        | Particle
        | Guardian;
      game.stateMachine.transitionTo(new GameOverState(game, collidedObject));
      return;
    }

    if (object1 instanceof Guardian || object2 instanceof Guardian) {
      const guardian = (
        object1 instanceof Guardian ? object1 : object2
      ) as Guardian;
      const other = object1 instanceof Guardian ? object2 : object1;
      if (!(other instanceof Guardian)) {
        guardian.handleCollision(other);
      }
    }

    const p1 = object1 instanceof Particle ? object1 : null;
    const p2 = object2 instanceof Particle ? object2 : null;

    if (p1 && p2) {
      const behavior1 = p1.behaviors.find(
        (b): b is CollisionBehavior => b instanceof CollisionBehavior
      );
      const behavior2 = p2.behaviors.find(
        (b): b is CollisionBehavior => b instanceof CollisionBehavior
      );

      if (behavior1) {
        behavior1.handleCollision(p1, p2);
      } else if (behavior2) {
        behavior2.handleCollision(p2, p1);
      }
    }
  });
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
        game.stateMachine.transitionTo(new PlayingState(game));
      }
    }
  });

  addEventListener("keydown", (event) => {
    const currentState = game.stateMachine.currentState;
    if (event.key === " " || event.code === "Space") {
      if (currentState instanceof ReadyToStartState) {
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
      game.resume();
    }
  });
}
