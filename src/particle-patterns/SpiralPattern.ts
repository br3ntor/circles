import { Particle } from "../game-objects/index.js";
import { SpiralPatternConfig } from "../config/level-configs.js";
import { IPattern, PatternCreatorInput } from "./types.js";

export class SpiralPattern implements IPattern {
  create(
    { particleCount, behaviors, options }: PatternCreatorInput,
    config: SpiralPatternConfig
  ): Particle[] {
    const particles: Particle[] = [];
    const { spiralDensity = 4, angleStep = (Math.PI * 2) / 50 } = config;

    for (let i = 0; i < particleCount; i++) {
      const angle = i * angleStep;
      const distance = i * spiralDensity;
      const x = window.innerWidth / 2 + Math.cos(angle) * distance;
      const y = window.innerHeight / 2 + Math.sin(angle) * distance;

      const particle = new Particle(x, y, {
        ...options,
        behaviors,
        angle,
        distance,
      });
      particles.push(particle);
    }
    return particles;
  }
}
