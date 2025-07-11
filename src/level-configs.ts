import { balls, niceColor, randInt } from "./utils";

// Options for the original particleCreator function to create levels
export const getParticleConfigs = (canvas: HTMLCanvasElement) => {
  return [
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
      // xSpeed: () => 0,
      xSpeed: () => 0,
      ySpeed: () => -0.5,
      // color: () => `hsl(220deg, 100%, 50%)`,
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
  ];
};
