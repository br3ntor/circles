import { CollisionBehaviorMode } from "../particle-behaviors/CollisionBehavior";
import { WallBehaviorMode } from "../particle-behaviors/WallBehavior";
import { balls, niceColor } from "../utils/utils";

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
  | "fadeOut";

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
};
export type RandomMovementBehaviorConfig = {
  type: "randomMovement";
  intensity: number;
};
export type FadeOutBehaviorConfig = {
  type: "fadeOut";
  lifespan: number;
};

export type BehaviorConfig =
  | WallBehaviorConfig
  | CollisionBehaviorConfig
  | OrbitBehaviorConfig
  | SpiralBehaviorConfig
  | WaveBehaviorConfig
  | RandomMovementBehaviorConfig
  | FadeOutBehaviorConfig;

// Pattern Configurations
export type SpiralPatternConfig = {
  spiralDensity?: number;
  angleStep?: number;
};

export type PatternConfigMap = {
  spiral: SpiralPatternConfig;
  random: never;
  star: never;
  circle: never;
  waves: never;
  orbit: never;
};

export interface LevelConfig<P extends Pattern = Pattern> {
  pattern: P;
  patternConfig?: PatternConfigMap[P];
  behaviors: BehaviorConfig[];
  particleCount?: number;
  radius?: () => number;
  color?: () => string;
  vx?: () => number;
  vy?: () => number;
}

const colors = [
  "hsl(0, 100%, 71%)",
  "hsl(177, 56%, 58%)",
  "hsl(190, 56%, 58%)",
  "hsl(152, 44%, 67%)",
  "hsl(45, 100%, 85%)",
];

export const levels: LevelConfig[] = [
  {
    pattern: "random",
    behaviors: [
      { type: "wall", mode: "seamless" },
      { type: "collision", mode: "lightUp" },
    ],
    radius: () => 150,
    particleCount: 6,
    color: niceColor,
    vx: () => (Math.random() - 0.5) * 400,
    vy: () => (Math.random() - 0.5) * 200,
  },
  {
    pattern: "random",
    behaviors: [
      { type: "wall", mode: "collide" },
      { type: "collision", mode: "lightUp" },
    ],
    particleCount: 30,
    radius: () => 50,
    color: () => colors[Math.floor(Math.random() * colors.length)],
    vx: () => (Math.random() - 0.5) * 100,
    vy: () => (Math.random() - 0.5) * 100,
  },

  {
    pattern: "random",
    behaviors: [
      { type: "wall", mode: "collide" },
      { type: "collision", mode: "lightUp" },
    ],
    particleCount: balls() + 20,
    radius: () => 10,
    color: () => colors[Math.floor(Math.random() * colors.length)],
    vx: () => 220,
    vy: () => 0,
  },
  {
    pattern: "spiral",
    patternConfig: {
      spiralDensity: 2,
      angleStep: 0.5,
    },
    behaviors: [
      { type: "wall", mode: "teleport" },
      { type: "randomMovement", intensity: 800 },
      { type: "collision", mode: "lightUp" },
    ],
    radius: () => 20,
    particleCount: 30,
    color: niceColor,
  },

  {
    pattern: "spiral",
    patternConfig: {
      spiralDensity: 8,
      angleStep: 0.5,
    },
    behaviors: [
      {
        type: "spiral",
        initialRadius: 200,
        growthRate: 30,
        rotationSpeed: 0.3,
      },
      { type: "wall", mode: "teleport" },
    ],
    radius: () => 20,
    particleCount: 30,
    color: niceColor,
  },
  {
    pattern: "random",
    behaviors: [{ type: "wall", mode: "teleport" }],
    particleCount: balls() + 30,
    radius: () => 10,
    color: () => colors[Math.floor(Math.random() * colors.length)],
    vx: () => 0,
    vy: () => 20,
  },

  // {
  //   pattern: "random",
  //   behaviors: [{ type: "wall", mode: "wrap" }, { type: "collision" }],
  //   particleCount: balls() + 50,
  //   radius: () => 20,
  //   color: () => colors[Math.floor(Math.random() * colors.length)],
  //   vx: () => (Math.random() - 0.5) * 200,
  //   vy: () => (Math.random() - 0.5) * 200,
  // },
  // {
  //   pattern: "random",
  //   behaviors: [{ type: "wall", mode: "collide" }, { type: "collision" }],
  //   particleCount: balls(),
  //   radius: () => Math.random() * 30 + 10,
  //   color: () => colors[Math.floor(Math.random() * colors.length)],
  //   vx: () => (Math.random() - 0.5) * 100,
  //   vy: () => (Math.random() - 0.5) * 100,
  // },
  // {
  //   pattern: "waves",
  //   behaviors: [
  //     { type: "wall", mode: "wrap" },
  //     { type: "wave", amplitude: 50, frequency: 0.02, speed: 100 },
  //   ],
  //   particleCount: 200,
  // },
  // {
  //   pattern: "orbit",
  //   behaviors: [
  //     { type: "wall", mode: "collide" },
  //     {
  //       type: "orbit",
  //       // centerPoint will be calculated in ParticleSystem
  //       radius: 200,
  //       speed: 1,
  //     },
  //   ],
  //   particleCount: 100,
  // },
];
