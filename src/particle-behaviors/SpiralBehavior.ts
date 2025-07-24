import { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export class SpiralBehavior implements ParticleBehavior {
  centerPoint: Vector2;
  initialRadius: number;
  growthRate: number;
  rotationSpeed: number;

  constructor(
    centerPoint: Vector2,
    initialRadius: number = 50,
    growthRate: number = 10,
    rotationSpeed: number = 2
  ) {
    this.centerPoint = centerPoint;
    this.initialRadius = initialRadius;
    this.growthRate = growthRate;
    this.rotationSpeed = rotationSpeed;
  }

  update(particle: Particle, deltaTime: number, time: number): void {
    // Initialize properties on the first run
    if (particle.distance === undefined) {
      particle.distance = this.initialRadius;
    }
    if (particle.angle === undefined) {
      const dx = particle.position.x - this.centerPoint.x;
      const dy = particle.position.y - this.centerPoint.y;
      particle.angle = Math.atan2(dy, dx);
    }

    // Calculate the particle's position in the next frame.
    const nextAngle =
      particle.angle + (particle.age + deltaTime) * this.rotationSpeed;
    const nextRadius =
      particle.distance + (particle.age + deltaTime) * this.growthRate;
    const nextPosition = new Vector2(
      this.centerPoint.x + Math.cos(nextAngle) * nextRadius,
      this.centerPoint.y + Math.sin(nextAngle) * nextRadius
    );

    // Calculate the required velocity to move from the current to the next position.
    const velocity = new Vector2(
      (nextPosition.x - particle.position.x) / deltaTime,
      (nextPosition.y - particle.position.y) / deltaTime
    );

    particle.velocity = velocity;
  }
}
