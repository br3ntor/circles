import { State } from "./State";
import { ReadyToStartState } from "./ReadyToStartState";

export class GameOverState extends State {
  public fadeAlpha: number = 0;

  public enter(): void {
    // The logic to fade in the game over screen will be handled in the draw method.
  }

  public update(deltaTime: number): void {
    if (this.fadeAlpha < 1) {
      this.fadeAlpha += 0.01; // A simple fade-in speed
      this.fadeAlpha = Math.min(this.fadeAlpha, 1);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Draw the underlying game state
    this.game.particleSystem.draw(ctx);
    this.game.player.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.guardians.forEach((guardian) => guardian.draw(ctx));

    // Fade out the game world
    ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeAlpha})`;
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // Draw "YOU DIED" message
    ctx.fillStyle = `rgba(255, 0, 0, ${this.fadeAlpha})`;
    ctx.font = "100px 'Times New Roman'";
    ctx.textAlign = "center";
    ctx.fillText(
      "YOU DIED",
      this.game.canvas.width / 2,
      this.game.canvas.height / 2
    );

    // Draw restart message
    if (this.fadeAlpha >= 0.8) {
      ctx.fillStyle = "white";
      ctx.font = "24px 'Times New Roman'";
      ctx.fillText(
        "Click to restart",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 60
      );
    }
  }

  public exit(): void {
    this.fadeAlpha = 0;
  }
}
