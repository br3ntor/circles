import { BehaviorManager } from "../managers/BehaviorManager.js";
import { distance } from "../lib/utils.js";
import { Player } from "./Player.js";
import { IGameObject } from "./types.js";
import { Vector2 } from "./Vector2.js";

export class Goal implements IGameObject {
  id: string;
  static nextId = 0;
  position: Vector2;
  x: number;
  y: number;
  radius: number;
  fill: boolean;
  behaviorManager: BehaviorManager;

  constructor(x: number, y: number, radius: number) {
    this.id = `goal-${Goal.nextId++}`;
    this.position = new Vector2(x, y);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = false;
    this.behaviorManager = new BehaviorManager();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    if (this.fill === true) {
      ctx.fillStyle = "#DEDEDE";
      ctx.fill();
    } else {
      ctx.strokeStyle = "#DEDEDE";
      ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
  }

  update(
    ctx: CanvasRenderingContext2D,
    player: Player,
    deltaTime: number,
    time: number
  ) {
    this.behaviorManager.update(this, deltaTime, time);
    // Collision detection for player entering goal
    this.draw(ctx);
    const dist = distance(this.position.x, this.position.y, player.x, player.y);
    if (dist < this.radius - player.radius) {
      this.fill = true;
      return true;
    } else {
      this.fill = false;
      return false;
    }
  }
}
