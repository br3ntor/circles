import {
  OrbitBehavior,
  RandomMovement,
  SpiralBehavior,
  WaveBehavior,
  CollisionBehavior,
  WallBehavior,
  FadeOutBehavior,
  LightingBehavior,
  ExperimentalBehavior,
  SinusoidalMovement,
  GoalCollisionBehavior,
} from "../particle-behaviors";
import {
  BehaviorConfig,
  LevelConfig,
  Pattern,
} from "../config/level-configs.js";
import { CirclePattern } from "../particle-patterns/CirclePattern.js";
import { OrbitPattern } from "../particle-patterns/OrbitPattern.js";
import { IPattern } from "../particle-patterns/types.js";
import { RandomPattern } from "../particle-patterns/RandomPattern.js";
import { SpiralPattern } from "../particle-patterns/SpiralPattern.js";
import { StarPattern } from "../particle-patterns/StarPattern.js";
import { WavePattern } from "../particle-patterns/WavePattern.js";
import { Particle } from "../game-objects/Particle.js";
import { Vector2 } from "../game-objects/Vector2.js";
import { ParticleBehavior } from "../game-objects/types.js";

export class ParticleManager {
  private canvas: HTMLCanvasElement;
  private particles: Particle[];
  private patterns: {
    [key in Pattern]?: IPattern;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.particles = [];
    this.patterns = {
      random: new RandomPattern(),
      spiral: new SpiralPattern(),
      star: new StarPattern(),
      circle: new CirclePattern(),
      waves: new WavePattern(),
      orbit: new OrbitPattern(),
    };
  }

  update(deltaTime: number, time: number): void {
    // Update particles
    this.particles.forEach((p) => p.update(deltaTime, time));
    this.particles = this.particles.filter((p) => p.isAlive());
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((particle) => {
      particle.draw(ctx);

      // Handle seamless wrapping
      const wallBehavior = particle.behaviorManager.findBehavior(
        (b) => b instanceof WallBehavior
      ) as WallBehavior | undefined;

      if (wallBehavior?.mode === "seamless") {
        const { x, y } = particle.position;
        const { radius } = particle;
        const { width, height } = this.canvas;

        // Draw ghost particle on the other side if it's wrapping
        const isCrossingRight = x + radius > width;
        const isCrossingLeft = x - radius < 0;
        const isCrossingBottom = y + radius > height;
        const isCrossingTop = y - radius < 0;

        // Draw ghosts for edges
        if (isCrossingRight) particle.draw(ctx, { x: x - width, y });
        if (isCrossingLeft) particle.draw(ctx, { x: x + width, y });
        if (isCrossingBottom) particle.draw(ctx, { x, y: y - height });
        if (isCrossingTop) particle.draw(ctx, { x, y: y + height });

        // Draw ghosts for corners
        if (isCrossingRight && isCrossingTop)
          particle.draw(ctx, { x: x - width, y: y + height });
        if (isCrossingRight && isCrossingBottom)
          particle.draw(ctx, { x: x - width, y: y - height });
        if (isCrossingLeft && isCrossingTop)
          particle.draw(ctx, { x: x + width, y: y + height });
        if (isCrossingLeft && isCrossingBottom)
          particle.draw(ctx, { x: x + width, y: y - height });
      }
    });
  }

  addParticle(particle: Particle): void {
    this.particles.push(particle);
  }

  clearParticles(): void {
    this.particles = [];
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  createPattern(config: LevelConfig): void {
    this.clearParticles();
    const patternCreator = this.patterns[config.pattern];
    if (patternCreator) {
      const behaviors = this._createBehaviorsFromConfig(config.behaviors);
      const particles = patternCreator.create(
        {
          behaviors,
          particleCount: config.particleCount ?? 100,
          options: {
            radius: config.radius ? config.radius() : undefined,
            color: config.color,
            vx: config.vx,
            vy: config.vy,
          },
          canvas: this.canvas,
        },
        config.patternConfig ?? {}
      );
      this.particles.push(...particles);
    }
  }

  private _createBehaviorsFromConfig(
    configs: BehaviorConfig[]
  ): ParticleBehavior[] {
    const center = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
    return configs.map((config) => {
      switch (config.type) {
        case "wall":
          return new WallBehavior(this.canvas, config.mode);
        case "collision":
          return new CollisionBehavior(config.mode);
        case "orbit":
          return new OrbitBehavior(center, config.radius, config.speed);
        case "spiral":
          return new SpiralBehavior(
            center,
            config.initialRadius,
            config.growthRate,
            config.rotationSpeed
          );
        case "wave":
          return new WaveBehavior(
            this.canvas,
            config.amplitude,
            config.frequency,
            config.speed,
            config.yOffset
          );
        case "randomMovement":
          return new RandomMovement(config.intensity);
        case "experimental":
          return new ExperimentalBehavior(config.turnSpeed);
        case "fadeOut":
          return new FadeOutBehavior(config.lifespan);
        case "lighting":
          return new LightingBehavior(config.mode);
        case "sinusoidal":
          return new SinusoidalMovement(
            this.canvas,
            config.amplitude,
            config.frequency,
            config.yOffset
          );
        case "goalCollision":
          return new GoalCollisionBehavior(config.bounce);
        default:
          // The following line should be unreachable with the new types, but it's good practice to keep it.
          // @ts-expect-error
          throw new Error(`Unknown behavior type: ${config.type}`);
      }
    });
  }
}
