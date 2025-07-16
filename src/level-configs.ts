// import { Vector2 } from "./game-objects";
// import { WallBehaviorMode } from "./particle-behaviors";

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
  | "randomMovement";

export interface BehaviorConfig {
  type: BehaviorType;
  [key: string]: any;
}

export interface LevelConfig {
  pattern: Pattern;
  behaviors: BehaviorConfig[];
  particleCount?: number;
}

export const levels: LevelConfig[] = [
  {
    pattern: "random",
    behaviors: [{ type: "wall", mode: "collide" }, { type: "collision" }],
    particleCount: 10,
  },
  {
    pattern: "spiral",
    behaviors: [
      { type: "wall", mode: "wrap" },
      {
        type: "spiral",
        // centerPoint will be calculated in ParticleSystem
        initialRadius: 50,
        growthRate: 10,
        rotationSpeed: 2,
      },
    ],
    particleCount: 150,
  },
  {
    pattern: "waves",
    behaviors: [
      { type: "wall", mode: "wrap" },
      { type: "wave", amplitude: 50, frequency: 0.02, speed: 100 },
    ],
    particleCount: 200,
  },
  {
    pattern: "orbit",
    behaviors: [
      { type: "wall", mode: "collide" },
      {
        type: "orbit",
        // centerPoint will be calculated in ParticleSystem
        radius: 200,
        speed: 1,
      },
    ],
    particleCount: 100,
  },
];
