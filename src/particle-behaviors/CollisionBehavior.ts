import resolveCollision from "../utils/elastic-collision";
import type { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export type CollisionBehaviorMode = "none" | "repel" | "resolve";

export class CollisionBehavior implements ParticleBehavior {
  mode: CollisionBehaviorMode;

  constructor(mode: CollisionBehaviorMode = "resolve") {
    this.mode = mode;
  }

  update(particle: Particle): void {
    // Collision detection is now handled by the central CollisionManager
  }

  handleCollision(
    particle: Particle,
    otherParticle: Particle,
    position1: Vector2,
    position2: Vector2
  ) {
    if (this.mode === "resolve") {
      resolveCollision(particle, otherParticle, position1, position2);
    } else if (this.mode === "repel") {
      // Apply a gentle repulsion force instead of an instant resolution
      const repulsionStrength = 10; // Adjust as needed
      const direction = position1.subtract(position2).normalize();
      const force = direction.multiply(repulsionStrength);
      particle.velocity = particle.velocity.add(force);
      otherParticle.velocity = otherParticle.velocity.subtract(force);
    }
  }
}
