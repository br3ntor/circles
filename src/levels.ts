import { Level } from "./types";
import { canvas } from "./game-state";
import { gridPattern, dynamicParticleCreator } from "./particle-creators";
import { dynamicConfigs } from "./level-configs";

export const levelSet: Level[] = [
  ...dynamicConfigs.map((config) => ({
    title: config.title,
    particles: () => dynamicParticleCreator(canvas, config),
  })),
  {
    title: "Starting level",
    particles: () =>
      gridPattern(canvas, { radius: 30, velocity: { x: 0, y: -1 } }),
  },
  {
    title: "Another One",
    particles: () =>
      gridPattern(canvas, { radius: 40, velocity: { x: 0, y: 1 } }),
  },
];
