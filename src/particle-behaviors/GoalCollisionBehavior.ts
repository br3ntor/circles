import { IBehavior } from "../managers/BehaviorManager";
import { IGameObject } from "../game-objects/types";
import { Vector2 } from "../game-objects/Vector2";
import { Goal } from "../game-objects/Goal";
import { Particle } from "../game-objects/Particle";

export class GoalCollisionBehavior implements IBehavior {
  constructor(private bounce: boolean = true) {}

  update(gameObject: IGameObject, deltaTime: number, time: number): void {
    // No update logic needed for this behavior
  }

  handleCollision(
    gameObject: IGameObject,
    other: IGameObject,
    position: Vector2,
    otherPosition: Vector2
  ): void {
    if (!this.bounce) return;

    const particle = gameObject as Particle;
    const goal = other as Goal;

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
  }
}
