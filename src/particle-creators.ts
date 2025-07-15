import { DynamicParticleConfig, ParticleProps } from "./types.ts";
import { Particle_2 } from "./game-objects.ts";
import { distance, getRandomColor } from "./utils.ts";

const wallEnd = 105;

/**
 * Returns an array of guardian circles
 * with coordinates set to form a circle
 * when drawn to the canvas.
 */
// export function guardianCreator(canvas: HTMLCanvasElement) {
//   const p = [];
//   const particleCount = 6;
//   const spaceBetween = 1 / particleCount;
//   let angle = 0;
//
//   for (let i = 0; i < particleCount; i++) {
//     const radians = angle * Math.PI * 2;
//     const radius = 50;
//     const distance = radius;
//     const x = canvas.width / 1.2 + Math.cos(radians) * distance;
//     const y = canvas.height / 2 + Math.sin(radians) * distance;
//     p.push(new Guardian(x, y, radius, radians, "hsl(0deg, 0%, 100%)"));
//     angle += spaceBetween;
//   }
//
//   return p;
// }

/**
 * Particle Grid Pattern
 * This could also take in a (dx, dy) param, oh or I guess
 * anything the function doesn't do, really this function
 * Yea could prob just also have a config param
 */
export function gridPattern(
  canvas: HTMLCanvasElement,
  config: { radius: number; velocity: { x: number; y: number } }
) {
  const particles = [];
  const particleRadius = config.radius;
  const gap = particleRadius * 6; // Wider gap for player
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
        dx: config.velocity.x,
        dy: config.velocity.y,
        wallCollision: false,
      };
      const p = new Particle_2(c.x, c.y, {
        radius: c.radius,
        color: c.color,
        vx: c.dx,
        vy: c.dy,
      });
      particles.push(p);
    }
  }
  return particles;
}

/**
 * This particle creator will spawn particles
 * with dynamically created particle properties.
 *
 * @param Object | config | Methods to create dynamic parameters.
 * @returns Array | An array of dynamic particle objects.
 */
export function dynamicParticleCreator(
  canvas: HTMLCanvasElement,
  config: DynamicParticleConfig
) {
  const particles = [];
  const particleCount = config.particleCount();

  for (let i = 0; i < particleCount; i++) {
    const radius = config.radius();
    let x = config.x(radius, wallEnd, canvas);
    let y = config.y(radius, canvas);
    const dx = config.dx();
    const dy = config.dy();
    const color = config.color();

    // Now we will retry
    // Skip first generation, only 1 circle
    if (i !== 0) {
      let retries = 0;

      // Go over our particles so far
      for (let j = 0; j < particles.length; j++) {
        if (retries > 100) {
          console.log("Not enough space for circles!");
          break;
        }

        // Check if our new partcile overlaps
        const dist = distance(x, y, particles[j].x, particles[j].y);
        if (dist - radius - particles[j].radius < 0) {
          // If there's an overlap we overwrite x, y to create a new set
          x = config.x(radius, wallEnd, canvas);
          y = config.y(radius, canvas);

          // Reset loop to check if replacement
          // circle has overlap itself.
          j = -1;
          retries++;
        }
      }
    }

    particles.push(
      new Particle_2(x, y, {
        radius,
        color,
        vx: dx,
        vy: dy,
      })
    );
  }
  return particles;
}

export function starPatternCreator(canvas: HTMLCanvasElement) {
  const particles = [];
  const particleRadius = 20;
  const numLines = 3;
  const particlesPerLine = 40;
  const lineLength = 1000;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < numLines; i++) {
    const angle = (i * Math.PI) / numLines;
    for (let j = 0; j < particlesPerLine; j++) {
      const distance =
        (j / (particlesPerLine - 1)) * lineLength - lineLength / 2;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      const p: ParticleProps = {
        x: x,
        y: y,
        radius: particleRadius,
        color: getRandomColor(),
        dx: 0,
        dy: 0,
        wallCollision: false,
      };
      particles.push(
        new Particle_2(p.x, p.y, {
          radius: p.radius,
          color: p.color,
          vx: p.dx,
          vy: p.dy,
        })
      );
    }
  }

  return particles;
}
