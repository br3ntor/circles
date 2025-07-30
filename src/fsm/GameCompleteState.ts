import { MainMenuState } from "./MainMenuState";
import { State } from "./State";

export class GameCompleteState extends State {
  private fadeAlpha: number = 0;
  public enter(): void {
    this.game.timer.stop();
  }

  public update(deltaTime: number): void {
    if (this.fadeAlpha < 1) {
      this.fadeAlpha += 0.01; // A simple fade-in speed
      this.fadeAlpha = Math.min(this.fadeAlpha, 1);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleManager.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.player.draw(ctx);
    this.game.guardians.forEach((g) => g.draw(ctx));
    this.game.uiManager.drawGameCompleteUI(
      ctx,
      this.fadeAlpha,
      this.game.canvas
    );
  }

  public handleInput(event: KeyboardEvent | MouseEvent) {
    if (this.fadeAlpha >= 0.8) {
      this.game.stateMachine.transitionTo(new MainMenuState(this.game));
    }
  }
}
