import { Particle, Guardian } from "./game-objects.ts";
// import { distance, getRandomColor } from "./utils.ts";
import { getRandomColor } from "./utils.ts";
import { ParticleProps } from "./types.ts";

// import { OldParticleConfig } from "./types.ts";

const wallEnd = 105;

/**
 * This particle creator will spawn random,
 * non-overlapping cirlces. They will also
 * have random speeds, directions, and colors
 * based on the level object argument.
 *
 * @param Object | config | Methods to create random parameters.
 * @returns Array | An array of randomized particle objects.
 */
// export function levelCreator(canvas: HTMLCanvasElement, config: ) {
//   const p = [];
//   const wallEnd = 105;
//   const particleCount = config.particleCount();

//   for (let i = 0; i < particleCount; i++) {
//     const radius = config.radius();
//     let x = config.x(radius, wallEnd);
//     let y = config.y(radius);
//     const dx = config.dx();
//     const dy = config.dy();
//     const color = config.color();

//     // Now we will retry
//     // Skip first generation, only 1 circle
//     if (i !== 0) {
//       let retries = 0;

//       // Go over our particles so far
//       for (let j = 0; j < p.length; j++) {
//         if (retries > 100) {
//           console.log("Not enough space for circles!");
//           break;
//         }

//         // Check if our new partcile overlaps
//         const dist = distance(x, y, p[j].x, p[j].y);
//         if (dist - radius - p[j].radius < 0) {
//           // If there's an overlap we overwrite x, y to create a new set
//           x = config.x(radius, wallEnd);
//           y = config.y(radius);

//           // Reset loop to check if replacement
//           // circle has overlap itself.
//           j = -1;
//           retries++;
//         }
//       }
//     }

//     p.push(
//       new Particle(x, y, radius, color, dx, dy, config.wallCollision ?? true)
//     );
//   }
//   return p;
// }

/**
 * Returns an array of guardian circles
 * with coordinates set to form a circle
 * when drawn to the canvas.
 */
export function guardianCreator(canvas: HTMLCanvasElement) {
  const p = [];
  const particleCount = 6;
  const spaceBetween = 1 / particleCount;
  let angle = 0;

  for (let i = 0; i < particleCount; i++) {
    const radians = angle * Math.PI * 2;
    const radius = 50;
    const distance = radius;
    const x = canvas.width / 1.2 + Math.cos(radians) * distance;
    const y = canvas.height / 2 + Math.sin(radians) * distance;
    p.push(new Guardian(x, y, radius, radians, "hsl(0deg, 0%, 100%)"));
    angle += spaceBetween;
  }

  return p;
}

/**
 * Particle Grid Pattern
 * This could also take in a (dx, dy) param, oh or I guess
 * anything the function doesn't do, really this function
 * Yea could prob just also have a config param
 */
export function gridPattern(canvas: HTMLCanvasElement) {
  const particles = [];
  const particleRadius = 30;
  const gap = particleRadius * 7; // Wider gap for player
  const cols = Math.floor(canvas.width / gap);
  const rows = Math.floor(canvas.height / gap);
  const verticalOffset = gap / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gap + particleRadius + wallEnd;
      let y = row * gap + particleRadius;

      if (col % 2 !== 0) {
        y += verticalOffset;
      }

      const c: ParticleProps = {
        x: x,
        y: y,
        radius: particleRadius,
        color: getRandomColor(),
        dx: 0,
        dy: -0.1,
        wallCollision: false,
      };
      const p = new Particle(c);
      particles.push(p);
    }
  }
  return particles;
}

// import { Level, ParticleConfig } from "./types.ts";

/**
 * Creates an array of particles from a level blueprint.
 *
 * @param {Level} blueprint - The level blueprint to use.
 * @returns {Particle[]} An array of particle objects.
 */
// export function createParticlesFromBlueprint(blueprint: Level): Particle[] {
//   return blueprint.particles.map((p) => {
//     return new Particle(
//       p.x,
//       p.y,
//       p.radius,
//       p.color,
//       p.dx,
//       p.dy,
//       p.wallCollision
//     );
//   });
// }
