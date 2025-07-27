import { Game } from "./game";
import { ReadyToStartState } from "./fsm/ReadyToStartState";
import { PlayingState } from "./fsm/PlayingState";
import { GameOverState } from "./fsm/GameOverState";
import { LevelCompleteState } from "./fsm/LevelCompleteState";
import { TransitionState } from "./fsm/TransitionState";
import { UIManager } from "./UIManager";
import { GameCompleteState } from "./fsm/GameCompleteState";

export class Renderer {
  game: Game;
  ctx: CanvasRenderingContext2D;
  uiManager: UIManager;

  constructor(game: Game) {
    this.game = game;
    this.ctx = game.ctx;
    this.uiManager = UIManager.getInstance();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    const state = this.game.stateMachine.currentState;

    this.game.particleSystem.draw(this.ctx);
    this.game.goal.draw(this.ctx);
    this.game.player.draw(this.ctx);
    this.game.guardians.forEach((g) => g.draw(this.ctx));

    if (state instanceof ReadyToStartState) {
      this.uiManager.drawReadyUI(this.ctx, this.game);
    } else if (state instanceof PlayingState) {
      this.uiManager.drawTimer(this.ctx);
    } else if (state instanceof GameOverState) {
      const { fadeAlpha, collidedObject } = state;

      // Draw a glowing effect around the collided object
      if (collidedObject) {
        this.ctx.save();
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = "red";
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 3;
        const positions =
          this.game.collisionManager.getWrappedPositions(collidedObject);
        for (const pos of positions) {
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y, collidedObject.radius + 5, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      this.uiManager.drawGameOverUI(this.ctx, fadeAlpha, this.game.canvas);
    } else if (state instanceof LevelCompleteState) {
      // Optionally, draw something when level is complete before transition
    } else if (state instanceof TransitionState) {
      if (state.transitionPhase === "out") {
        this.uiManager.drawReadyUI(this.ctx, this.game);
      }
      state.draw();
    } else if (state instanceof GameCompleteState) {
      this.uiManager.drawFinalScore(this.ctx);
    }
  }
}
