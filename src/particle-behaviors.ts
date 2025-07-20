import { Particle, ParticleBehavior, Vector2 } from "./game-objects";
import { distance } from "./utils";
import resolveCollision from "./elastic-collision";

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

  update(particle: Particle, deltaTime: number, time: number): void {
    // Ensure initial angle and distance are set.
    if (particle.distance === undefined) {
      const dx = particle.position.x - this.centerPoint.x;
      const dy = particle.position.y - this.centerPoint.y;
      particle.distance = Math.sqrt(dx * dx + dy * dy);
    }
    if (particle.angle === undefined || particle.angle === 0) {
      const dx = particle.position.x - this.centerPoint.x;
      const dy = particle.position.y - this.centerPoint.y;
      particle.angle = Math.atan2(dy, dx);
    }

    // Calculate current state based on particle's age, not global time
    const currentAngle = particle.angle + particle.age * this.rotationSpeed;
    const currentRadius = particle.distance + particle.age * this.growthRate;

    particle.position.x =
      this.centerPoint.x + Math.cos(currentAngle) * currentRadius;
    particle.position.y =
      this.centerPoint.y + Math.sin(currentAngle) * currentRadius;
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

  update(particle: Particle, deltaTime: number, time: number): void {
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

export type CollisionBehaviorMode = "none" | "lightUp";

export class CollisionBehavior implements ParticleBehavior {
  particles: Particle[];
  mode: CollisionBehaviorMode;

  constructor(particles: Particle[], mode: CollisionBehaviorMode = "none") {
    this.particles = particles;
    this.mode = mode;
  }

  update(particle: Particle): void {
    for (let i = 0; i < this.particles.length; i++) {
      const otherParticle = this.particles[i];
      if (particle === otherParticle) continue;

      const dist = distance(
        particle.position.x,
        particle.position.y,
        otherParticle.position.x,
        otherParticle.position.y
      );

      if (dist - particle.radius - otherParticle.radius < 0) {
        resolveCollision(particle, otherParticle);
        if (this.mode === "lightUp") {
          particle.fillOpacity = 1;
          otherParticle.fillOpacity = 1;
        }
      }
    }
  }
}

export type WallBehaviorMode = "collide" | "wrap" | "none";

export class WallBehavior implements ParticleBehavior {
  canvas: HTMLCanvasElement;
  mode: WallBehaviorMode;

  constructor(canvas: HTMLCanvasElement, mode: WallBehaviorMode = "collide") {
    this.canvas = canvas;
    this.mode = mode;
  }

  update(particle: Particle): void {
    if (this.mode === "collide") {
      if (particle.position.x - particle.radius < 0) {
        particle.velocity.x = -particle.velocity.x;
        particle.position.x = particle.radius; // Correct position
      }
      if (particle.position.x + particle.radius > this.canvas.width) {
        particle.velocity.x = -particle.velocity.x;
        particle.position.x = this.canvas.width - particle.radius; // Correct position
      }
      if (particle.position.y - particle.radius < 0) {
        particle.velocity.y = -particle.velocity.y;
        particle.position.y = particle.radius; // Correct position
      }
      if (particle.position.y + particle.radius > this.canvas.height) {
        particle.velocity.y = -particle.velocity.y;
        particle.position.y = this.canvas.height - particle.radius; // Correct position
      }
    } else if (this.mode === "wrap") {
      if (particle.position.x - particle.radius > this.canvas.width) {
        particle.position.x = -particle.radius;
      }
      if (particle.position.x + particle.radius < 0) {
        particle.position.x = this.canvas.width + particle.radius;
      }
      if (particle.position.y - particle.radius > this.canvas.height) {
        particle.position.y = -particle.radius;
      }
      if (particle.position.y + particle.radius < 0) {
        particle.position.y = this.canvas.height + particle.radius;
      }
    }
  }
}

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
