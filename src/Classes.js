import resolveCollision from "./util-elastic-collision";
import { distance, randInt } from "./utils";

export class Particle {
  constructor(
    x,
    y,
    radius,
    color,
    xSpeed,
    ySpeed,
    wallCollision = true,
    radians = 0
  ) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: xSpeed,
      y: ySpeed,
    };
    this.circlVelocity = 0.003;
    this.radius = radius;
    this.color = color;
    this.mass = 1; // Used in elastic collision
    this.opacity = 0.2;
    this.wallCollision = wallCollision;

    // this.radians = Math.random() * Math.PI * 2;
    this.radians = radians;

    // this.distanceFromCenter = {
    //   x: randInt(50, 120),
    //   y: randInt(50, 120),
    // };
    // this.distanceFromCenter = randInt(100, 220);
    this.distanceFromCenter = 120;

    this.lastMouse = { x: x, y: y };
  }

  draw(ctx) {
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

  // circleDraw(ctx, lastPoint) {
  //   ctx.beginPath();
  //   ctx.strokeStyle = this.color;
  //   ctx.lineWidth = this.radius;
  //   ctx.moveTo(lastPoint.x, lastPoint.y);
  //   ctx.lineTo(this.x, this.y);
  //   // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

  //   ctx.stroke();
  //   ctx.closePath();
  // }

  circleUpdate(ctx, mouse) {
    const lastPoint = { x: this.x, y: this.y };
    // const r = angle * Math.PI * 2;

    // Move points over time
    // this.radians += this.circlVelocity;

    // Drag effect
    // this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
    // this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

    // Circular Motion
    this.x = innerWidth / 2 + Math.cos(this.radians) * this.distanceFromCenter;
    this.y = innerHeight / 2 + Math.sin(this.radians) * this.distanceFromCenter;

    // this.x = mouse.x + Math.cos(this.radians) * this.distanceFromCenter;
    // this.y = mouse.y + Math.sin(this.radians) * this.distanceFromCenter;

    // this.x =
    //   this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
    // this.y =
    //   this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;

    // if (this.x < innerWidth) {
    //   this.distanceFromCenter += 0.5;
    // }

    this.draw(ctx);
    // this.circleDraw(ctx, lastPoint);
  }

  update(ctx, particles, player) {
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

    // Collision detection for walls
    if (this.wallCollision) {
      if (this.x - this.radius < 0 || this.x + this.radius >= innerWidth) {
        this.velocity.x = -this.velocity.x;
      }
      if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
        this.velocity.y = -this.velocity.y;
      }
    } else {
      const space = 0; // Extra offscreen space
      // Particles can go offscreen and come back opposite side
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
  }
}

export class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx, wall, mouse) {
    this.draw(ctx);
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const angle = Math.atan2(dy, dx);
    const xVelocity = Math.cos(angle) * this.speed;
    const yVelocity = Math.sin(angle) * this.speed;

    // Only update player if distance from mouse greater than 2
    // I must be able to simplify this if else chain though, maybe?
    // Gross disgusting 3am code
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      if (wall) {
        if (this.x + this.radius >= 95 && dx > 2) {
          this.x = 95 - this.radius;
        } else {
          this.x += xVelocity;
        }
      } else {
        this.x += xVelocity;
      }

      this.y += yVelocity;
    }

    // Collision for walls
    if (this.x - this.radius <= 0) this.x = this.radius + 1;
    if (this.x + this.radius >= innerWidth) this.x = innerWidth - this.radius;
    if (this.y - this.radius <= 0) this.y = this.radius + 1;
    if (this.y + this.radius >= innerHeight) this.y = innerHeight - this.radius;
  }
}

export class Goal {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = false;
  }

  draw(ctx) {
    if (this.fill === true) {
      ctx.fillStyle = "#7bf977";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.strokeStyle = "#7bf977";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  update(ctx, player) {
    this.draw(ctx);
    if (
      player.x - player.radius > this.x &&
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
