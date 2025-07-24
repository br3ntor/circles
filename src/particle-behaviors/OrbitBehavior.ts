import { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export class OrbitBehavior implements ParticleBehavior {
  centerPoint: Vector2;
  radius: number;
  speed: number;

  constructor(centerPoint: Vector2, radius: number, speed: number = 1) {
    this.centerPoint = centerPoint;
    this.radius = radius;
    this.speed = speed;
  }

  update(particle: Particle, deltaTime: number, time: number): void {
    // Ensure angle is initialized
    if (particle.angle === undefined) {
      const dx = particle.position.x - this.centerPoint.x;
      const dy = particle.position.y - this.centerPoint.y;
      particle.angle = Math.atan2(dy, dx);
    }

    // Calculate the particle's target position in the next frame.
    const nextAngle = particle.angle + this.speed * deltaTime;
    const nextPosition = new Vector2(
      this.centerPoint.x + Math.cos(nextAngle) * this.radius,
      this.centerPoint.y + Math.sin(nextAngle) * this.radius
    );

    // Calculate the required velocity to move from the current to the next position.
    const velocity = new Vector2(
      (nextPosition.x - particle.position.x) / deltaTime,
      (nextPosition.y - particle.position.y) / deltaTime
    );

    particle.velocity = velocity;
    particle.angle = nextAngle; // Update angle for the next frame
  }
}
