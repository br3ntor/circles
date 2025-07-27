import { State } from "./State";
import { GameOverState } from "./GameOverState";
import { LevelCompleteState } from "./LevelCompleteState";
import { Player } from "../game-objects/Player";
import { Particle } from "../game-objects/Particle";
import { Guardian } from "../game-objects/Guardian";

export class PlayingState extends State {
  public enter(): void {
    this.game.timer.start();
    this.game.collisionManager.addEventListener(
      "collision",
      this.handleCollision
    );
  }

  public exit(): void {
    this.game.collisionManager.removeEventListener(
      "collision",
      this.handleCollision
    );
  }

  private handleCollision = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { object1, object2 } = customEvent.detail;

    const player = object1 instanceof Player ? object1 : object2;
    const other = object1 instanceof Player ? object2 : object1;

    if (
      player instanceof Player &&
      (other instanceof Particle || other instanceof Guardian)
    ) {
      this.game.stateMachine.transitionTo(new GameOverState(this.game, other));
    } else if (object1 instanceof Particle && object2 instanceof Particle) {
      object1.behaviors.forEach((b) => b.handleCollision?.(object1, object2));
      object2.behaviors.forEach((b) => b.handleCollision?.(object2, object1));
    }
  };

  public update(deltaTime: number): void {
    const collidables = [
      this.game.player,
      ...this.game.particleSystem.getParticles(),
      ...this.game.guardians,
    ];
    this.game.collisionManager.checkCollisions(collidables);
    this.game.player.update(this.game.mouse);
    this.game.particleSystem.update(deltaTime, this.game.time);
    this.game.guardians.forEach((guardian) =>
      guardian.update(this.game.particleSystem.getParticles(), this.game.goal)
    );

    // Goal is reached! Level Complete!
    if (this.game.goal.update(this.game.ctx, this.game.player)) {
      this.game.stateMachine.transitionTo(new LevelCompleteState(this.game));
      return;
    }
  }
}
