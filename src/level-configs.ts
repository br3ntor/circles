import { balls, niceColor, randInt } from "./utils";
import { ParticleConfig } from "./types";

type LevelSet = (canvas: HTMLCanvasElement) => ParticleConfig[];

const levelSets: Record<string, LevelSet> = {
  default: (canvas) => [
    {
      wallCollision: false,
      objects: () => balls(),
      radius: () => 20,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => -1,
      ySpeed: () => -1,
      color: () => `hsl(0deg, 100%, 50%)`,
    },
    {
      wallCollision: false,
      objects: () => balls(),
      radius: () => 60,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => 0,
      ySpeed: () => -0.5,
      color: () => `hsl(75deg, 100%, 50%)`,
    },
    {
      objects: () => balls(),
      radius: () => Math.random() * 60 + 15,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => (Math.random() - 0.5) * 5,
      ySpeed: () => (Math.random() - 0.5) * 5,
      color: () => niceColor(),
    },
    {
      wallCollision: false,
      objects: () => balls(),
      radius: () => 30,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      ySpeed: () => (Math.random() - 0.5) * 8,
      xSpeed: () => (Math.random() - 0.5) * 1,
      color: () => niceColor(),
    },
    {
      objects: () => balls() + 15,
      radius: () => 10,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => 3,
      ySpeed: () => 0,
      color: () => niceColor(),
    },
    {
      objects: () => balls() - 4,
      radius: () => 100,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => (Math.random() - 0.5) * 2,
      ySpeed: () => (Math.random() - 0.5) * 2,
      color: () => niceColor(),
    },
  ],
  roo: (canvas) => [
    {
      objects: () => 50,
      radius: () => 5,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => (Math.random() - 0.5) * 5,
      ySpeed: () => (Math.random() - 0.5) * 5,
      color: () => `hsl(${Math.random() * 360}deg, 100%, 50%)`,
    },
    {
      objects: () => 1,
      radius: () => 200,
      x: () => canvas.width / 2,
      y: () => canvas.height / 2,
      xSpeed: () => 0,
      ySpeed: () => 0,
      color: () => "black",
    },
    {
      wallCollision: false,
      objects: () => 200,
      radius: () => 2,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => (Math.random() - 0.5) * 3,
      ySpeed: () => (Math.random() - 0.5) * 3,
      color: () => niceColor(),
    },
    {
      objects: () => 20,
      radius: () => 30,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => (Math.random() > 0.5 ? 5 : -5),
      ySpeed: () => 0,
      color: () => `hsl(${randInt(0, 50)}deg, 100%, 50%)`,
    },
    {
      objects: () => 20,
      radius: () => 30,
      x: (radius: number, wall: number) =>
        randInt(radius + wall, canvas.width - radius),
      y: (radius: number) => randInt(radius, canvas.height - radius),
      xSpeed: () => 0,
      ySpeed: () => (Math.random() > 0.5 ? 5 : -5),
      color: () => `hsl(${randInt(180, 230)}deg, 100%, 50%)`,
    },
  ],
};

export const getParticleConfigs = (
  canvas: HTMLCanvasElement,
  levelSet = "default"
) => {
  return levelSets[levelSet](canvas);
};
