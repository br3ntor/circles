import { distance, getHSL, getRandomX, getRandomY } from "./utils.ts";
import {
  OrbitBehavior,
  RandomMovement,
  SpiralBehavior,
  WaveBehavior,
  CollisionBehavior,
  WallBehavior,
  FadeOutBehavior,
} from "./particle-behaviors.ts";
import { BehaviorConfig, LevelConfig, Pattern } from "./level-configs.ts";

/**
 * Guardians protect and guard the goal
 */

export type GuardianState = "orbiting" | "returning" | "returned";

export class Guardian {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  radians: number;
  color: string;
  opacity: number;
  circlVelocity: number;
  distanceFromCenter: number;
  state: GuardianState;

  constructor(
    x: number,
    y: number,
    radius: number,
    radians = 0,
    distanceFromCenter = 50 // Default to 40
  ) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.radius = radius;
    this.radians = radians;
    this.color = "hsl(56deg, 0%, 87%)";
    this.opacity = 0.2;
    this.circlVelocity = 0.005;
    this.distanceFromCenter = distanceFromCenter;
    this.state = "orbiting";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.lineWidth = 2;
    ctx.fillStyle = this.color;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath(); // Not sure if necessary
  }

  // update(ctx: CanvasRenderingContext2D, particles: Particle_2[], goal: Goal) {
  update(particles: Particle[], goal: Goal) {
    if (this.state === "returned") {
      return;
    }
    const lastPosition = new Vector2(this.position.x, this.position.y);

    // Circular Motion
    this.radians += this.circlVelocity;

    // Update position based on current distanceFromCenter and initial radians
    this.position.x = goal.x + Math.cos(this.radians) * this.distanceFromCenter;
    this.position.y = goal.y + Math.sin(this.radians) * this.distanceFromCenter;

    if (this.state === "returning") {
      // Inverse circular motion: return to startPosition
      const initialDistanceFromCenter = 50; // Assuming this is the initial distance from createGuardians
      const returnSpeed = 3; // Adjust as needed

      if (this.distanceFromCenter > initialDistanceFromCenter) {
        // Srink the circle over time
        this.distanceFromCenter = Math.max(
          initialDistanceFromCenter,
          this.distanceFromCenter - returnSpeed
        );
      } else {
        this.distanceFromCenter = initialDistanceFromCenter; // Ensure it doesn't go below initial
        this.state = "returned";
        this.velocity = new Vector2(0, 0); // Set velocity to zero
      }
    } else {
      // Expand the circle over time
      if (this.distanceFromCenter < 300) {
        this.distanceFromCenter += 0.5;
      }
    }

    // Loop over particles to check for collision with guardians
    for (let i = 0; i < particles.length; i++) {
      const dist = distance(
        this.position.x,
        this.position.y,
        particles[i].x,
        particles[i].y
      );

      // Particles intersect with guardians here
      if (dist - this.radius - particles[i].radius < 0) {
        // resolveCollision(this, particles[i]);

        // Light up particles and guardian on collision
        this.opacity = 0.6;
        this.color = particles[i].color;
        particles[i].fillOpacity = 1;
      }
    }

    // Reset back to transparent after collision
    if (this.opacity > 0.02) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    // Changes back to original color
    if (this.color !== "hsl(56deg, 0%, 87%)") {
      const hsl = getHSL(this.color);

      let h = hsl.H;
      if (h > 56) {
        h = Math.max(56, h - 1);
      } else if (h < 56) {
        h = Math.min(56, h + 1);
      }

      const s = Math.max(0, hsl.S - 1);

      let l = hsl.L;
      if (l > 87) {
        l = Math.max(87, l - 1);
      } else if (l < 87) {
        l = Math.min(87, l + 1);
      }

      this.color = `hsl(${h}deg, ${s}%, ${l}%)`;
    }

    // Only update velocity if not returning and stopped
    if (this.state !== "returning") {
      this.velocity.x = (this.position.x - lastPosition.x) * 3;
      this.velocity.y = (this.position.y - lastPosition.y) * 3;
    }
  }

  detectPlayerCollision(player: Player): boolean {
    const playerDistance = distance(
      this.position.x,
      this.position.y,
      player.x,
      player.y
    );

    if (playerDistance - this.radius - player.radius <= 0) {
      this.opacity = 1;
      return true;
    }
    return false;
  }
}

export class Player {
  x: number;
  y: number;
  speed: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius: number, color?: string) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = radius;
    this.color = color ?? "#DEDEDE";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(mouse: { x: number; y: number }) {
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

    this.x += xVelocity;
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

  detectCollision(particles: Particle[]): boolean {
    for (const particle of particles) {
      const dist = distance(this.x, this.y, particle.x, particle.y);
      if (dist - this.radius - particle.radius <= 0) {
        particle.fillOpacity = 1;
        return true;
      }
    }
    return false;
  }
}

