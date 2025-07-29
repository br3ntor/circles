import { distance } from "../utils/utils.js";
import { Particle } from "./Particle.js";
import { Vector2 } from "./Vector2.js";

import { IGameObject } from "./types";

export class Player implements IGameObject {
  id: string;
  static nextId = 0;
  position: Vector2;
  speed: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius: number, color?: string) {
    this.id = `player-${Player.nextId++}`;
    this.position = new Vector2(x, y);
    this.speed = 2;
    this.radius = radius;
    this.color = color ?? "#DEDEDE";
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(mouse: { x: number; y: number }) {
    const target = new Vector2(mouse.x, mouse.y);
    const direction = target.add(this.position.multiply(-1));

    // Skip movement if too close to target
    if (direction.magnitude() <= 2) {
      this.constrainToBounds();
      return;
    }

    const normalizedDirection = direction.normalize();
    const velocity = normalizedDirection.multiply(this.speed);

    this.position = this.position.add(velocity);
    this.constrainToBounds();
  }

  private constrainToBounds() {
    this.position.x = Math.max(
      this.radius + 1,
      Math.min(innerWidth - this.radius, this.x)
    );
    this.position.y = Math.max(
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
