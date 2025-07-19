import { gameConfig } from "./game-config";
import { Game } from "./game";
import { Renderer } from "./Renderer";
import { Vector2 } from "./game-objects";

export default class TransitionManager {
  private game: Game;
  private renderer: Renderer;
  public isTransitioning: boolean = false;
  private transitionRadius: number = 0;
  private transitionDirection: "in" | "out" = "in";
  private transitionCenter: Vector2 = new Vector2(0, 0);
  private maxRadius: number;

  constructor(game: Game, renderer: Renderer) {
    this.game = game;
    this.renderer = renderer;
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

  public draw() {
    if (this.isTransitioning) {
      this.renderer.drawIrisWipe(this.transitionRadius, this.transitionCenter);
    }
  }

  public isFinished(): boolean {
    return !this.isTransitioning;
  }
}
