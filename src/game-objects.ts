import resolveCollision from "./elastic-collision.ts";
import { distance, getHSL, getRandomX, getRandomY } from "./utils.ts";
import { ParticleProps } from "./types.ts";
import {
  OrbitBehavior,
  RandomMovement,
  SpiralBehavior,
  WaveBehavior,
  CollisionBehavior,
  WallBehavior,
} from "./particle-behaviors.ts";

/**
 * Particles move through space at a given velocity
 * until they collide with a wall, another particle,
 * or the player. Or perhaps manipulated with a function.
 */
// export class Particle {
//   x: number;
//   y: number;
//   radius: number;
//   color: string;
//   hue: number;
//   velocity: { x: number; y: number };
//   wallCollision: boolean;
//   mass: number;
//   opacity: number;
//
//   constructor(config: ParticleProps) {
//     this.x = config.x;
//     this.y = config.y;
//     this.radius = config.radius;
//     this.color = config.color;
//     this.hue = parseFloat(this.color.slice(4, this.color.indexOf("d")));
//     this.velocity = {
//       x: config.dx,
//       y: config.dy,
//     };
//     this.wallCollision = config.wallCollision;
//     this.mass = 1; // Used in elastic collision
//     this.opacity = 0.2;
//   }
//
//   draw(ctx: CanvasRenderingContext2D) {
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     ctx.lineWidth = 2;
//     ctx.fillStyle = this.color;
//
//     ctx.save();
//     ctx.globalAlpha = this.opacity;
//     ctx.fill();
//     ctx.restore();
//
//     ctx.strokeStyle = this.color;
//     ctx.stroke();
//     ctx.closePath();
//   }
//
//   /**
//    * Propells particles through space
//    * Collision with other particles,
//    * optional wall collision
//    * Can I abstract this to smaller
//    * particle methods?
//    */
//   behavior: (particle: Particle) => void = () => {};
//
//   update(ctx: CanvasRenderingContext2D, particles: Particle[], player: Player) {
//     this.draw(ctx);
//     this.behavior(this);
//
//     const hasCollidedWithPlayer = this.detectCollision(
//       ctx.canvas,
//       particles,
//       player
//     );
//     // If a collision with the player happened, exit early.
//     if (hasCollidedWithPlayer) {
//       return true;
//     }
//
//     // Update color
//     if (this.hue >= 360) {
//       this.hue = 0;
//     } else {
//       this.color = `hsl(${this.hue}deg, 100%, 50%)`;
//       this.hue += 0.4;
//     }
//   }
//
//   detectCollision(
//     canvas: HTMLCanvasElement,
//     particles: Particle[],
//     player: Player
//   ) {
//     // Loop over particles for collision detection
//     for (let i = 0; i < particles.length; i++) {
//       // Never compare particle to itself, skips if true.
//       if (this === particles[i]) continue;
//
//       const dist = distance(this.x, this.y, particles[i].x, particles[i].y);
//
//       if (dist - this.radius - particles[i].radius < 0) {
//         // Elastic collision
//         resolveCollision(this, particles[i]);
//
//         // Light up particles on collision
//         this.opacity = 0.6;
//         particles[i].opacity = 0.6;
//       }
//     }
//
//     // Reset back to transparent after collision
//     if (this.opacity > 0.02) {
//       this.opacity -= 0.02;
//       this.opacity = Math.max(0, this.opacity);
//     }
//
//     // Particles collide with walls if option set true
//     if (this.wallCollision) {
//       if (this.x - this.radius < 0 || this.x + this.radius >= canvas.width) {
//         this.velocity.x = -this.velocity.x;
//       }
//       if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
//         this.velocity.y = -this.velocity.y;
//       }
//       // Else the particles come back on other side if they travel offscreen
//     } else {
//       const space = 0; // Extra space offscreen
//       if (this.x - this.radius > canvas.width + space) this.x = 0 - this.radius;
//       if (this.x + this.radius < 0 - space) this.x = canvas.width + this.radius;
//       if (this.y - this.radius > canvas.height + space)
//         this.y = 0 - this.radius;
//       if (this.y + this.radius < 0 - space)
//         this.y = canvas.height + this.radius;
//     }
//
//     // Player object collision (should I handle in player class?)
//     const playerDistance = distance(this.x, this.y, player.x, player.y);
//
//     if (playerDistance - this.radius - player.radius <= 0) {
//       this.opacity = 1;
//       return true;
//     }
//   }
// }

