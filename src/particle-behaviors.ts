import {
  Particle,
  Particle_2,
  ParticleBehavior,
  Vector2,
} from "./game-objects";

export function rotationBehavior(
  centerX: number,
  centerY: number,
  rotationSpeed: number
): (particle: Particle) => void {
  return function (particle: Particle) {
    const dx = particle.x - centerX;
    const dy = particle.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const originalAngle = Math.atan2(dy, dx);
    const newAngle = originalAngle + rotationSpeed;
    particle.x = centerX + Math.cos(newAngle) * distance;
    particle.y = centerY + Math.sin(newAngle) * distance;
  };
}

export function velocityBehavior(particle: Particle) {
  particle.x += particle.velocity.x;
  particle.y += particle.velocity.y;
}

export class RandomMovement implements ParticleBehavior {
  intensity: number;

  constructor(intensity: number = 50) {
    this.intensity = intensity;
  }

  update(particle: Particle_2, deltaTime: number, time: number): void {
    const randomForce = new Vector2(
      (Math.random() - 0.5) * this.intensity,
      (Math.random() - 0.5) * this.intensity
    );
    particle.acceleration = randomForce;
  }
}

export class OrbitBehavior implements ParticleBehavior {
  centerPoint: Vector2;
  radius: number;
  speed: number;

  constructor(centerPoint: Vector2, radius: number, speed: number = 1) {
    this.centerPoint = centerPoint;
    this.radius = radius;
    this.speed = speed;
  }

  update(particle: Particle_2, deltaTime: number, time: number): void {
    particle.angle += this.speed * deltaTime;
    particle.position = new Vector2(
      this.centerPoint.x + Math.cos(particle.angle) * this.radius,
      this.centerPoint.y + Math.sin(particle.angle) * this.radius
    );
  }
}

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

  update(particle: Particle_2, deltaTime: number, time: number): void {
    particle.angle += this.rotationSpeed * deltaTime;
    const currentRadius = this.initialRadius + time * this.growthRate;
    particle.position = new Vector2(
      this.centerPoint.x + Math.cos(particle.angle) * currentRadius,
      this.centerPoint.y + Math.sin(particle.angle) * currentRadius
    );
  }
}

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

  update(particle: Particle_2, deltaTime: number, time: number): void {
    if (this.baseY === 0) this.baseY = particle.position.y;

    particle.position.x += this.speed * deltaTime;
    particle.position.y =
      this.baseY +
      Math.sin(particle.position.x * this.frequency) * this.amplitude;

    // Wrap around screen
    if (particle.position.x > 850) {
      particle.position.x = -50;
    }
  }
}
