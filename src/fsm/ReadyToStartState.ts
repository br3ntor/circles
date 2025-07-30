import { State } from "./State";
import { PlayingState } from "./PlayingState";
import { distance } from "../lib/utils";

export class ReadyToStartState extends State {
  public enter(): void {
    // The game is already reset before entering this state.
  }

  public update(deltaTime: number): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleManager.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.player.draw(ctx);
    this.game.guardians.forEach((g) => g.draw(ctx));
    this.game.uiManager.drawReadyUI(ctx, this.game);
  }

  public handleInput(event: KeyboardEvent | MouseEvent) {
    if (
      event instanceof KeyboardEvent &&
      (event.key === " " || event.code === "Space")
    ) {
      if (!this.game.soundManager.getStarted()) {
        this.game.initAudio();
      }
      this.game.stateMachine.transitionTo(new PlayingState(this.game));
    }

    if (event instanceof MouseEvent) {
      const clickDistance = distance(
        event.clientX,
        event.clientY,
        this.game.player.x,
        this.game.player.y
      );

      if (clickDistance < this.game.player.radius) {
        if (!this.game.soundManager.getStarted()) {
          this.game.initAudio();
        }
        this.game.stateMachine.transitionTo(new PlayingState(this.game));
      }
    }
  }
}