/**
 * Guardians protect and guard the goal
 */

// export class Guardian {
//   x: number;
//   y: number;
//   radius: number;
//   radians: number;
//   color: string;
//   opacity: number;
//   circlVelocity: number;
//   distanceFromCenter: number;
//   velocity: { x: number; y: number };
//   mass: number;
//
//   constructor(
//     x: number,
//     y: number,
//     radius: number,
//     radians = 0,
//     color: string
//   ) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//     this.radians = radians;
//     this.color = color;
//     this.opacity = 0.2;
//     this.circlVelocity = 0.005;
//     this.distanceFromCenter = 50;
//     this.velocity = {
//       x: 0,
//       y: 0,
//     };
//     this.mass = 1;
//   }
//
//   draw(ctx: CanvasRenderingContext2D) {
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     ctx.lineWidth = 2;
//     ctx.fillStyle = this.color;
//
//     ctx.save();
//     ctx.globalAlpha = this.opacity;
//     ctx.fill();
//     ctx.restore();
//
//     ctx.strokeStyle = this.color;
//     ctx.stroke();
//     ctx.closePath(); // Not sure if necessary
//   }
//
//   update(ctx: CanvasRenderingContext2D, particles: Particle[], player: Player) {
//     const x = this.x;
//     const y = this.y;
//     // Loop over particles to check for collision with guardians
//     for (let i = 0; i < particles.length; i++) {
//       const dist = distance(this.x, this.y, particles[i].x, particles[i].y);
//
//       // Particles intersect with guardians here
//       if (dist - this.radius - particles[i].radius < 0) {
//         // resolveCollision(this, particles[i]);
//
//         // Circles get boosted when intersecting with mid circles
//         // particles[i].velocity.x += particles[i].velocity.x * 0.02;
//         // particles[i].velocity.y += particles[i].velocity.y * 0.02;
//
//         // Light up particles and guardian on collision
//         this.opacity = 0.6;
//         particles[i].opacity = 0.6;
//         this.color = particles[i].color;
//       } else {
//         // this.color = "green";
//         // if (this.color !== "hsl(0deg, 0%, 100%)") {
//         //   const hsl = getHSL(this.color);
//         //   const h = Math.max(0, hsl.H - 1);
//         //   const s = Math.max(0, hsl.S - 1);
//         //   const l = Math.min(100, hsl.L + 1);
//         //   this.color = `hsl(${h}deg, ${s}%, ${l}%)`;
//         //   // console.log(this.color);
//         // }
//       }
//     }
//
//     // Reset back to transparent after collision
//     if (this.opacity > 0.02) {
//       this.opacity -= 0.02;
//       this.opacity = Math.max(0, this.opacity);
//     }
//
//     if (this.color !== "hsl(0deg, 0%, 100%)") {
//       const hsl = getHSL(this.color);
//       const h = Math.max(0, hsl.H - 1);
//       const s = Math.max(0, hsl.S - 1);
//       const l = Math.min(100, hsl.L + 1);
//       this.color = `hsl(${h}deg, ${s}%, ${l}%)`;
//       // console.log(this.color);
//     }
//
//     // Move points over time
//     this.radians += this.circlVelocity;
//
//     // Circular Motion
//     this.x =
//       innerWidth / 1.2 + Math.cos(this.radians) * this.distanceFromCenter;
//     this.y = innerHeight / 2 + Math.sin(this.radians) * this.distanceFromCenter;
//
//     // Check distance from last point
//     // console.log((this.x - x) * 3);
//     this.velocity.x = (this.x - x) * 3;
//     this.velocity.y = (this.y - y) * 3;
//
//     // this.x = this.x + Math.cos(this.radians) * 2;
//     // this.y = this.y + Math.sin(this.radians) * 2;
//
//     // Expand the circle over time
//     if (this.distanceFromCenter < 300) {
//       this.distanceFromCenter += 0.5;
//     }
//
//     // Player object collision (should I handle in player class?)
//     // This is the second object checking for player collision, maybe
//     // the player should be checking all the objects instead
//     const playerDistance = distance(this.x, this.y, player.x, player.y);
//
//     if (playerDistance - this.radius - player.radius <= 0) {
//       this.opacity = 1;
//       return true;
//     }
//
//     this.draw(ctx);
//   }
// }

