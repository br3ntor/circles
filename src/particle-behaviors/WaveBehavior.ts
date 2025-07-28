import { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export class WaveBehavior implements ParticleBehavior {
  private amplitude: number;
  private frequency: number;
  private speed: number;
  private baseY: number;
  private canvas: HTMLCanvasElement;

  private static readonly WAVE_OFFSET = 50;

  constructor(
    canvas: HTMLCanvasElement,
    amplitude: number = 50,
    frequency: number = 0.02,
    speed: number = 100
  ) {
    this.canvas = canvas;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.speed = speed;
    this.baseY = 0;
  }

  update(particle: Particle, deltaTime: number): void {
    if (this.baseY === 0) this.baseY = particle.position.y;

    let nextX = particle.position.x + this.speed * deltaTime;
    const nextY =
      this.baseY + Math.sin(nextX * this.frequency) * this.amplitude;

    if (nextX > this.canvas.width + WaveBehavior.WAVE_OFFSET) {
      nextX = -WaveBehavior.WAVE_OFFSET;
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
