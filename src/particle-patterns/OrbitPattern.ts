import { Particle } from "../game-objects/index.js";
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
      const particle = new Particle(
        centerX + Math.cos(angle) * r,
        centerY + Math.sin(angle) * r,
        {
          ...options,
          behaviors,
        }
      );
      particles.push(particle);
    }
    return particles;
  }
}
