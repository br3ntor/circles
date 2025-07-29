import { Particle, ParticleOptions } from "../game-objects/index.js";
import { IPattern, PatternCreatorInput } from "./types.js";
import { WavePatternConfig } from "../config/level-configs.js";
import { resolve } from "../utils/utils.js";

export class WavePattern implements IPattern {
  create(
    { particleCount, behaviors, options, canvas }: PatternCreatorInput,
    config: WavePatternConfig
  ): Particle[] {
    const particles: Particle[] = [];
    const { amplitude, frequency, yOffset, xOffset = 0 } = config;

    for (let i = 0; i < particleCount; i++) {
      const x = (i / particleCount) * canvas.width + xOffset;
      const y =
        canvas.height / 2 + yOffset + Math.sin(i * frequency) * amplitude;

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
