import { Particle } from "../game-objects/index.js";
import { distance, getRandomX, getRandomY } from "../utils/utils.js";
import { IPattern, PatternCreatorInput } from "./types.js";

export class RandomPattern implements IPattern {
  create({
    particleCount,
    behaviors,
    options,
    canvas,
  }: PatternCreatorInput): Particle[] {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = options.radius ?? 10;
      let x = getRandomX(radius, 105, canvas);
      let y = getRandomY(radius, canvas);

      if (i !== 0) {
        let retries = 0;
        for (let j = 0; j < particles.length; j++) {
          if (retries > 100) {
            console.log("Not enough space for circles!");
            break;
          }
          const dist = distance(x, y, particles[j].x, particles[j].y);
          if (dist - radius - particles[j].radius < 0) {
            x = getRandomX(radius, 105, canvas);
            y = getRandomY(radius, canvas);
            j = -1; // restart the check
            retries++;
          }
        }
      }

      const particle = new Particle(x, y, {
        ...options,
        behaviors,
      });
      particles.push(particle);
    }
    return particles;
  }
}
