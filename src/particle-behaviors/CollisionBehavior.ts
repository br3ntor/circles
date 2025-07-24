import { Particle, ParticleBehavior } from "../game-objects";
import { distance } from "../utils";
import resolveCollision from "../elastic-collision";

export type CollisionBehaviorMode = "none" | "lightUp";

export class CollisionBehavior implements ParticleBehavior {
  particles: Particle[];
  mode: CollisionBehaviorMode;

  constructor(particles: Particle[], mode: CollisionBehaviorMode = "none") {
    this.particles = particles;
    this.mode = mode;
  }

  update(particle: Particle): void {
    for (let i = 0; i < this.particles.length; i++) {
      const otherParticle = this.particles[i];
      if (particle === otherParticle) continue;

      const dist = distance(
        particle.position.x,
        particle.position.y,
        otherParticle.position.x,
        otherParticle.position.y
      );

      if (dist - particle.radius - otherParticle.radius < 0) {
        resolveCollision(particle, otherParticle);
        if (this.mode === "lightUp") {
          particle.fillOpacity = 1;
          otherParticle.fillOpacity = 1;
        }
      }
    }
  }
}
