// import { balls, niceColor, randInt } from "./utils";
// // import { OldParticleConfig } from "./types";

// type LevelSet = (canvas: HTMLCanvasElement) => OldParticleConfig[];

// const levelSets: Record<string, LevelSet> = {
//   default: (canvas) => [
//     {
//       title: "Red",
//       wallCollision: false,
//       particleCount: () => balls(),
//       radius: () => 20,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => -1,
//       dy: () => -1,
//       color: () => `hsl(0deg, 100%, 50%)`,
//     },
//     {
//       title: "Yellow",
//       wallCollision: false,
//       particleCount: () => balls(),
//       radius: () => 60,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => 0,
//       dy: () => -0.5,
//       color: () => `hsl(75deg, 100%, 50%)`,
//     },
//     {
//       title: "Random",
//       particleCount: () => balls(),
//       radius: () => Math.random() * 60 + 15,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => (Math.random() - 0.5) * 5,
//       dy: () => (Math.random() - 0.5) * 5,
//       color: () => niceColor(),
//     },
//     {
//       title: "Subtle",
//       wallCollision: false,
//       particleCount: () => balls(),
//       radius: () => 30,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dy: () => (Math.random() - 0.5) * 8,
//       dx: () => (Math.random() - 0.5) * 1,
//       color: () => niceColor(),
//     },
//     {
//       title: "Fast",
//       particleCount: () => balls() + 15,
//       radius: () => 10,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => 3,
//       dy: () => 0,
//       color: () => niceColor(),
//     },
//     {
//       title: "Big",
//       particleCount: () => balls() - 4,
//       radius: () => 100,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => (Math.random() - 0.5) * 2,
//       dy: () => (Math.random() - 0.5) * 2,
//       color: () => niceColor(),
//     },
//   ],
//   roo: (canvas) => [
//     {
//       title: "Colorful",
//       particleCount: () => 50,
//       radius: () => 5,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => (Math.random() - 0.5) * 5,
//       dy: () => (Math.random() - 0.5) * 5,
//       color: () => `hsl(${Math.random() * 360}deg, 100%, 50%)`,
//     },
//     {
//       title: "Black Hole",
//       particleCount: () => 1,
//       radius: () => 200,
//       x: () => canvas.width / 2,
//       y: () => canvas.height / 2,
//       dx: () => 0,
//       dy: () => 0,
//       color: () => "black",
//     },
//     {
//       title: "Small",
//       wallCollision: false,
//       particleCount: () => 200,
//       radius: () => 2,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => (Math.random() - 0.5) * 3,
//       dy: () => (Math.random() - 0.5) * 3,
//       color: () => niceColor(),
//     },
//     {
//       title: "Horizontal",
//       particleCount: () => 20,
//       radius: () => 30,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => (Math.random() > 0.5 ? 5 : -5),
//       dy: () => 0,
//       color: () => `hsl(${randInt(0, 50)}deg, 100%, 50%)`,
//     },
//     {
//       title: "Vertical",
//       particleCount: () => 20,
//       radius: () => 30,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => 0,
//       dy: () => (Math.random() > 0.5 ? 5 : -5),
//       color: () => `hsl(${randInt(180, 230)}deg, 100%, 50%)`,
//     },
//   ],
//   rebirth: (canvas) => [
//     // {
//     //   title: "One",
//     //   objects: () => 1,
//     //   radius: () => 60,
//     //   x: (radius: number, wall: number) =>
//     //     randInt(radius + wall, canvas.width - radius),
//     //   y: (radius: number) => randInt(radius, canvas.height - radius),
//     //   xSpeed: () => (Math.random() - 0.5) * 50,
//     //   ySpeed: () => (Math.random() - 0.5) * 50,
//     //   color: () => `hsl(${randInt(0, 360)}deg, 100%, 50%)`,
//     // },
//     // {
//     //   title: "Two",
//     //   wallCollision: false,
//     //   objects: () => 2,
//     //   radius: () => 80,
//     //   x: (radius: number, wall: number) =>
//     //     randInt(radius + wall, canvas.width - radius),
//     //   y: (radius: number) => randInt(radius, canvas.height - radius),
//     //   xSpeed: () => (Math.random() - 0.5) * 40,
//     //   ySpeed: () => (Math.random() - 0.5) * 40,
//     //   color: () => `hsl(${randInt(0, 360)}deg, 100%, 50%)`,
//     // },
//     {
//       title: "Three",
//       wallCollision: true,
//       particleCount: () => randInt(3, 10),
//       radius: () => Math.random() * 100 + 15,
//       x: (radius: number, wall: number) =>
//         randInt(radius + wall, canvas.width - radius),
//       y: (radius: number) => randInt(radius, canvas.height - radius),
//       dx: () => (Math.random() - 0.5) * 5,
//       dy: () => (Math.random() - 0.5) * 5,
//       color: () => `hsl(${randInt(0, 360)}deg, 100%, 50%)`,
//     },
//   ],
// };

// export const getParticleConfigs = (
//   canvas: HTMLCanvasElement,
//   levelSet = "default"
// ) => {
//   return levelSets[levelSet](canvas);
// };
