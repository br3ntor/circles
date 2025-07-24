import { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export class RandomMovement implements ParticleBehavior {
  intensity: number;

  constructor(intensity: number = 50) {
    this.intensity = intensity;
  }

  update(particle: Particle, deltaTime: number, time: number): void {
    const randomForce = new Vector2(
      (Math.random() - 0.5) * this.intensity,
      (Math.random() - 0.5) * this.intensity
    );
    particle.acceleration = randomForce;
  }
}
