import { State } from "./State";

export class GameCompleteState extends State {
  public enter(): void {
    this.game.timer.stop();
  }

  public update(deltaTime: number): void {
    // In a real game, you might have a "click to restart" or "back to main menu" option here.
  }
}
