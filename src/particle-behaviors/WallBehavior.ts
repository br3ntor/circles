import { Particle, ParticleBehavior } from "../game-objects";

export type WallBehaviorMode =
  | "collide"
  | "teleport"
  | "seamless"
  | "wander"
  | "none";

export class WallBehavior implements ParticleBehavior {
  canvas: HTMLCanvasElement;
  mode: WallBehaviorMode;
  wanderOffset: number;

  constructor(
    canvas: HTMLCanvasElement,
    mode: WallBehaviorMode = "collide",
    wanderOffset: number = 50
  ) {
    this.canvas = canvas;
    this.mode = mode;
    this.wanderOffset = wanderOffset;
  }

  update(particle: Particle): void {
    switch (this.mode) {
      case "collide":
        this.handleWallCollision(particle);
        break;
      case "teleport":
        this.handleTeleport(particle);
        break;
      case "seamless":
        this.handleSeamless(particle);
        break;
      case "wander":
        this.handleWander(particle);
        break;
    }
  }

  private handleWallCollision(particle: Particle): void {
    if (particle.position.x - particle.radius < 0) {
      particle.velocity.x *= -1;
      particle.position.x = particle.radius;
    }
    if (particle.position.x + particle.radius > this.canvas.width) {
      particle.velocity.x *= -1;
      particle.position.x = this.canvas.width - particle.radius;
    }
    if (particle.position.y - particle.radius < 0) {
      particle.velocity.y *= -1;
      particle.position.y = particle.radius;
    }
    if (particle.position.y + particle.radius > this.canvas.height) {
      particle.velocity.y *= -1;
      particle.position.y = this.canvas.height - particle.radius;
    }
  }

  private handleTeleport(particle: Particle): void {
    // Horizontal wrapping
    if (particle.position.x - particle.radius > this.canvas.width) {
      particle.position.x = -particle.radius;
    } else if (particle.position.x + particle.radius < 0) {
      particle.position.x = this.canvas.width + particle.radius;
    }

    // Vertical wrapping
    if (particle.position.y - particle.radius > this.canvas.height) {
      particle.position.y = -particle.radius;
    } else if (particle.position.y + particle.radius < 0) {
      particle.position.y = this.canvas.height + particle.radius;
    }
  }

  private handleSeamless(particle: Particle): void {
    const { x, y } = particle.position;
    const { width, height } = this.canvas;

    if (x > width) {
      particle.position.x = 0;
    } else if (x < 0) {
      particle.position.x = width;
    }

    if (y > height) {
      particle.position.y = 0;
    } else if (y < 0) {
      particle.position.y = height;
    }
  }

  private handleWander(particle: Particle): void {
    if (
      particle.position.x - particle.radius >
      this.canvas.width + this.wanderOffset
    ) {
      particle.position.x = -this.wanderOffset - particle.radius;
    } else if (particle.position.x + particle.radius < -this.wanderOffset) {
      particle.position.x =
        this.canvas.width + this.wanderOffset + particle.radius;
    }

    if (
      particle.position.y - particle.radius >
      this.canvas.height + this.wanderOffset
    ) {
      particle.position.y = -this.wanderOffset - particle.radius;
    } else if (particle.position.y + particle.radius < -this.wanderOffset) {
      particle.position.y =
        this.canvas.height + this.wanderOffset + particle.radius;
    }
  }
}