export class Player {
  x: number;
  y: number;
  speed: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(
    ctx: CanvasRenderingContext2D,
    gameRunning: boolean,
    mouse: { x: number; y: number }
  ) {
    this.draw(ctx);
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;

    // Skip movement if too close to target
    if (Math.abs(dx) <= 2 && Math.abs(dy) <= 2) {
      this.constrainToBounds();
      return;
    }

    const angle = Math.atan2(dy, dx);
    const xVelocity = Math.cos(angle) * this.speed;
    const yVelocity = Math.sin(angle) * this.speed;

    // Handle X movement with wall constraint when game not running
    if (!gameRunning && this.x + this.radius >= 95 && dx > 2) {
      this.x = 95 - this.radius;
    } else {
      this.x += xVelocity;
    }

    this.y += yVelocity;
    this.constrainToBounds();
  }

  private constrainToBounds() {
    this.x = Math.max(
      this.radius + 1,
      Math.min(innerWidth - this.radius, this.x)
    );
    this.y = Math.max(
      this.radius + 1,
      Math.min(innerHeight - this.radius, this.y)
    );
  }

  detectCollision(particles: Particle_2[]): boolean {
    for (const particle of particles) {
      const dist = distance(this.x, this.y, particle.x, particle.y);
      if (dist - this.radius - particle.radius <= 0) {
        particle.opacity = 0.6;
        // this.color = "blue";
        return true;
      }
    }
    return false;
  }
}

export class Goal {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1;
    if (this.fill === true) {
      ctx.fillStyle = "#7bf977";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.strokeStyle = "#7bf977";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  update(ctx: CanvasRenderingContext2D, player: Player) {
    this.draw(ctx);
    if (
      player.x - player.radius > this.x &&
      player.x + player.radius < this.x + this.width &&
      player.y - player.radius > this.y &&
      player.y + player.radius < this.y + this.height
    ) {
      this.fill = true;
      return true;
    } else {
      this.fill = false;
    }
  }
}

export class Timer {
  running: boolean;
  startTime: Date | number;
  endTime: Date | number;
  durration: number;

  constructor() {
    this.running = false;
    this.startTime = 0;
    this.endTime = 0;
    this.durration = 0;
  }
  start() {
    if (this.running) {
      throw new Error("Already started");
    }
    this.running = true;
    this.startTime = new Date();
  }
  stop() {
    if (!this.running) {
      throw new Error("Not started");
    }
    this.running = false;
    this.endTime = new Date();
    const seconds =
      ((this.endTime as Date).getTime() - (this.startTime as Date).getTime()) /
      1000;
    this.durration += seconds;
  }
  reset() {
    this.startTime = 0;
    this.endTime = 0;
    this.running = false;
    this.durration = 0;
  }
  now() {
    return (Date.now() - (this.startTime as Date).getTime()) / 1000;
  }
}

/**
 * THE NEW SHIT DOWN HERE
 */

export class Vector2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  multiply(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    return mag > 0
      ? new Vector2(this.x / mag, this.y / mag)
      : new Vector2(0, 0);
  }
}

export interface ParticleBehavior {
  update(particle: Particle_2, deltaTime: number, time: number): void;
}

export interface ParticleOptions {
  vx?: number;
  vy?: number;
  radius?: number;
  color?: string;
  life?: number;
  maxLife?: number;
  fadeRate?: number;
  isDynamic?: boolean;
  behaviors?: ParticleBehavior[];
  angle?: number;
  angularVelocity?: number;
  centerPoint?: Vector2;
  distance?: number;
  mass?: number;
  opacity?: number;
}

export class Particle_2 {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
  fadeRate: number;
  isDynamic: boolean;
  behaviors: ParticleBehavior[];
  angle: number;
  angularVelocity: number;
  centerPoint?: Vector2;
  distance?: number;
  mass: number;
  opacity: number;

