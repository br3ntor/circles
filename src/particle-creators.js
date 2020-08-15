import { Particle } from "./Classes";
import { randInt, randomColor, getColor, niceColor, distance } from "./utils";

/**
 * This particle creator will spawn random,
 * non-overlapping cirlces. They will also
 * have random speeds, directions, and colors
 * based on the level object argument.
 *
 * @param Object | level | The paramters for the current level
 */
export function particleCreator(level) {
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
      // Keep track of retries for a no overlap circle
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

    p.push(new Particle(x, y, radius, color, xS, yS, level.wallCollision));
  }
  return p;
}

/**
 * Returns an array of particles with
 * coordinates set to form a circle
 * when drawn to the canvas.
 */
export function circlePattern() {
  const p = [];
  const particleCount = 6;
  const spaceBetween = 1 / particleCount;
  let angle = 0;

  for (let i = 0; i < particleCount; i++) {
    const radians = angle * Math.PI * 2;
    const radius = 120;
    const distance = 120;
    const x = innerWidth / 2 + Math.cos(radians) * distance;
    const y = innerHeight / 2 + Math.sin(radians) * distance;
    p.push(new Particle(x, y, radius, getColor(), 0, 0, false, radians));
    angle += spaceBetween;
  }

  return p;
}

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
