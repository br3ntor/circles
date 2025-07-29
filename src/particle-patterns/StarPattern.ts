import { Particle, ParticleOptions } from "../game-objects/index.js";
import { resolve } from "../lib/utils.js";
import { IPattern, PatternCreatorInput } from "./types.js";

export class StarPattern implements IPattern {
  create({
    particleCount,
    behaviors,
    options,
    canvas,
  }: PatternCreatorInput): Particle[] {
    const particles: Particle[] = [];
    const numArms = 5;
    const armLength = 200;

    for (let i = 0; i < particleCount; i++) {
      const armIndex = i % numArms;
      const angle = (armIndex * (Math.PI * 2)) / numArms;
      const distance = (i / particleCount) * armLength;
      const x = canvas.width / 2 + Math.cos(angle) * distance;
      const y = canvas.height / 2 + Math.sin(angle) * distance;

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

      const particle = new Particle(x, y, resolvedOptions);
      particles.push(particle);
    }
    return particles;
  }
}
