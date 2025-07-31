import { Game } from "../game";
import { Particle } from "../game-objects/Particle";
import { State } from "./State";

export abstract class LevelState extends State {
  constructor(game: Game) {
    super(game);
  }

  public enter(): void {
    this.game.collisionManager.addEventListener(
      "collision-start",
      this.handleCollisionEvent
    );
  }

  public exit(): void {
    this.game.collisionManager.removeEventListener(
      "collision-start",
      this.handleCollisionEvent
    );
  }

  private handleCollisionEvent = (event: Event) => {
    this.onCollisionStart(event);
  };

  protected onCollisionStart(event: Event) {
    const customEvent = event as CustomEvent;
    const { object1, object2, position1, position2 } = customEvent.detail;

    const p1 = object1 instanceof Particle ? object1 : null;
    const p2 = object2 instanceof Particle ? object2 : null;

    if (p1 && p2) {
      // It's important to call handleCollision on both particles, as they might have different behaviors.
      const type1 = p1.behaviorManager.handleCollision(
        p1,
        p2,
        position1,
        position2
      );
      const type2 = p2.behaviorManager.handleCollision(
        p2,
        p1,
        position2,
        position1
      );

      // Determine the effective collision type. 'repel' takes precedence.
      let effectiveCollisionType: "repel" | "resolve" | "none" = "none";
      if (type1 === "repel" || type2 === "repel") {
        effectiveCollisionType = "repel";
      } else if (type1 === "resolve" || type2 === "resolve") {
        effectiveCollisionType = "resolve";
      }

      // Play sound only for specific collision types.
      if (
        effectiveCollisionType === "repel" ||
        effectiveCollisionType === "resolve"
      ) {
        this.game.soundManager.playSound("particle-collision");
      }
    }
  }

  public update(deltaTime: number, time: number): void {
    this.game.particleManager.update(deltaTime, time);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleManager.draw(ctx);
  }
}
