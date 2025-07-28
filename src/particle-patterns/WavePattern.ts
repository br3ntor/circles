import { Particle } from "../game-objects/index.js";
import { IPattern, PatternCreatorInput } from "./types.js";

export class WavePattern implements IPattern {
  create({
    particleCount,
    behaviors,
    options,
    canvas,
  }: PatternCreatorInput): Particle[] {
    const particles: Particle[] = [];
    const waveAmplitude = 100;
    const waveFrequency = 1;

    for (let i = 0; i < particleCount; i++) {
      const x = (i / particleCount) * canvas.width;
      const y = canvas.height / 2 + Math.sin(i * waveFrequency) * waveAmplitude;

      const particle = new Particle(x, y, {
        ...options,
        behaviors,
      });
      particles.push(particle);
    }
    return particles;
  }
}
