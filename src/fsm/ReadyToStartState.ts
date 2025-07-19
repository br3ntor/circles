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

    this.drawReadyUI(ctx);
  }
}
