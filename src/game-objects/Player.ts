import { distance } from "../utils.js";
import { Particle } from "./Particle.js";

export class Player {
  x: number;
  y: number;
  speed: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius: number, color?: string) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = radius;
    this.color = color ?? "#DEDEDE";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(mouse: { x: number; y: number }) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

    // Skip movement if too close to target
    if (Math.abs(dx) <= 2 && Math.abs(dy) <= 2) {
      this.constrainToBounds();
      return;
    }

    const angle = Math.atan2(dy, dx);
    const xVelocity = Math.cos(angle) * this.speed;
    const yVelocity = Math.sin(angle) * this.speed;

    this.x += xVelocity;
    this.y += yVelocity;
    this.constrainToBounds();
  }

  private constrainToBounds() {
    this.x = Math.max(
      this.radius + 1,
      Math.min(innerWidth - this.radius, this.x)
    );
    this.y = Math.max(
      this.radius + 1,
      Math.min(innerHeight - this.radius, this.y)
    );
  }

  detectCollision(particles: Particle[]): boolean {
    for (const particle of particles) {
      const dist = distance(this.x, this.y, particle.x, particle.y);
      if (dist - this.radius - particle.radius <= 0) {
        particle.fillOpacity = 1;
        return true;
      }
    }
    return false;
  }
}
