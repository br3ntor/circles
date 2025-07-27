import { gameConfig } from "../config/game-config";
import { Game } from "../game";
import { Vector2 } from "../game-objects";

export default class TransitionManager {
  private game: Game;
  public isTransitioning: boolean = false;
  private transitionRadius: number = 0;
  private transitionDirection: "in" | "out" = "in";
  private transitionCenter: Vector2 = new Vector2(0, 0);
  private maxRadius: number;

  constructor(game: Game) {
    this.game = game;
    this.maxRadius =
      Math.max(this.game.canvas.width, this.game.canvas.height) * 1.5;
  }

  public start(direction: "in" | "out", center: Vector2) {
    this.isTransitioning = true;
    this.transitionDirection = direction;
    this.transitionCenter = center;

    if (direction === "in") {
      // Starts big and shrinks to nothing
      this.transitionRadius = this.maxRadius;
    } else {
      // Starts at nothing and expands
      this.transitionRadius = 0;
    }
  }

  public update(deltaTime: number) {
    if (!this.isTransitioning) return;

    const speed = gameConfig.transitions.speed;

    if (this.transitionDirection === "in") {
      this.transitionRadius -= speed * deltaTime;
      if (this.transitionRadius <= 0) {
        this.transitionRadius = 0;
        this.isTransitioning = false;
      }
    } else {
      // out
      this.transitionRadius += speed * deltaTime;
      if (this.transitionRadius >= this.maxRadius) {
        this.transitionRadius = this.maxRadius;
        this.isTransitioning = false;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.isTransitioning) {
      this.drawIrisWipe(ctx, this.transitionRadius, this.transitionCenter);
    }
  }

  private drawIrisWipe(
    ctx: CanvasRenderingContext2D,
    radius: number,
    center: Vector2
  ) {
    // This creates a "mask" that covers everything *except* a circle
    ctx.save();
    ctx.fillStyle = "#DEDEDE"; // Use the canvas background color

    // 1. Draw a rectangle covering the whole screen
    ctx.beginPath();
    ctx.rect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // 2. Create a circular path for the "hole"
    // The `true` for counter-clockwise is important for the 'evenodd' rule
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);

    // 3. Fill the shape. "evenodd" creates a hole where paths overlap.
    ctx.fill("evenodd");

    ctx.restore();
  }

  public isFinished(): boolean {
    return !this.isTransitioning;
  }
}
