import { Particle, ParticleBehavior } from "../game-objects";

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
