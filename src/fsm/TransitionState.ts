import { State } from "./State";
import { ReadyToStartState } from "./ReadyToStartState";
import TransitionManager from "../managers/TransitionManager";
import { Vector2 } from "../game-objects";

export class TransitionState extends State {
  public transitionPhase: "in" | "out" = "in";
  private transitionManager: TransitionManager;

  constructor(game: any) {
    super(game);
    this.transitionManager = new TransitionManager(this.game);
  }

  public enter(): void {
    this.transitionPhase = "in";
    // The "in" transition should center on the goal the player just reached
    const center = new Vector2(this.game.goal.x, this.game.goal.y);
    this.transitionManager.start("in", center);
  }

  public update(deltaTime: number): void {
    this.transitionManager.update(deltaTime);

    if (this.transitionPhase === "in" && this.transitionManager.isFinished()) {
      // --- The "in" phase is over, now we start the "out" phase ---
      this.transitionPhase = "out";

      // 1. Load the new level data (player position, etc.)
      this.game.levelManager.loadLevel();

      // 3. Start the "out" transition, centered on the new player position
      const center = new Vector2(this.game.player.x, this.game.player.y);
      this.transitionManager.start("out", center);
    } else if (
      this.transitionPhase === "out" &&
      this.transitionManager.isFinished()
    ) {
      // The "out" phase is over, the level is visible, start playing
      this.game.stateMachine.transitionTo(
        new ReadyToStartState(this.game, true)
      );
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // During both "in" and "out" transitions, we want to see the game objects.
    // The game state (player/guardian positions) is updated between the "in" and "out" phases.
    this.game.particleManager.draw(ctx);
    this.game.goal.draw(ctx);
    this.game.player.draw(ctx);
    this.game.guardians.forEach((g) => g.draw(ctx));

    if (this.transitionPhase === "out") {
      // The "Ready?" UI only appears for the new level.
      this.game.uiManager.drawReadyUI(ctx, this.game);
    }

    // The transition (iris wipe) is drawn on top of everything.
    this.transitionManager.draw(ctx);
  }
}
