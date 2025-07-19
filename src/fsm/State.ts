import type { Game } from "../game";

export abstract class State {
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public enter(): void {}
  public exit(): void {}
  public abstract update(deltaTime: number): void;
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  protected drawReadyUI(ctx: CanvasRenderingContext2D): void {
    // Draw left start area barrier
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, this.game.canvas.height);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#DEDEDE";
    ctx.stroke();
    ctx.closePath();

    // Draw startup message
    ctx.fillStyle = "#DEDEDE";
    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Click the white circle or press space bar to start the game",
      this.game.canvas.width / 2,
      this.game.canvas.height - 200
    );
  }
}
