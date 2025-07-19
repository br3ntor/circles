import { State } from "./State";
import { ReadyToStartState } from "./ReadyToStartState";
import { Vector2 } from "../game-objects";
import { levels } from "../level-configs";

export class TransitionState extends State {
  private transitionPhase: "in" | "out" = "in";
  private transitionRadius: number = 0;
  private transitionCenter: Vector2 = new Vector2(0, 0);
  private transitionSpeed: number = 1500; // Pixels per second

  public enter(): void {
    this.transitionPhase = "in";
    this.transitionCenter = new Vector2(this.game.goal.x, this.game.goal.y);
    this.transitionRadius =
      Math.max(this.game.canvas.width, this.game.canvas.height) * 1.5;
  }

  public update(deltaTime: number): void {
    if (this.transitionPhase === "in") {
      // Wipe in (shrinking circle)
      this.transitionRadius -= this.transitionSpeed * deltaTime;
      if (this.transitionRadius <= 0) {
        this.transitionRadius = 0;
        this.transitionPhase = "out"; // Switch to wipe out
        this.game.currentLevel++;
        if (this.game.currentLevel >= levels.length) {
          this.game.currentLevel = 0; // Loop back to the first level
        }
        this.game.loadLevel(); // Load next level behind the curtain
        this.transitionCenter = new Vector2(
          this.game.player.x,
          this.game.player.y
        );
      }
    } else {
      // Wipe out (expanding circle)
      this.transitionRadius += this.transitionSpeed * deltaTime;
      const maxRadius =
        Math.max(this.game.canvas.width, this.game.canvas.height) * 1.5;
      if (this.transitionRadius >= maxRadius) {
        // End of transition
        this.game.stateMachine.transitionTo(new ReadyToStartState(this.game));
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // When wiping in, we draw the previous state underneath
    if (this.transitionPhase === "in") {
      this.game.particleSystem.draw(ctx);
      this.game.player.draw(ctx);
      this.game.goal.draw(ctx);
      this.game.guardians.forEach((guardian) => guardian.draw(ctx));
    } else {
      // When wiping out, draw the new level
      this.game.particleSystem.draw(ctx);
      this.game.player.draw(ctx);
      this.game.goal.draw(ctx);
      this.game.guardians.forEach((guardian) => guardian.draw(ctx));
      this.drawReadyUI(ctx);
    }

    this.drawIrisWipe(ctx);
  }

  private drawIrisWipe(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = "#DEDEDE";

    // Outer rectangle path
    ctx.beginPath();
    ctx.rect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // Inner circle path (counter-clockwise)
    ctx.arc(
      this.transitionCenter.x,
      this.transitionCenter.y,
      this.transitionRadius,
      0,
      Math.PI * 2,
      true // Counter-clockwise
    );

    // Fill the path using the even-odd rule to create a hole
    ctx.fill("evenodd");

    ctx.restore();
  }
}
