import { Particle, Guardian } from "./game-objects.ts";
import { distance, getRandomColor } from "./utils.ts";
import { ParticleConfig } from "./types.ts";

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
export function particleCreator(config: ParticleConfig) {
  const p = [];
  const wallEnd = 105;
  const particleCount = config.particleCount();

  for (let i = 0; i < particleCount; i++) {
    const radius = config.radius();
    let x = config.x(radius, wallEnd);
    let y = config.y(radius);
    const dx = config.dx();
    const dy = config.dy();
    const color = config.color();

    // Now we will retry
    // Skip first generation, only 1 circle
    if (i !== 0) {
      let retries = 0;

      // Go over our particles so far
      for (let j = 0; j < p.length; j++) {
        if (retries > 100) {
          console.log("Not enough space for circles!");
          break;
        }

        // Check if our new partcile overlaps
        const dist = distance(x, y, p[j].x, p[j].y);
        if (dist - radius - p[j].radius < 0) {
          // If there's an overlap we overwrite x, y to create a new set
          x = config.x(radius, wallEnd);
          y = config.y(radius);

          // Reset loop to check if replacement
          // circle has overlap itself.
          j = -1;
          retries++;
        }
      }
    }

    p.push(
      new Particle(x, y, radius, color, dx, dy, config.wallCollision ?? true)
    );
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
      p.push(new Particle(60 * i + 105, 40, 30, getRandomColor(), 2, 2, false));
    } else {
      p.push(
        new Particle(
          60 * i + 105,
          innerHeight - 40,
          30,
          getRandomColor(),
          2,
          -2,
          false
        )
      );
    }
  }

  return p;
}

/**
 * Particle Columns
 */
export function rainingPattern(canvas: HTMLCanvasElement) {
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

      const p = new Particle(
        x,
        y,
        particleRadius,
        getRandomColor(),
        0,
        -0.1, // Travel downwards
        false
      );
      particles.push(p);
    }
  }
  return particles;
}