  constructor(x: number, y: number, options: ParticleOptions = {}) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(options.vx, options.vy);
    this.acceleration = new Vector2(0, 0);
    this.radius = options.radius ?? 10;
    this.color = options.color ?? "white";
    this.life = options.life ?? 1;
    this.maxLife = options.maxLife ?? 1;
    this.fadeRate = options.fadeRate ?? 0.01;
    this.isDynamic = options.isDynamic ?? false;
    this.behaviors = options.behaviors ?? [];
    this.angle = options.angle ?? 0;
    this.angularVelocity = options.angularVelocity ?? 0;
    this.centerPoint = options.centerPoint;
    this.distance = options.distance;
    this.mass = options.mass ?? 1;
    this.opacity = options.opacity ?? 0.5;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  update(deltaTime: number, time: number): void {
    this.life -= this.fadeRate;

    this.behaviors.forEach((behavior) =>
      behavior.update(this, deltaTime, time)
    );

    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));
    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  draw_old(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.lineWidth = 2;
    ctx.fillStyle = this.color;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }

  isAlive(): boolean {
    return this.life > 0;
  }
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private particles: Particle_2[];
  private patterns: {
    [key: string]: (wallBehaviorMode: "collide" | "wrap" | "none") => void;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.particles = [];
    this.patterns = {
      random: this.createRandomPattern.bind(this),
      spiral: this.createSpiralPattern.bind(this),
      star: this.createStarPattern.bind(this),
      circle: this.createCirclePattern.bind(this),
      waves: this.createWavePattern.bind(this),
      orbit: this.createOrbitPattern.bind(this),
    };
  }

  update(deltaTime: number, time: number): void {
    // Update particles
    this.particles = this.particles.filter((particle) => {
      particle.update(deltaTime, time);
      return particle.isAlive();
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((particle) => {
      particle.draw(ctx);
    });
  }

  addParticle(particle: Particle_2): void {
    this.particles.push(particle);
  }

  clearParticles(): void {
    this.particles = [];
  }

  getParticles(): Particle_2[] {
    return this.particles;
  }

  createPattern(
    patternName: string,
    wallBehaviorMode: "collide" | "wrap" | "none" = "collide"
  ): void {
    this.clearParticles();
    if (this.patterns[patternName]) {
      this.patterns[patternName](wallBehaviorMode);
    }
  }

  private createRandomPattern(
    wallBehaviorMode: "collide" | "wrap" | "none"
  ): void {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];

    for (let i = 0; i < 10; i++) {
      const behaviors: ParticleBehavior[] = [
        new CollisionBehavior(this.particles),
      ];
      if (wallBehaviorMode !== "none") {
        behaviors.push(new WallBehavior(this.canvas, wallBehaviorMode));
      }

      const radius = Math.random() * 5 + 120;
      let x = getRandomX(radius, 105, this.canvas);
      let y = getRandomY(radius, this.canvas);

      if (i !== 0) {
        let retries = 0;
        for (let j = 0; j < this.particles.length; j++) {
          if (retries > 100) {
            console.log("Not enough space for circles!");
            break;
          }
          const dist = distance(x, y, this.particles[j].x, this.particles[j].y);
          if (dist - radius - this.particles[j].radius < 0) {
            x = getRandomX(radius, 105, this.canvas);
            y = getRandomY(radius, this.canvas);
            j = -1; // restart the check
            retries++;
          }
        }
      }

      const particle = new Particle_2(x, y, {
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        fadeRate: 0,
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createSpiralPattern(
    wallBehaviorMode: "collide" | "wrap" | "none"
  ): void {
    const numParticles = 200;
    const spiralDensity = 0.5;
    const angleStep = (Math.PI * 2) / 50;

    for (let i = 0; i < numParticles; i++) {
      const angle = i * angleStep;
      const distance = i * spiralDensity;
      const x = this.canvas.width / 2 + Math.cos(angle) * distance;
      const y = this.canvas.height / 2 + Math.sin(angle) * distance;
      const behaviors: ParticleBehavior[] = [
        new SpiralBehavior(
          new Vector2(this.canvas.width / 2, this.canvas.height / 2),
          0.5,
          0.01
        ),
        new CollisionBehavior(this.particles),
      ];
      if (wallBehaviorMode !== "none") {
        behaviors.push(new WallBehavior(this.canvas, wallBehaviorMode));
      }

      const particle = new Particle_2(x, y, {
        radius: 3,
        color: `hsl(${i * 2}, 100%, 50%)`,
        life: 2.0,
        fadeRate: 0.005,
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createStarPattern(
    wallBehaviorMode: "collide" | "wrap" | "none"
  ): void {
    const numParticles = 100;
    const numArms = 5;
    const armLength = 200;

    for (let i = 0; i < numParticles; i++) {
      const armIndex = i % numArms;
      const angle = (armIndex * (Math.PI * 2)) / numArms;
      const distance = (i / numParticles) * armLength;
      const x = this.canvas.width / 2 + Math.cos(angle) * distance;
      const y = this.canvas.height / 2 + Math.sin(angle) * distance;
      const behaviors: ParticleBehavior[] = [
        new CollisionBehavior(this.particles),
      ];
      if (wallBehaviorMode !== "none") {
        behaviors.push(new WallBehavior(this.canvas, wallBehaviorMode));
      }

      const particle = new Particle_2(x, y, {
        radius: 2,
        color: "white",
        life: 1.5,
        fadeRate: 0.01,
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createCirclePattern(
    wallBehaviorMode: "collide" | "wrap" | "none"
  ): void {
    const numParticles = 100;
    const radius = 150;

    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * (Math.PI * 2);
      const x = this.canvas.width / 2 + Math.cos(angle) * radius;
      const y = this.canvas.height / 2 + Math.sin(angle) * radius;
      const behaviors: ParticleBehavior[] = [
        new OrbitBehavior(
          new Vector2(this.canvas.width / 2, this.canvas.height / 2),
          radius,
          0.01
        ),
        new CollisionBehavior(this.particles),
      ];
      if (wallBehaviorMode !== "none") {
        behaviors.push(new WallBehavior(this.canvas, wallBehaviorMode));
      }

      const particle = new Particle_2(x, y, {
        radius: 4,
        color: `hsl(${(i / numParticles) * 360}, 100%, 50%)`,
        life: 3.0,
        fadeRate: 0.003,
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createWavePattern(
    wallBehaviorMode: "collide" | "wrap" | "none"
  ): void {
    const numParticles = 200;
    const waveAmplitude = 100;
    const waveFrequency = 0.1;

    for (let i = 0; i < numParticles; i++) {
      const x = (i / numParticles) * this.canvas.width;
      const y =
        this.canvas.height / 2 + Math.sin(i * waveFrequency) * waveAmplitude;
      const behaviors: ParticleBehavior[] = [
        new WaveBehavior(waveAmplitude, waveFrequency),
        new CollisionBehavior(this.particles),
      ];
      if (wallBehaviorMode !== "none") {
        behaviors.push(new WallBehavior(this.canvas, wallBehaviorMode));
      }

      const particle = new Particle_2(x, y, {
        radius: 3,
        color: `hsl(${(i / numParticles) * 360}, 100%, 50%)`,
        life: 2.5,
        fadeRate: 0.008,
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createOrbitPattern(
    wallBehaviorMode: "collide" | "wrap" | "none"
  ): void {
    const numParticles = 50;
    const center_x = this.canvas.width / 2;
    const center_y = this.canvas.height / 2;

    for (let i = 0; i < numParticles; i++) {
      const distance = Math.random() * 150 + 50;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.02 + 0.01;
      const behaviors: ParticleBehavior[] = [
        new OrbitBehavior(new Vector2(center_x, center_y), distance, speed),
        new CollisionBehavior(this.particles),
      ];
      if (wallBehaviorMode !== "none") {
        behaviors.push(new WallBehavior(this.canvas, wallBehaviorMode));
      }

      const particle = new Particle_2(
        center_x + Math.cos(angle) * distance,
        center_y + Math.sin(angle) * distance,
        {
          radius: 2,
          color: "white",
          life: 4.0,
          fadeRate: 0.002,
          behaviors,
        }
      );
      this.addParticle(particle);
    }
  }
}
