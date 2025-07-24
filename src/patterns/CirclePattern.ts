import { Particle } from "../game-objects";
import { IPattern, PatternCreatorInput } from "./types.js";

export class CirclePattern implements IPattern {
  create({
    particleCount,
    behaviors,
    options,
    canvas,
  }: PatternCreatorInput): Particle[] {
    const particles: Particle[] = [];
    const circleRadius = 150;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * (Math.PI * 2);
      const x = canvas.width / 2 + Math.cos(angle) * circleRadius;
      const y = canvas.height / 2 + Math.sin(angle) * circleRadius;

      const particle = new Particle(x, y, {
        ...options,
        behaviors,
      });
      particles.push(particle);
    }
    return particles;
  }
}
