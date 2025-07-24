import { distance } from "../utils.js";
import { Player } from "./Player.js";

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
