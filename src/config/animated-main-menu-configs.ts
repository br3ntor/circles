import { balls, randInt } from "../lib/utils";
import { getRandomColorFromScheme } from "./color-schemes";
import { LevelConfig } from "./level-configs";

export const animatedMainMenuLevels: LevelConfig[] = [
  {
    patterns: [
      {
        pattern: "random",
        behaviors: [
          { type: "collision", mode: "resolve" },
          { type: "wall", mode: "seamless" },
          { type: "lighting", mode: "lightUp" },
        ],
        particleCount: balls() + 20,
        radius: () => randInt(10, 60),
        vx: () => (Math.random() - 0.5) * 100,
        vy: () => (Math.random() - 0.5) * 100,
        color: () => getRandomColorFromScheme("cosmic"),
      },
    ],
  },
];
