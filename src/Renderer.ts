import { Game } from "./game";
import { ReadyToStartState } from "./fsm/ReadyToStartState";
import { PlayingState } from "./fsm/PlayingState";
import { GameOverState } from "./fsm/GameOverState";
import { LevelCompleteState } from "./fsm/LevelCompleteState";
import { TransitionState } from "./fsm/TransitionState";
import { Vector2 } from "./game-objects";

export class Renderer {
  game: Game;
  ctx: CanvasRenderingContext2D;

  constructor(game: Game) {
    this.game = game;
    this.ctx = game.ctx;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    const state = this.game.stateMachine.currentState;

    this.game.particleSystem.draw(this.ctx);
    this.game.goal.draw(this.ctx);
    this.game.player.draw(this.ctx);
    this.game.guardians.forEach((g) => g.draw(this.ctx));

    if (state instanceof ReadyToStartState) {
      this.drawReadyUI();
    } else if (state instanceof PlayingState) {
      // Draw score or other UI during play
    } else if (state instanceof GameOverState) {
      const fadeAlpha = (state as GameOverState).fadeAlpha;
      // Fade out the game world
      this.ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      this.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

      this.drawText(
        "YOU DIED",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "100px 'Times New Roman'",
        `rgba(255, 0, 0, ${fadeAlpha})`
      );

      if (fadeAlpha >= 0.8) {
        this.drawText(
          "Click to restart",
          this.game.canvas.width / 2,
          this.game.canvas.height / 2 + 70,
          "24px 'Times New Roman'",
          "#DEDEDE"
        );
      }
    } else if (state instanceof LevelCompleteState) {
      // Optionally, draw something when level is complete before transition
    } else if (state instanceof TransitionState) {
      if (state.transitionPhase === "out") {
        this.drawReadyUI();
      }
      state.draw();
    }
  }

  drawText(text: string, x: number, y: number, font: string, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x, y);
  }

  drawReadyUI() {
    // Draw left start area barrier
    this.ctx.beginPath();
    this.ctx.moveTo(100, 0);
    this.ctx.lineTo(100, this.game.canvas.height);
    this.ctx.lineWidth = 10;
    this.ctx.strokeStyle = "#DEDEDE";
    this.ctx.stroke();
    this.ctx.closePath();

    this.drawText(
      "Click the white circle or press space bar to start the game",
      this.game.canvas.width / 2,
      this.game.canvas.height - 200,
      "26px Arial",
      "#DEDEDE"
    );
  }
  drawIrisWipe(radius: number, center: Vector2) {
    // This creates a "mask" that covers everything *except* a circle
    this.ctx.save();
    this.ctx.fillStyle = "#DEDEDE"; // Use the canvas background color

    // 1. Draw a rectangle covering the whole screen
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // 2. Create a circular path for the "hole"
    // The `true` for counter-clockwise is important for the 'evenodd' rule
    this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);

    // 3. Fill the shape. "evenodd" creates a hole where paths overlap.
    this.ctx.fill("evenodd");

    this.ctx.restore();
  }
}
