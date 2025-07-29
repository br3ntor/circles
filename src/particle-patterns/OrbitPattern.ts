import { Particle, ParticleOptions } from "../game-objects/index.js";
import { resolve } from "../lib/utils.js";
import { IPattern, PatternCreatorInput } from "./types.js";

export class OrbitPattern implements IPattern {
  create({
    particleCount,
    behaviors,
    options,
    canvas,
  }: PatternCreatorInput): Particle[] {
    const particles: Particle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 200 + 50;
      const angle = Math.random() * Math.PI * 2;

      const resolvedOptions: ParticleOptions = {
        ...options,
        vx: resolve(options.vx),
        vy: resolve(options.vy),
        color: resolve(options.color),
        radius: resolve(options.radius),
        behaviors,
        angle: resolve(options.angle),
        centerPoint: resolve(options.centerPoint),
        distance: resolve(options.distance),
        mass: resolve(options.mass),
        opacity: resolve(options.opacity),
      };

      const particle = new Particle(
        centerX + Math.cos(angle) * r,
        centerY + Math.sin(angle) * r,
        resolvedOptions
      );
      particles.push(particle);
    }
    return particles;
  }
}
