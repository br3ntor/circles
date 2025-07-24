import { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export class WaveBehavior implements ParticleBehavior {
  amplitude: number;
  frequency: number;
  speed: number;
  baseY: number;

  constructor(
    amplitude: number = 50,
    frequency: number = 0.02,
    speed: number = 100
  ) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.speed = speed;
    this.baseY = 0;
  }

  update(particle: Particle, deltaTime: number, time: number): void {
    if (this.baseY === 0) this.baseY = particle.position.y;

    // Calculate the target position for the next frame
    let nextX = particle.position.x + this.speed * deltaTime;
    const nextY =
      this.baseY + Math.sin(nextX * this.frequency) * this.amplitude;

    // Wrap around screen
    if (nextX > 850) {
      nextX = -50;
    }

    const nextPosition = new Vector2(nextX, nextY);

    // Calculate the required velocity
    const velocity = new Vector2(
      (nextPosition.x - particle.position.x) / deltaTime,
      (nextPosition.y - particle.position.y) / deltaTime
    );

    particle.velocity = velocity;
  }
}
