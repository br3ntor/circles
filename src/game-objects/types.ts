import { Vector2 } from "./Vector2.js";
import { Particle } from "./Particle.js";

export type GuardianState = "orbiting" | "returning" | "returned";

export interface ParticleBehavior {
  update(particle: Particle, deltaTime: number, time: number): void;
  handleCollision?(
    particle: Particle,
    other: Particle,
    position1: Vector2,
    position2: Vector2
  ): void;
}

export interface ParticleOptions {
  vx?: number | (() => number);
  vy?: number | (() => number);
  radius?: number;
  color?: string | (() => string);
  behaviors?: ParticleBehavior[];
  angle?: number;
  centerPoint?: Vector2;
  distance?: number;
  mass?: number;
  opacity?: number;
}
