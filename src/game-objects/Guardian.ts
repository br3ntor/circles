import { BehaviorManager } from "../managers/BehaviorManager.js";
import { GuardianOrbitBehavior } from "../particle-behaviors/GuardianOrbitBehavior.js";
import { Goal } from "./Goal.js";
import { Particle } from "./Particle.js";
import { Player } from "./Player.js";
import { GuardianState, IGameObject } from "./types.js";
import { Vector2 } from "./Vector2.js";

export class Guardian implements IGameObject {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  radians: number;
  color: string;
  opacity: number;
  circlVelocity: number;
  distanceFromCenter: number;
  state: GuardianState;
  behaviorManager: BehaviorManager;

  constructor(
    x: number,
    y: number,
    radius: number,
    goal: Goal,
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
    this.behaviorManager = new BehaviorManager();
    this.behaviorManager.addBehavior(new GuardianOrbitBehavior(goal));
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
  update(deltaTime: number, time: number) {
    this.behaviorManager.update(this, deltaTime, time);
  }

  handleCollision(collidingObject: Player | Particle) {
    // Light up particles and guardian on collision
    this.opacity = 0.6;
    this.color = collidingObject.color;
    if ("fillOpacity" in collidingObject) {
      collidingObject.fillOpacity = 0.3;
    }
  }
}
