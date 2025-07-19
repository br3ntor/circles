import { State } from "./State";

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

  public exit(): void {
    this.fadeAlpha = 0;
  }
}
