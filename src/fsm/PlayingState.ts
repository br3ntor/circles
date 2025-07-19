import { State } from "./State";
import { GameOverState } from "./GameOverState";
import { LevelCompleteState } from "./LevelCompleteState";

export class PlayingState extends State {
  public enter(): void {}

  public update(deltaTime: number): void {
    this.game.player.update(this.game.mouse);
    this.game.particleSystem.update(deltaTime, this.game.time);
    this.game.guardians.forEach((guardian) =>
      guardian.update(this.game.particleSystem.getParticles(), this.game.goal)
    );

    // Guardian collision check
    for (const guardian of this.game.guardians) {
      if (guardian.detectPlayerCollision(this.game.player)) {
        this.game.stateMachine.transitionTo(new GameOverState(this.game));
        return;
      }
    }

    // Goal is reached! Level Complete!
    if (this.game.goal.update(this.game.ctx, this.game.player)) {
      this.game.stateMachine.transitionTo(new LevelCompleteState(this.game));
      return;
    }

    // Player collided with particles and DIED!
    if (
      this.game.player.detectCollision(this.game.particleSystem.getParticles())
    ) {
      this.game.stateMachine.transitionTo(new GameOverState(this.game));
      return;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleSystem.draw(ctx);
    this.game.player.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.guardians.forEach((guardian) => guardian.draw(ctx));
  }
}
