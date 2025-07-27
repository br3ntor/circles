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
    this.game.collisionManager.addEventListener(
      "particle-goal-collision",
      this.handleParticleGoalCollision
    );
  }

  public exit(): void {
    this.game.collisionManager.removeEventListener(
      "collision",
      this.handleCollision
    );
    this.game.collisionManager.removeEventListener(
      "particle-goal-collision",
      this.handleParticleGoalCollision
    );
  }

  private handleCollision = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { object1, object2, position1, position2 } = customEvent.detail;

    const player = object1 instanceof Player ? object1 : object2;
    const other = object1 instanceof Player ? object2 : object1;

    if (
      player instanceof Player &&
      (other instanceof Particle || other instanceof Guardian)
    ) {
      this.game.stateMachine.transitionTo(
        new GameOverState(this.game, other, position1)
      );
    } else if (object1 instanceof Particle && object2 instanceof Particle) {
      object1.behaviors.forEach((b) =>
        b.handleCollision?.(object1, object2, position1, position2)
      );
      object2.behaviors.forEach((b) =>
        b.handleCollision?.(object2, object1, position2, position1)
      );
    }
  };

  private handleParticleGoalCollision = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { particle, goal } = customEvent.detail;

    // 1. Calculate collision normal
    const normal = particle.position.subtract(goal.position).normalize();

    // 2. Calculate relative velocity
    const relativeVelocity = particle.velocity;

    // 3. Calculate impulse
    const impulse = normal.multiply(-2 * relativeVelocity.dot(normal));

    // 4. Apply impulse to particle's velocity
    particle.velocity = particle.velocity.add(impulse);

    // 5. Reposition particle to avoid sticking
    const overlap =
      particle.radius +
      goal.radius -
      particle.position.distanceTo(goal.position);
    if (overlap > 0) {
      particle.position = particle.position.add(normal.multiply(overlap));
    }
  };

  public update(deltaTime: number): void {
    const collidables = [
      this.game.player,
      ...this.game.particleSystem.getParticles(),
      ...this.game.guardians,
    ];
    this.game.collisionManager.checkCollisions(collidables, this.game.goal);
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
