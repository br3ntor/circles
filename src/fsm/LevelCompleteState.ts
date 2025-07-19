import { State } from "./State";
import { TransitionState } from "./TransitionState";

export class LevelCompleteState extends State {
  public enter(): void {
    this.game.guardians.forEach((g) => (g.state = "returning"));
  }

  public update(deltaTime: number): void {
    this.game.guardians.forEach((guardian) => {
      guardian.update([], this.game.goal);
    });

    if (this.game.guardians.every((g) => g.state === "returned")) {
      this.game.stateMachine.transitionTo(new TransitionState(this.game));
    }
  }
}
