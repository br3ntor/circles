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
    const wallOffset = 105;
    let particleCount = pc;

    const resolvedRadius = resolve(options.radius);

    if (config.density) {
      particleCount = this.calculateParticleCount(
        canvas,
        wallOffset,
        resolvedRadius,
        config.density
      );
    }

    // Use simple random placement for better distribution
    if (config.density && config.density > 0.05) {
      return this.createWithPoissonSampling(
        canvas,
        wallOffset,
        goal,
        behaviors,
        options,
        resolvedRadius,
        particleCount
      );
    }

    // Fall back to retry method for lower densities
    return this.createWithRetryMethod(
      canvas,
      wallOffset,
      goal,
      behaviors,
      options,
      resolvedRadius,
      particleCount
    );
  }

  private calculateParticleCount(
    canvas: HTMLCanvasElement,
    wallOffset: number,
    resolvedRadius: number | Range | null | undefined,
    density: number
  ): number {
    const spawnableArea = (canvas.width - wallOffset) * canvas.height;
    const radiusConfig = resolvedRadius ?? 10;
    const avgRadius = getAverageValue(radiusConfig);

    // Account for spacing between particles and packing efficiency
    const minSpacing = avgRadius * 0.5; // Minimum gap between particles
    const effectiveRadius = avgRadius + minSpacing;
    const effectiveArea = Math.PI * effectiveRadius * effectiveRadius;

    // Circle packing efficiency is roughly 0.9069 for optimal packing
    // But with random placement, we get much lower efficiency (~0.64)
    // We'll use a more conservative 0.5 to account for gaps and navigation space
    const packingEfficiency = 0.5;

    const maxPossibleParticles = Math.floor(
      (spawnableArea * packingEfficiency) / effectiveArea
    );

    return Math.floor(maxPossibleParticles * density);
  }

  private createWithPoissonSampling(
    canvas: HTMLCanvasElement,
    wallOffset: number,
    goal: { x: number; y: number; radius: number },
    behaviors: any,
    options: any,
    resolvedRadius: number | Range | null | undefined,
    targetCount: number
  ): Particle[] {
    const particles: Particle[] = [];
    // const radiusConfig = resolvedRadius ?? 10;
    // const avgRadius = getAverageValue(radiusConfig);
    // const minDistance = avgRadius * 2.2; // Ensure no overlap with some spacing

    // Try multiple random starting points to avoid clustering
    const maxAttempts = Math.min(targetCount * 2, 500);

    for (
      let attempt = 0;
      attempt < maxAttempts && particles.length < targetCount;
      attempt++
    ) {
      const radius = this.getRadius(resolvedRadius);
      const x = getRandomX(radius, wallOffset, canvas);
      const y = getRandomY(radius, canvas);

      if (this.isValidPosition(x, y, radius, goal, particles, radius)) {
        const particle = this.createParticle(x, y, radius, behaviors, options);
        particles.push(particle);
      }
    }

    return particles;
  }

  private createWithRetryMethod(
    canvas: HTMLCanvasElement,
    wallOffset: number,
    goal: { x: number; y: number; radius: number },
    behaviors: any,
    options: any,
    resolvedRadius: number | Range | null | undefined,
    particleCount: number
  ): Particle[] {
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = this.getRadius(resolvedRadius);
      let x = getRandomX(radius, wallOffset, canvas);
      let y = getRandomY(radius, canvas);

      let retries = 0;
      while (retries < 100) {
        if (this.isValidPosition(x, y, radius, goal, particles)) {
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

      const particle = this.createParticle(x, y, radius, behaviors, options);
      particles.push(particle);
    }

    return particles;
  }

  private getRadius(resolvedRadius: number | Range | null | undefined): number {
    if (typeof resolvedRadius === "object" && resolvedRadius !== null) {
      return randInt(resolvedRadius.min, resolvedRadius.max);
    } else if (typeof resolvedRadius === "number") {
      return resolvedRadius;
    } else {
      return 10; // Default
    }
  }

  private isValidPosition(
    x: number,
    y: number,
    radius: number,
    goal: { x: number; y: number; radius: number },
    particles: Particle[],
    minBuffer: number = 0
  ): boolean {
    // Check for overlap with other particles
    for (const particle of particles) {
      const dist = distance(x, y, particle.x, particle.y);
      const requiredDistance = radius + (particle.radius ?? 0) + minBuffer;
      if (dist < requiredDistance) {
        return false;
      }
    }

    // Check for overlap with the goal (with extra buffer)
    const goalDist = distance(x, y, goal.x, goal.y);
    if (goalDist < radius + goal.radius + 10) {
      return false;
    }

    return true;
  }

  private createParticle(
    x: number,
    y: number,
    radius: number,
    behaviors: any,
    options: any
  ): Particle {
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

    return new Particle(x, y, resolvedOptions);
  }
}
