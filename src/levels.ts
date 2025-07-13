import { gridPattern } from "./particle-creators";
import { canvas } from "./game-state";
import { Level } from "./types";

export const levelSet: Level[] = [
  { title: "Starting level", particles: gridPattern(canvas) },
];
