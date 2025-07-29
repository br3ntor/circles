import { getRandomColorFromScheme } from "./color-schemes";
import { CollisionBehaviorMode } from "../particle-behaviors/CollisionBehavior";
import { LightingBehaviorMode } from "../particle-behaviors/LightingBehavior";
import { WallBehaviorMode } from "../particle-behaviors/WallBehavior";
import { balls, niceColor, randInt } from "../utils/utils";

export type Pattern =
  | "random"
  | "spiral"
  | "star"
  | "circle"
  | "waves"
  | "orbit";

export type BehaviorType =
  | "wall"
  | "collision"
  | "orbit"
  | "spiral"
  | "wave"
  | "randomMovement"
  | "fadeOut"
  | "lighting"
  | "experimental"
  | "sinusoidal"
  | "goalCollision";

export type WallBehaviorConfig = {
  type: "wall";
  mode: WallBehaviorMode;
};
export type CollisionBehaviorConfig = {
  type: "collision";
  mode?: CollisionBehaviorMode;
};
export type OrbitBehaviorConfig = {
  type: "orbit";
  radius: number;
  speed: number;
};
export type SpiralBehaviorConfig = {
  type: "spiral";
  initialRadius: number;
  growthRate: number;
  rotationSpeed: number;
};
export type WaveBehaviorConfig = {
  type: "wave";
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset?: number;
};
export type RandomMovementBehaviorConfig = {
  type: "randomMovement";
  intensity: number;
  turnSpeed: number;
};
export type FadeOutBehaviorConfig = {
  type: "fadeOut";
  lifespan: number;
};

export type LightingBehaviorConfig = {
  type: "lighting";
  mode?: LightingBehaviorMode;
};

export type ExperimentalBehaviorConfig = {
  type: "experimental";
  turnSpeed?: number;
};

export type SinusoidalMovementBehaviorConfig = {
  type: "sinusoidal";
  amplitude?: number;
  frequency?: number;
  yOffset?: number;
};

export type GoalCollisionBehaviorConfig = {
  type: "goalCollision";
  bounce?: boolean;
};

export type BehaviorConfig =
  | WallBehaviorConfig
  | CollisionBehaviorConfig
  | OrbitBehaviorConfig
  | SpiralBehaviorConfig
  | WaveBehaviorConfig
  | RandomMovementBehaviorConfig
  | FadeOutBehaviorConfig
  | LightingBehaviorConfig
  | ExperimentalBehaviorConfig
  | SinusoidalMovementBehaviorConfig
  | GoalCollisionBehaviorConfig;

// Pattern Configurations
export type SpiralPatternConfig = {
  spiralDensity?: number;
  angleStep?: number;
};

export type WavePatternConfig = {
  amplitude: number;
  frequency: number;
  yOffset: number;
  xOffset?: number;
};

export type PatternConfigMap = {
  spiral: SpiralPatternConfig;
  random: never;
  star: never;
  circle: never;
  waves: WavePatternConfig;
  orbit: never;
};

export interface PatternInstanceConfig<P extends Pattern = Pattern> {
  pattern: P;
  patternConfig?: PatternConfigMap[P];
  behaviors: BehaviorConfig[];
  particleCount?: number;
  radius?: () => number;
  color?: () => string;
  vx?: () => number;
  vy?: () => number;
}

export interface LevelConfig {
  globalBehaviors?: BehaviorConfig[];
  patterns: PatternInstanceConfig[];
  music?: string;
}

export const levels: LevelConfig[] = [
  {
    music: "level1",
    patterns: [
      {
        pattern: "random",
        behaviors: [],
        particleCount: balls(),
        radius: () => randInt(10, 60),
      },
    ],
  },
  // {
  //   music: "level2",
  //   globalBehaviors: [{ type: "wall", mode: "teleport" }],
  //   patterns: [
  //     {
  //       pattern: "waves",
  //       patternConfig: {
  //         amplitude: -1,
  //         frequency: 0.5,
  //         yOffset: 0,
  //       },
  //       behaviors: [
  //         { type: "sinusoidal", amplitude: -1, frequency: 0.5, yOffset: 0 },
  //       ],
  //       particleCount: 5,
  //       color: () => "red",
  //       vx: () => -30,
  //       vy: () => 0,
  //     },
  //     {
  //       pattern: "waves",
  //       patternConfig: {
  //         amplitude: -1,
  //         frequency: 0.5,
  //         yOffset: 0,
  //         xOffset: 300,
  //       },
  //       behaviors: [
  //         { type: "sinusoidal", amplitude: -1, frequency: 0.5, yOffset: 0 },
  //       ],
  //       particleCount: 5,
  //       color: () => "green",
  //       vx: () => 0,
  //     },
  //     {
  //       pattern: "waves",
  //       patternConfig: {
  //         amplitude: -1,
  //         frequency: 0.5,
  //         yOffset: 0,
  //         xOffset: 500,
  //       },
  //       behaviors: [
  //         { type: "sinusoidal", amplitude: -1, frequency: 0.5, yOffset: 0 },
  //       ],
  //       particleCount: 5,
  //       color: () => "blue",
  //       vx: () => 30,
  //       vy: () => 0,
  //     },
  //   ],
  // },
  // {
  //   music: "level1",
  //   globalBehaviors: [
  //     { type: "wall", mode: "teleport" },
  //     { type: "collision", mode: "resolve" },
  //     { type: "lighting", mode: "lightUp" },
  //   ],
  //   patterns: [
  //     {
  //       pattern: "random",
  //       behaviors: [],
  //       particleCount: 20,
  //       radius: () => 30,
  //       color: () => "red",
  //       vx: () => (Math.random() - 0.5) * 200,
  //       vy: () => (Math.random() - 0.5) * 200,
  //     },
  //     {
  //       pattern: "random",
  //       behaviors: [],
  //       particleCount: 20,
  //       radius: () => 30,
  //       color: () => "blue",
  //       vx: () => (Math.random() - 0.5) * 200,
  //       vy: () => (Math.random() - 0.5) * 200,
  //     },
  //   ],
  // },
];