export class Goal {
  x: number;
  y: number;
  radius: number;
  fill: boolean;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    if (this.fill === true) {
      ctx.fillStyle = "#DEDEDE";
      ctx.fill();
    } else {
      ctx.strokeStyle = "#DEDEDE";
      ctx.stroke();
    }
    ctx.closePath();
  }

  update(ctx: CanvasRenderingContext2D, player: Player) {
    // Collision detection for player entering goal
    this.draw(ctx);
    const dist = distance(this.x, this.y, player.x, player.y);
    if (dist < this.radius - player.radius) {
      this.fill = true;
      return true;
    } else {
      this.fill = false;
      return false;
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
  update(particle: Particle, deltaTime: number, time: number): void;
}

export interface ParticleOptions {
  vx?: number;
  vy?: number;
  radius?: number;
  color?: string;
  behaviors?: ParticleBehavior[];
  angle?: number;
  centerPoint?: Vector2;
  distance?: number;
  mass?: number;
  opacity?: number;
}

export class Particle {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  radius: number;
  color: string;
  behaviors: ParticleBehavior[];
  angle: number;
  centerPoint?: Vector2;
  distance?: number;
  mass: number;
  opacity: number;
  age: number;
  shouldRemove: boolean;
  fillOpacity: number;

  constructor(x: number, y: number, options: ParticleOptions = {}) {
    this.age = 0;
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(options.vx, options.vy);
    this.acceleration = new Vector2(0, 0);
    this.radius = options.radius ?? 10;
    this.color = options.color ?? "white";
    this.behaviors = options.behaviors ?? [];
    this.angle = options.angle ?? 0;
    this.centerPoint = options.centerPoint;
    this.distance = options.distance;
    this.mass = options.mass ?? 1;
    this.opacity = options.opacity ?? 1;
    this.shouldRemove = false;
    this.fillOpacity = 0.2;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  update(deltaTime: number, time: number): void {
    this.age += deltaTime;

    // Fade out the fill opacity
    if (this.fillOpacity > 0.2) {
      this.fillOpacity = Math.max(0.2, this.fillOpacity - 2 * deltaTime);
    }

    // Apply acceleration before behaviors
    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));
    this.acceleration = new Vector2(0, 0);

    this.behaviors.forEach((behavior) =>
      behavior.update(this, deltaTime, time)
    );

    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  draw_old(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    // Draw fill if it's visible
    if (this.fillOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = this.fillOpacity;
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

    // Always draw stroke
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
  }

  isAlive(): boolean {
    return !this.shouldRemove;
  }
}
interface PatternCreatorInput {
  behaviors: ParticleBehavior[];
  particleCount: number;
  radius?: () => number;
  color?: () => string;
  vx?: () => number;
  vy?: () => number;
}

type PatternCreator = (input: PatternCreatorInput) => void;

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private particles: Particle[];
  private patterns: {
    [key in Pattern]?: PatternCreator;
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
    this.particles.forEach((p) => p.update(deltaTime, time));
    this.particles = this.particles.filter((p) => p.isAlive());
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((particle) => {
      particle.draw(ctx);
    });
  }

  addParticle(particle: Particle): void {
    this.particles.push(particle);
  }

  clearParticles(): void {
    this.particles = [];
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  createPattern(config: LevelConfig): void {
    this.clearParticles();
    const patternCreator = this.patterns[config.pattern];
    if (patternCreator) {
      const behaviors = this._createBehaviorsFromConfig(config.behaviors);
      patternCreator({
        behaviors,
        particleCount: config.particleCount ?? 100,
        radius: config.radius,
        color: config.color,
        vx: config.vx,
        vy: config.vy,
      });
    }
  }

  private _createBehaviorsFromConfig(
    configs: BehaviorConfig[]
  ): ParticleBehavior[] {
    const center = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
    return configs.map((config) => {
      switch (config.type) {
        case "wall":
          return new WallBehavior(this.canvas, config.mode);
        case "collision":
          return new CollisionBehavior(this.particles, config.mode);
        case "orbit":
          return new OrbitBehavior(center, config.radius, config.speed);
        case "spiral":
          return new SpiralBehavior(
            center,
            config.initialRadius,
            config.growthRate,
            config.rotationSpeed
          );
        case "wave":
          return new WaveBehavior(
            config.amplitude,
            config.frequency,
            config.speed
          );
        case "randomMovement":
          return new RandomMovement(config.intensity);
        case "fadeOut":
          return new FadeOutBehavior(config.lifespan);
        default:
          throw new Error(`Unknown behavior type: ${config.type}`);
      }
    });
  }

  private createRandomPattern({
    behaviors,
    particleCount,
    radius,
    color,
    vx,
    vy,
  }: PatternCreatorInput): void {
    for (let i = 0; i < particleCount; i++) {
      const r = radius ? radius() : 10;
      let x = getRandomX(r, 105, this.canvas);
      let y = getRandomY(r, this.canvas);

      if (i !== 0) {
        let retries = 0;
        for (let j = 0; j < this.particles.length; j++) {
          if (retries > 100) {
            console.log("Not enough space for circles!");
            break;
          }
          const dist = distance(x, y, this.particles[j].x, this.particles[j].y);
          if (dist - r - this.particles[j].radius < 0) {
            x = getRandomX(r, 105, this.canvas);
            y = getRandomY(r, this.canvas);
            j = -1; // restart the check
            retries++;
          }
        }
      }

      const particle = new Particle(x, y, {
        vx: vx ? vx() : 0,
        vy: vy ? vy() : 0,
        radius: r,
        color: color ? color() : "white",
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createSpiralPattern({
    behaviors,
    particleCount,
    radius,
    color,
    vx,
    vy,
  }: PatternCreatorInput): void {
    const spiralDensity = 1.5;
    const angleStep = (Math.PI * 2) / 20;

    for (let i = 0; i < particleCount; i++) {
      const angle = i * angleStep;
      const distance = i * spiralDensity;
      const x = this.canvas.width / 2 + Math.cos(angle) * distance;
      const y = this.canvas.height / 2 + Math.sin(angle) * distance;

      const particle = new Particle(x, y, {
        vx: vx ? vx() : 0,
        vy: vy ? vy() : 0,
        radius: radius ? radius() : 3,
        color: color ? color() : `hsl(${i * 2}, 100%, 50%)`,
        behaviors,
        angle,
        distance,
      });
      this.addParticle(particle);
    }
  }

  private createStarPattern({
    behaviors,
    particleCount,
    radius,
    color,
    vx,
    vy,
  }: PatternCreatorInput): void {
    const numArms = 5;
    const armLength = 200;

    for (let i = 0; i < particleCount; i++) {
      const armIndex = i % numArms;
      const angle = (armIndex * (Math.PI * 2)) / numArms;
      const distance = (i / particleCount) * armLength;
      const x = this.canvas.width / 2 + Math.cos(angle) * distance;
      const y = this.canvas.height / 2 + Math.sin(angle) * distance;

      const particle = new Particle(x, y, {
        vx: vx ? vx() : 0,
        vy: vy ? vy() : 0,
        radius: radius ? radius() : 2,
        color: color ? color() : "white",
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createCirclePattern({
    behaviors,
    particleCount,
    radius,
    color,
    vx,
    vy,
  }: PatternCreatorInput): void {
    const circleRadius = 150;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * (Math.PI * 2);
      const x = this.canvas.width / 2 + Math.cos(angle) * circleRadius;
      const y = this.canvas.height / 2 + Math.sin(angle) * circleRadius;

      const particle = new Particle(x, y, {
        vx: vx ? vx() : 0,
        vy: vy ? vy() : 0,
        radius: radius ? radius() : 4,
        color: color ? color() : `hsl(${(i / particleCount) * 360}, 100%, 50%)`,
        behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createWavePattern({
    behaviors,
    particleCount,
    radius,
    color,
    vx,
    vy,
  }: PatternCreatorInput): void {
    const waveAmplitude = 100;
    const waveFrequency = 0.1;

    for (let i = 0; i < particleCount; i++) {
      const x = (i / particleCount) * this.canvas.width;
      const y =
        this.canvas.height / 2 + Math.sin(i * waveFrequency) * waveAmplitude;

      const particle = new Particle(x, y, {
        vx: vx ? vx() : 0,
        vy: vy ? vy() : 0,
        radius: radius ? radius() : 3,
        color: color ? color() : `hsl(${(i / particleCount) * 360}, 100%, 50%)`,
        behaviors: behaviors,
      });
      this.addParticle(particle);
    }
  }

  private createOrbitPattern({
    behaviors,
    particleCount,
    radius,
    color,
    vx,
    vy,
  }: PatternCreatorInput) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 200 + 50;
      const angle = Math.random() * Math.PI * 2;
      // const speed = Math.random() * 0.02 + 0.01;
      const particle = new Particle(
        centerX + Math.cos(angle) * r,
        centerY + Math.sin(angle) * r,
        {
          vx: vx ? vx() : 0,
          vy: vy ? vy() : 0,
          radius: radius ? radius() : 5,
          color: color ? color() : "white",
          behaviors: behaviors,
        }
      );
      this.particles.push(particle);
    }
  }
}
