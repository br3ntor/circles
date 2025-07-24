import { State } from "./State";
import { TransitionState } from "./TransitionState";
import { GameCompleteState } from "./GameCompleteState";
import { levels } from "../level-configs";

export class LevelCompleteState extends State {
  public enter(): void {
    this.game.timer.stop();
    this.game.scoreManager.addLevelTime(this.game.timer.duration);
    this.game.timer.reset();
    this.game.guardians.forEach((g) => (g.state = "returning"));
  }

  public update(deltaTime: number): void {
    this.game.guardians.forEach((guardian) => {
      guardian.update([], this.game.goal);
    });

    if (this.game.guardians.every((g) => g.state === "returned")) {
      if (this.game.levelManager.currentLevel >= levels.length - 1) {
        this.game.stateMachine.transitionTo(new GameCompleteState(this.game));
      } else {
        this.game.levelManager.currentLevel++;
        this.game.stateMachine.transitionTo(new TransitionState(this.game));
      }
    }
  }
}
