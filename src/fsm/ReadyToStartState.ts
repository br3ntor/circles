import { State } from "./State";

export class ReadyToStartState extends State {
  public enter(): void {
    // The game is already reset before entering this state.
  }

  public update(deltaTime: number): void {
    // The initial state is static. Player movement is handled by the PlayingState.
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Draw all the game objects in their initial positions
    this.game.particleSystem.draw(ctx);
    this.game.player.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.guardians.forEach((guardian) => guardian.draw(ctx));

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
