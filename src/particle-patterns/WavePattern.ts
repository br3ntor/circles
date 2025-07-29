import { Particle } from "../game-objects/index.js";
import { IPattern, PatternCreatorInput } from "./types.js";
import { WavePatternConfig } from "../config/level-configs.js";

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

      const particle = new Particle(x, y, {
        ...options,
        behaviors,
      });
      particles.push(particle);
    }
    return particles;
  }
}
