import { Range } from "../lib/utils.js";
import { Vector2 } from "./Vector2.js";

export interface IGameObject {
  id: string;
  position: Vector2;
  velocity?: Vector2;
  radius: number;
  color?: string;
  opacity?: number;
  mass?: number;
  [key: string]: any;
}

export type GuardianState = "orbiting" | "returning" | "returned";

import { IBehavior } from "../managers/BehaviorManager.js";

export interface ParticleBehavior extends IBehavior {
  update(particle: IGameObject, deltaTime: number, time: number): void;
  handleCollision?(
    particle: IGameObject,
    other: IGameObject,
    position1: Vector2,
    position2: Vector2
  ): void;
}

export interface ConfigurableParticleOptions {
  vx?: number | (() => number);
  vy?: number | (() => number);
  radius?: number | (() => number) | Range;
  color?: string | (() => string);
  behaviors?: ParticleBehavior[];
  angle?: number;
  centerPoint?: Vector2;
  distance?: number;
  mass?: number;
  opacity?: number;
}

export interface ParticleOptions {
  vx?: number;
  vy?: number;
  radius?: number;
  color?: string;
  behaviors?: ParticleBehavior[];
  angle?: number;
  centerPoint?: Vector2;
  distance?: number;
  mass?: number;
  opacity?: number;
}
