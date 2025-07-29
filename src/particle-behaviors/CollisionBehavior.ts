import { IGameObject, Vector2 } from "../game-objects";
import { IBehavior } from "../managers/BehaviorManager";
import resolveCollision, { Collidable } from "../lib/elastic-collision";

export type CollisionBehaviorMode = "none" | "repel" | "resolve";

function isCollidable(obj: IGameObject): obj is Collidable {
  return obj.velocity !== undefined && obj.mass !== undefined;
}

export class CollisionBehavior implements IBehavior {
  mode: CollisionBehaviorMode;

  constructor(mode: CollisionBehaviorMode = "resolve") {
    this.mode = mode;
  }

  update(gameObject: IGameObject): void {
    // Collision detection is now handled by the central CollisionManager
  }

  handleCollision(
    gameObject: IGameObject,
    other: IGameObject,
    position1: Vector2,
    position2: Vector2
  ): CollisionBehaviorMode {
    if (this.mode === "resolve") {
      if (isCollidable(gameObject) && isCollidable(other)) {
        resolveCollision(gameObject, other, position1, position2);
      }
      return "resolve";
    } else if (this.mode === "repel") {
      // Apply a gentle repulsion force instead of an instant resolution
      const repulsionStrength = 10; // Adjust as needed
      const direction = position1.subtract(position2).normalize();
      const force = direction.multiply(repulsionStrength);
      if (gameObject.velocity && other.velocity) {
        gameObject.velocity = gameObject.velocity.add(force);
        other.velocity = other.velocity.subtract(force);
      }
      return "repel";
    }
    return "none";
  }
}
