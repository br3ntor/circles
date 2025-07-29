import { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export class RandomBehavior implements ParticleBehavior {
  intensity: number;
  turnSpeed: number;

  constructor(intensity: number = 50, turnSpeed: number = 4) {
    this.intensity = intensity;
    this.turnSpeed = turnSpeed;
  }

  update(particle: Particle, deltaTime: number): void {
    const speed = particle.velocity.magnitude();

    // Add a small random turn to the particle's angle
    particle.angle += (Math.random() - 0.5) * this.turnSpeed * deltaTime;

    // Create a new velocity vector from the angle and speed
    const newVelocity = new Vector2(
      Math.cos(particle.angle) * speed,
      Math.sin(particle.angle) * speed
    );

    // If the particle is not moving, give it an initial velocity
    if (speed === 0) {
      particle.velocity = new Vector2(
        Math.cos(particle.angle) * this.intensity,
        Math.sin(particle.angle) * this.intensity
      );
    } else {
      particle.velocity = newVelocity;
    }
  }
}
