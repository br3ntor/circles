import type { Particle, ParticleBehavior } from "../game-objects";

export type LightingBehaviorMode = "none" | "lightUp";

export class LightingBehavior implements ParticleBehavior {
  mode: LightingBehaviorMode;

  constructor(mode: LightingBehaviorMode = "lightUp") {
    this.mode = mode;
  }

  update(particle: Particle): void {
    // This behavior might have time-based lighting effects in the future
  }

  handleCollision(particle: Particle, otherParticle: Particle) {
    if (this.mode === "lightUp") {
      particle.fillOpacity = 0.8;
      otherParticle.fillOpacity = 0.8;
    }
  }
}
