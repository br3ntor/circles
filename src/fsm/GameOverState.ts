import { State } from "./State";
import { Game } from "../game";
import { Guardian, Particle, Vector2 } from "../game-objects";

export class GameOverState extends State {
  public collidedObject: Particle | Guardian;
  public collisionPosition: Vector2;
  public fadeAlpha: number = 0;

  constructor(
    game: Game,
    collidedObject: Particle | Guardian,
    collisionPosition: Vector2
  ) {
    super(game);
    this.collidedObject = collidedObject;
    this.collisionPosition = collisionPosition;
  }

  public enter(): void {
    this.game.timer.stop();
  }

  public update(deltaTime: number, time: number): void {
    if (this.fadeAlpha < 1) {
      this.fadeAlpha += 0.01; // A simple fade-in speed
      this.fadeAlpha = Math.min(this.fadeAlpha, 1);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleManager.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.player.draw(ctx);
    this.game.guardians.forEach((g) => g.draw(ctx));

    const { fadeAlpha, collidedObject } = this;

    // Draw a glowing effect around the collided object
    if (collidedObject) {
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "red";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      const positions =
        this.game.collisionManager.getWrappedPositions(collidedObject);
      for (const pos of positions) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, collidedObject.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    this.game.uiManager.drawGameOverUI(ctx, fadeAlpha, this.game.canvas);
  }

  public exit(): void {}

  public handleInput(event: KeyboardEvent | MouseEvent) {
    if (this.fadeAlpha >= 0.8) {
      this.game.reset();
    }
  }
}
