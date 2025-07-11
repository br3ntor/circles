import resolveCollision from "./elastic-collision.ts";
import { distance, getHSL } from "./utils.ts";

/**
 * Particles move through space at a given velocity
 * until they collide with a wall, another particle,
 * or the player. Or perhaps manipulated with a function.
 */
export class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  hue: number;
  velocity: { x: number; y: number };
  wallCollision: boolean;
  mass: number;
  opacity: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    xSpeed: number,
    ySpeed: number,
    wallCollision = true
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.hue = parseFloat(this.color.slice(4, this.color.indexOf("d")));
    this.velocity = {
      x: xSpeed,
      y: ySpeed,
    };
    this.wallCollision = wallCollision;
    this.mass = 1; // Used in elastic collision
    this.opacity = 0.2;
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

  /**
   * Propells particles through space
   * Collision with other particles,
   * optional wall collision
   * Can I abstract this to smaller
   * particle methods?
   */
  update(ctx: CanvasRenderingContext2D, particles: Particle[], player: Player) {
    this.draw(ctx);

    // Loop over particles for collision detection
    for (let i = 0; i < particles.length; i++) {
      // Never compare particle to itself, skips if true.
      if (this === particles[i]) continue;

      const dist = distance(this.x, this.y, particles[i].x, particles[i].y);

      if (dist - this.radius - particles[i].radius < 0) {
        // Elastic collision
        resolveCollision(this, particles[i]);

        // Light up particles on collision
        this.opacity = 0.6;
        particles[i].opacity = 0.6;
      }
    }

    // Reset back to transparent after collision
    if (this.opacity > 0.02) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    // Particles collide with walls if option set true
    if (this.wallCollision) {
      if (this.x - this.radius < 0 || this.x + this.radius >= innerWidth) {
        this.velocity.x = -this.velocity.x;
      }
      if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
        this.velocity.y = -this.velocity.y;
      }
      // Else the particles come back on other side if they travel offscreen
    } else {
      const space = 0; // Extra space offscreen
      if (this.x - this.radius > innerWidth + space) this.x = 0 - this.radius;
      if (this.x + this.radius < 0 - space) this.x = innerWidth + this.radius;
      if (this.y - this.radius > innerHeight + space) this.y = 0 - this.radius;
      if (this.y + this.radius < 0 - space) this.y = innerHeight + this.radius;
    }

    // Player object collision (should I handle in player class?)
    const playerDistance = distance(this.x, this.y, player.x, player.y);

    if (playerDistance - this.radius - player.radius <= 0) {
      this.opacity = 1;
      return true;
    }

    // Set particles to next position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // console.log(parseFloat(this.color.slice(4, this.color.indexOf("d"))));
    // console.log(parseFloat(this.color.slice(4, this.color.indexOf("d"))));
    // console.log(this.hue);

    // Update color
    if (this.hue >= 360) {
      this.hue = 0;
    } else {
      this.color = `hsl(${this.hue}deg, 100%, 50%)`;
      this.hue += 0.4;
    }
  }
}

/**
 * Guardians protect and guard the goal
 */

export class Guardian {
  x: number;
  y: number;
  radius: number;
  radians: number;
  color: string;
  opacity: number;
  circlVelocity: number;
  distanceFromCenter: number;
  velocity: { x: number; y: number };
  mass: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    radians = 0,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.radians = radians;
    this.color = color;
    this.opacity = 0.2;
    this.circlVelocity = 0.005;
    this.distanceFromCenter = 50;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.mass = 1;
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
    ctx.closePath(); // Not sure if necessary
  }

  update(ctx: CanvasRenderingContext2D, particles: Particle[], player: Player) {
    const x = this.x;
    const y = this.y;
    // Loop over particles to check for collision with guardians
    for (let i = 0; i < particles.length; i++) {
      const dist = distance(this.x, this.y, particles[i].x, particles[i].y);

      // Particles intersect with guardians here
      if (dist - this.radius - particles[i].radius < 0) {
        // resolveCollision(this, particles[i]);

        // Circles get boosted when intersecting with mid circles
        // particles[i].velocity.x += particles[i].velocity.x * 0.02;
        // particles[i].velocity.y += particles[i].velocity.y * 0.02;

        // Light up particles and guardian on collision
        this.opacity = 0.6;
        particles[i].opacity = 0.6;
        this.color = particles[i].color;
      } else {
        // this.color = "green";
        // if (this.color !== "hsl(0deg, 0%, 100%)") {
        //   const hsl = getHSL(this.color);
        //   const h = Math.max(0, hsl.H - 1);
        //   const s = Math.max(0, hsl.S - 1);
        //   const l = Math.min(100, hsl.L + 1);
        //   this.color = `hsl(${h}deg, ${s}%, ${l}%)`;
        //   // console.log(this.color);
        // }
      }
    }

    // Reset back to transparent after collision
    if (this.opacity > 0.02) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    if (this.color !== "hsl(0deg, 0%, 100%)") {
      const hsl = getHSL(this.color);
      const h = Math.max(0, hsl.H - 1);
      const s = Math.max(0, hsl.S - 1);
      const l = Math.min(100, hsl.L + 1);
      this.color = `hsl(${h}deg, ${s}%, ${l}%)`;
      // console.log(this.color);
    }

    // Move points over time
    this.radians += this.circlVelocity;

    // Circular Motion
    this.x =
      innerWidth / 1.2 + Math.cos(this.radians) * this.distanceFromCenter;
    this.y = innerHeight / 2 + Math.sin(this.radians) * this.distanceFromCenter;

    // Check distance from last point
    // console.log((this.x - x) * 3);
    this.velocity.x = (this.x - x) * 3;
    this.velocity.y = (this.y - y) * 3;

    // this.x = this.x + Math.cos(this.radians) * 2;
    // this.y = this.y + Math.sin(this.radians) * 2;

    // Expand the circle over time
    if (this.distanceFromCenter < 300) {
      this.distanceFromCenter += 0.5;
    }

    // Player object collision (should I handle in player class?)
    // This is the second object checking for player collision, maybe
    // the player should be checking all the objects instead
    const playerDistance = distance(this.x, this.y, player.x, player.y);

    if (playerDistance - this.radius - player.radius <= 0) {
      this.opacity = 1;
      return true;
    }

    this.draw(ctx);
  }
}

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
