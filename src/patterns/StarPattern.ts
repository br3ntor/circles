import { Particle } from "../game-objects";
import { IPattern, PatternCreatorInput } from "./Pattern";

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

      const particle = new Particle(x, y, {
        ...options,
        color: options.color,
        behaviors,
      });
      particles.push(particle);
    }
    return particles;
  }
}
