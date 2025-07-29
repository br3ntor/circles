import { Particle } from "../game-objects/index.js";
import { IPattern, PatternCreatorInput } from "./types.js";
import { WavePatternConfig } from "../config/level-configs.js";

export class WavePattern implements IPattern {
  create(
    { particleCount, behaviors, options, canvas }: PatternCreatorInput,
    config: WavePatternConfig
  ): Particle[] {
    const particles: Particle[] = [];
    const { sets } = config;
    const numSets = sets.length;
    const particlesPerSet = Math.floor(particleCount / numSets);

    for (let i = 0; i < numSets; i++) {
      const { amplitude, frequency, yOffset, xOffset = 0 } = sets[i];
      for (let j = 0; j < particlesPerSet; j++) {
        const x = (j / particlesPerSet) * canvas.width + xOffset;
        const y =
          canvas.height / 2 + yOffset + Math.sin(j * frequency) * amplitude;

        const particle = new Particle(x, y, {
          ...options,
          behaviors,
        });
        particles.push(particle);
      }
    }
    return particles;
  }
}
