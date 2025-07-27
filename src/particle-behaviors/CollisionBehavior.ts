import resolveCollision from "../utils/elastic-collision";
import type { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export type CollisionBehaviorMode = "none" | "lightUp";

export class CollisionBehavior implements ParticleBehavior {
  mode: CollisionBehaviorMode;

  constructor(mode: CollisionBehaviorMode = "none") {
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
    resolveCollision(particle, otherParticle, position1, position2);
    if (this.mode === "lightUp") {
      particle.fillOpacity = 1;
      otherParticle.fillOpacity = 1;
    }
  }
}
