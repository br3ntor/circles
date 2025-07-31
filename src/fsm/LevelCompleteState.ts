import { State } from "./State";
import { TransitionState } from "./TransitionState";
import { GameCompleteState } from "./GameCompleteState";
import { levels } from "../config/level-configs";

export class LevelCompleteState extends State {
  public enter(): void {
    this.game.soundManager.playSound("level-complete");
    this.game.timer.stop();
    this.game.scoreManager.addLevelTime(this.game.timer.duration);
    this.game.timer.reset();
    this.game.guardians.forEach((g) => (g.state = "returning"));
  }

  public update(deltaTime: number, time: number): void {
    // Iterates the data for the next frame in the animation
    // which in this case the guardians will spiral back to the center
    // ignoring any particle processing for collisions etc.
    this.game.guardians.forEach((guardian) => {
      guardian.update(deltaTime, this.game.time);
    });

    // Once the animation is completed we can move on to the next state of the game.
    if (this.game.guardians.every((g) => g.state === "returned")) {
      if (this.game.levelManager.currentLevel >= levels.length - 1) {
        this.game.stateMachine.transitionTo(new GameCompleteState(this.game));
      } else {
        this.game.levelManager.currentLevel++;
        this.game.stateMachine.transitionTo(new TransitionState(this.game));
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleManager.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.player.draw(ctx);
    this.game.guardians.forEach((g) => g.draw(ctx));
  }
}
