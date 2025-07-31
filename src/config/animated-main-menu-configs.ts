// import { balls, randInt } from "../lib/utils";
import { getRandomColorFromScheme } from "./color-schemes";
import { LevelConfig } from "./level-configs";

export const animatedMainMenuLevels: LevelConfig[] = [
  {
    patterns: [
      {
        pattern: "random",
        patternConfig: {
          density: 0.5,
        },
        behaviors: [
          { type: "collision", mode: "resolve" },
          { type: "wall", mode: "seamless" },
          { type: "lighting", mode: "lightUp" },
        ],
        radius: { min: 10, max: 60 },
        vx: () => (Math.random() - 0.5) * 100,
        vy: () => (Math.random() - 0.5) * 100,
        color: () => getRandomColorFromScheme("cosmic"),
      },
    ],
  },
];
