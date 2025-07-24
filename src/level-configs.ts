import { balls } from "./utils";

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

export interface BehaviorConfig {
  type: BehaviorType;
  [key: string]: any;
}

const colors = [
  "hsl(0, 100%, 71%)",
  "hsl(177, 56%, 58%)",
  "hsl(190, 56%, 58%)",
  "hsl(152, 44%, 67%)",
  "hsl(45, 100%, 85%)",
];

export interface LevelConfig {
  pattern: Pattern;
  patternConfig?: { [key: string]: any };
  behaviors: BehaviorConfig[];
  particleCount?: number;
  radius?: () => number;
  color?: () => string;
  vx?: () => number;
  vy?: () => number;
}

export const levels: LevelConfig[] = [
  {
    pattern: "spiral",
    patternConfig: {
      spiralDensity: 2,
      angleStep: 0.5,
    },
    behaviors: [
      // { type: "wall", mode: "wrap" },
      {
        type: "spiral",
        initialRadius: 20,
        growthRate: 10,
        rotationSpeed: 1,
      },
      // { type: "fadeOut", lifespan: 10 },
    ],
    radius: () => 20,
    particleCount: 10,
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
    pattern: "random",
    behaviors: [{ type: "wall", mode: "collide" }, { type: "collision" }],
    particleCount: 5,
    radius: () => 200,
    color: () => colors[Math.floor(Math.random() * colors.length)],
    vx: () => (Math.random() - 0.5) * 100,
    vy: () => (Math.random() - 0.5) * 100,
  },
  {
    pattern: "random",
    behaviors: [{ type: "wall", mode: "wrap" }, { type: "collision" }],
    particleCount: balls() + 50,
    radius: () => 20,
    color: () => colors[Math.floor(Math.random() * colors.length)],
    vx: () => (Math.random() - 0.5) * 200,
    vy: () => (Math.random() - 0.5) * 200,
  },
  {
    pattern: "random",
    behaviors: [{ type: "wall", mode: "collide" }, { type: "collision" }],
    particleCount: balls(),
    radius: () => Math.random() * 30 + 10,
    color: () => colors[Math.floor(Math.random() * colors.length)],
    vx: () => (Math.random() - 0.5) * 100,
    vy: () => (Math.random() - 0.5) * 100,
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
