import { Vector2 } from "./Vector2.js";
import { ParticleBehavior, ParticleOptions } from "./types.js";

export class Particle {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  radius: number;
  color: string;
  behaviors: ParticleBehavior[];
  angle: number;
  centerPoint?: Vector2;
  distance?: number;
  mass: number;
  opacity: number;
  age: number;
  shouldRemove: boolean;
  fillOpacity: number;
  constructor(x: number, y: number, options: ParticleOptions = {}) {
    this.age = 0;
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(
      typeof options.vx === "function" ? options.vx() : options.vx,
      typeof options.vy === "function" ? options.vy() : options.vy
    );
    this.acceleration = new Vector2(0, 0);
    this.radius = options.radius ?? 10;
    this.color =
      typeof options.color === "function"
        ? options.color()
        : options.color ?? "white";
    this.behaviors = options.behaviors ?? [];
    this.angle = options.angle ?? 0;
    this.centerPoint = options.centerPoint;
    this.distance = options.distance;
    this.mass = options.mass ?? 1;
    this.opacity = options.opacity ?? 1;
    this.shouldRemove = false;
    this.fillOpacity = 0.02;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  update(deltaTime: number, time: number): void {
    this.age += deltaTime;

    // Fade out the fill opacity
    if (this.fillOpacity > 0.02) {
      this.fillOpacity = Math.max(0.02, this.fillOpacity - 1 * deltaTime);
    }

    // Apply acceleration before behaviors
    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));
    this.acceleration = new Vector2(0, 0);

    this.behaviors.forEach((behavior) =>
      behavior.update(this, deltaTime, time)
    );

    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  draw_old(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  draw(
    ctx: CanvasRenderingContext2D,
    positionOverride?: { x: number; y: number }
  ) {
    const x = positionOverride?.x ?? this.x;
    const y = positionOverride?.y ?? this.y;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);

    // Draw fill if it's visible
    if (this.fillOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = this.fillOpacity;
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

    // Always draw stroke
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
  }

  isAlive(): boolean {
    return !this.shouldRemove;
  }
}
