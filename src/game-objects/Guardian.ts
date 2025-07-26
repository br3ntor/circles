import { distance, getHSL } from "../utils.js";
import { Goal } from "./Goal.js";
import { Particle } from "./Particle.js";
import { Player } from "./Player.js";
import { GuardianState } from "./types.js";
import { Vector2 } from "./Vector2.js";

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

    // Reset back to transparent after collision
    if (this.opacity > 0.02) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    // Changes back to original color
    if (this.color !== "hsl(56deg, 0%, 87%)") {
      const hsl = getHSL(this.color);
      if (hsl) {
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
    }

    // Only update velocity if not returning and stopped
    if (this.state !== "returning") {
      this.velocity.x = (this.position.x - lastPosition.x) * 3;
      this.velocity.y = (this.position.y - lastPosition.y) * 3;
    }
  }

  handleCollision(collidingObject: Player | Particle) {
    // Light up particles and guardian on collision
    this.opacity = 0.6;
    this.color = collidingObject.color;
    if ("fillOpacity" in collidingObject) {
      collidingObject.fillOpacity = 1;
    }
  }
}
