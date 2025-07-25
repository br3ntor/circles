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

  update(particle: Particle, deltaTime: number): void {
    // Initialize properties on the first run
    if (particle.distance === undefined) {
      particle.distance = this.initialRadius;
    }
    if (particle.angle === undefined) {
      const dx = particle.position.x - this.centerPoint.x;
      const dy = particle.position.y - this.centerPoint.y;
      particle.angle = Math.atan2(dy, dx);
    }

    // Calculate current spiral properties
    const r = particle.distance + particle.age * this.growthRate;
    const theta = particle.angle + particle.age * this.rotationSpeed;

    // Calculate radial and tangential velocities
    const vr = this.growthRate; // Velocity of radius growth
    const vt = r * this.rotationSpeed; // Tangential velocity

    // Convert polar velocity to Cartesian velocity
    const vx = vr * Math.cos(theta) - vt * Math.sin(theta);
    const vy = vr * Math.sin(theta) + vt * Math.cos(theta);

    particle.velocity = new Vector2(vx, vy);
  }
}
