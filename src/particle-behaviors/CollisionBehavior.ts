import resolveCollision from "../elastic-collision";
import type { Particle, ParticleBehavior } from "../game-objects";

export type CollisionBehaviorMode = "none" | "lightUp";

export class CollisionBehavior implements ParticleBehavior {
  mode: CollisionBehaviorMode;

  constructor(mode: CollisionBehaviorMode = "none") {
    this.mode = mode;
  }

  update(particle: Particle): void {
    // Collision detection is now handled by the central CollisionManager
  }

  handleCollision(particle: Particle, otherParticle: Particle) {
    resolveCollision(particle, otherParticle);
    if (this.mode === "lightUp") {
      particle.fillOpacity = 1;
      otherParticle.fillOpacity = 1;
    }
  }
}
