import { Particle, ParticleOptions } from "../game-objects/index.js";
import {
  distance,
  getAverageValue,
  getRandomX,
  getRandomY,
  randInt,
  Range,
  resolve,
} from "../lib/utils.js";
import { IPattern, PatternCreatorInput } from "./types.js";
import { RandomPatternConfig } from "../config/level-configs.js";

export class RandomPattern implements IPattern {
  create(
    {
      behaviors,
      options,
      canvas,
      goal,
      particleCount: pc,
    }: PatternCreatorInput,
    config: RandomPatternConfig
  ): Particle[] {
    const particles: Particle[] = [];
    const wallOffset = 105;
    let particleCount = pc;

    const resolvedRadius = resolve(options.radius);

    if (config.density) {
      const spawnableArea = (canvas.width - wallOffset) * canvas.height;
      const radiusConfig = resolvedRadius ?? 10;
      const avgRadius = getAverageValue(radiusConfig);
      const avgParticleArea = Math.PI * avgRadius * avgRadius;
      particleCount = Math.floor(
        (spawnableArea / avgParticleArea) * config.density
      );
    }

    for (let i = 0; i < particleCount; i++) {
      let radius: number;
      if (typeof resolvedRadius === "object" && resolvedRadius !== null) {
        radius = randInt(resolvedRadius.min, resolvedRadius.max);
      } else if (typeof resolvedRadius === "number") {
        radius = resolvedRadius;
      } else {
        radius = 10; // Default
      }
      let x = getRandomX(radius, wallOffset, canvas);
      let y = getRandomY(radius, canvas);

      let retries = 0;
      while (retries < 100) {
        let overlapping = false;

        // Check for overlap with other particles
        for (let j = 0; j < particles.length; j++) {
          const dist = distance(x, y, particles[j].x, particles[j].y);
          if (dist < radius + (particles[j].radius ?? 0)) {
            overlapping = true;
            break;
          }
        }

        // Check for overlap with the goal
        const goalDist = distance(x, y, goal.x, goal.y);
        if (goalDist < radius + goal.radius) {
          overlapping = true;
        }

        if (!overlapping) {
          break;
        }

        x = getRandomX(radius, wallOffset, canvas);
        y = getRandomY(radius, canvas);
        retries++;
      }

      if (retries >= 100) {
        console.log("Not enough space for circles!");
        continue;
      }

      const resolvedOptions: ParticleOptions = {
        vx: resolve(options.vx),
        vy: resolve(options.vy),
        color: resolve(options.color),
        radius,
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
