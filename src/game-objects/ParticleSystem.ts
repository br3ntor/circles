import {
  OrbitBehavior,
  RandomMovement,
  SpiralBehavior,
  WaveBehavior,
  CollisionBehavior,
  WallBehavior,
  FadeOutBehavior,
} from "../particle-behaviors";
import { BehaviorConfig, LevelConfig, Pattern } from "../level-configs.js";
import { CirclePattern } from "../particle-patterns/CirclePattern.js";
import { OrbitPattern } from "../particle-patterns/OrbitPattern.js";
import { IPattern } from "../particle-patterns/types.js";
import { RandomPattern } from "../particle-patterns/RandomPattern.js";
import { SpiralPattern } from "../particle-patterns/SpiralPattern.js";
import { StarPattern } from "../particle-patterns/StarPattern.js";
import { WavePattern } from "../particle-patterns/WavePattern.js";
import { Particle } from "./Particle.js";
import { Vector2 } from "./Vector2.js";
import { ParticleBehavior } from "./types.js";

export class ParticleSystem {
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
            vx: config.vx ? config.vx() : undefined,
            vy: config.vy ? config.vy() : undefined,
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
          return new CollisionBehavior(this.particles, config.mode);
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
            config.amplitude,
            config.frequency,
            config.speed
          );
        case "randomMovement":
          return new RandomMovement(config.intensity);
        case "fadeOut":
          return new FadeOutBehavior(config.lifespan);
        default:
          // The following line should be unreachable with the new types, but it's good practice to keep it.
          // @ts-expect-error
          throw new Error(`Unknown behavior type: ${config.type}`);
      }
    });
  }
}
