import { Particle, Guardian } from "./Classes.ts";
import { distance, getColor } from "./utils.ts";

/**
 * This particle creator will spawn random,
 * non-overlapping cirlces. They will also
 * have random speeds, directions, and colors
 * based on the level object argument.
 *
 * @param Object | level | Methods to create random parameters.
 * @returns Array | An array of randomized particle objects.
 */
export function particleCreator(level: { objects: () => number; radius: () => number; x: (radius: number, wall: number) => number; y: (radius: number) => number; xSpeed: () => number; ySpeed: () => number; color: () => string; wallCollision?: boolean; }) {
  const p = [];
  const wallEnd = 105;
  const objects = level.objects();

  for (let i = 0; i < objects; i++) {
    const radius = level.radius();
    let x = level.x(radius, wallEnd);
    let y = level.y(radius);
    const xS = level.xSpeed();
    const yS = level.ySpeed();
    const color = level.color();

    // Skip first generation, only 1 circle
    if (i !== 0) {
      // Number of retries to not overlap circle
      let retries = 0;

      for (let j = 0; j < p.length; j++) {
        if (retries > 100) {
          console.log("Not enough space for circles!");
          break;
        }
        const dist = distance(x, y, p[j].x, p[j].y);

        if (dist - radius - p[j].radius < 0) {
          // The + 105 here is for the wall
          x = level.x(radius, wallEnd);
          y = level.y(radius);

          // Reset loop to check if replacement
          // circle has overlap itself.
          j = -1;
          retries++;
        }
      }
    }

    p.push(new Particle(x, y, radius, color, xS, yS, level.wallCollision ?? true));
  }
  return p;
}

/**
 * Returns an array of guardian circles
 * with coordinates set to form a circle
 * when drawn to the canvas.
 */
export function guardianCreator() {
  const p = [];
  const particleCount = 6;
  const spaceBetween = 1 / particleCount;
  let angle = 0;

  for (let i = 0; i < particleCount; i++) {
    const radians = angle * Math.PI * 2;
    const radius = 50;
    const distance = radius;
    const x = innerWidth / 1.2 + Math.cos(radians) * distance;
    const y = innerHeight / 2 + Math.sin(radians) * distance;
    p.push(new Guardian(x, y, radius, radians, "hsl(0deg, 0%, 100%)"));
    angle += spaceBetween;
  }

  return p;
}

/**
 * Current experiment
 */
export function newParticlePattern() {
  const p = [];
  const particleCount = 15;

  for (let i = 1; i <= particleCount; i++) {
    if (i % 2 === 0) {
      p.push(new Particle(60 * i + 105, 40, 30, getColor(), 2, 2, false));
    } else {
      p.push(
        new Particle(
          60 * i + 105,
          innerHeight - 40,
          30,
          getColor(),
          2,
          -2,
          false
        )
      );
    }
  }

  return p;
}
