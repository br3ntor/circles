import { Particle, ParticleBehavior } from "../game-objects";

export class FadeOutBehavior implements ParticleBehavior {
  lifespan: number;

  constructor(lifespan: number = 5) {
    this.lifespan = lifespan;
  }

  update(particle: Particle): void {
    const progress = particle.age / this.lifespan;
    if (progress >= 1) {
      particle.shouldRemove = true;
    } else {
      particle.opacity = 1 - progress;
    }
  }
}
