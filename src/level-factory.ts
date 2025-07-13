// import { GeneratorConfig, LevelGenerator, ParticleConfig } from "./types";
// import { randInt } from "./utils";

// function resolveValue(value: number | { min: number; max: number }): number {
//   if (typeof value === "number") {
//     return value;
//   }
//   return randInt(value.min, value.max);
// }

// export function createLevelGenerator(config: GeneratorConfig): LevelGenerator {
//   return (
//     canvas: HTMLCanvasElement
//   ): { title: string; particles: ParticleConfig[] } => {
//     const particleCount = resolveValue(config.particleCount);
//     const particles: ParticleConfig[] = [];

//     for (let i = 0; i < particleCount; i++) {
//       const radius = resolveValue(config.radius);
//       const x = resolveValue(config.x);
//       const y = resolveValue(config.y);
//       const dx = resolveValue(config.dx);
//       const dy = resolveValue(config.dy);

//       particles.push({
//         x,
//         y,
//         radius,
//         color: config.color(),
//         dx,
//         dy,
//         wallCollision: config.wallCollision,
//       });
//     }

//     // This part is important for preventing overlaps in random generation
//     for (let i = 0; i < particles.length; i++) {
//       for (let j = i + 1; j < particles.length; j++) {
//         const dist = Math.hypot(
//           particles[i].x - particles[j].x,
//           particles[i].y - particles[j].y
//         );
//         if (dist - particles[i].radius - particles[j].radius < 0) {
//           particles[j].x = resolveValue(config.x);
//           particles[j].y = resolveValue(config.y);
//           // Reset the inner loop to re-check the new position against all previous particles
//           j = i;
//         }
//       }
//     }

//     return {
//       title: config.title,
//       particles,
//     };
//   };
// }
