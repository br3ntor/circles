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
  | "randomMovement";

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
  behaviors: BehaviorConfig[];
  particleCount?: number;
  radius: () => number;
  color: () => string;
}

export const levels: LevelConfig[] = [
  {
    pattern: "random",
    behaviors: [{ type: "wall", mode: "collide" }, { type: "collision" }],
    particleCount: 10,
    radius: () => 120,
    color: () => colors[Math.floor(Math.random() * colors.length)],
  },
  {
    pattern: "random",
    behaviors: [{ type: "wall", mode: "collide" }, { type: "collision" }],
    particleCount: balls(),
    radius: () => Math.random() * 30 + 10,
    color: () => colors[Math.floor(Math.random() * colors.length)],
  },
  // {
  //   pattern: "spiral",
  //   behaviors: [
  //     { type: "wall", mode: "wrap" },
  //     {
  //       type: "spiral",
  //       // centerPoint will be calculated in ParticleSystem
  //       initialRadius: 50,
  //       growthRate: 10,
  //       rotationSpeed: 2,
  //     },
  //   ],
  //   particleCount: 150,
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
