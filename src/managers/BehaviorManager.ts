import { Vector2 } from "../game-objects/Vector2.js";
import { IGameObject } from "../game-objects/types";
import { CollisionBehaviorMode } from "../particle-behaviors/CollisionBehavior.js";

export interface IBehavior {
  update(gameObject: IGameObject, deltaTime: number, time: number): void;
  handleCollision?(
    gameObject: IGameObject,
    other: IGameObject,
    position: Vector2,
    otherPosition: Vector2
  ): CollisionBehaviorMode | void;
}

export class BehaviorManager {
  private behaviors: IBehavior[] = [];

  addBehavior(behavior: IBehavior) {
    this.behaviors.push(behavior);
  }

  removeBehavior(behavior: IBehavior) {
    const index = this.behaviors.indexOf(behavior);
    if (index !== -1) {
      this.behaviors.splice(index, 1);
    }
  }

  findBehavior(predicate: (behavior: IBehavior) => boolean) {
    return this.behaviors.find(predicate);
  }

  update(gameObject: IGameObject, deltaTime: number, time: number) {
    for (const behavior of this.behaviors) {
      behavior.update(gameObject, deltaTime, time);
    }
  }

  handleCollision(
    gameObject: IGameObject,
    other: IGameObject,
    position: Vector2,
    otherPosition: Vector2
  ): CollisionBehaviorMode | "none" {
    let collisionMode: CollisionBehaviorMode | "none" = "none";
    for (const behavior of this.behaviors) {
      if (behavior.handleCollision) {
        const result = behavior.handleCollision(
          gameObject,
          other,
          position,
          otherPosition
        );
        // A behavior can return a mode. If it does, we store it.
        // This allows multiple collision behaviors to run, with the last one
        // determining the "type" of collision for sound purposes.
        if (result && result !== "none") {
          collisionMode = result;
        }
      }
    }
    return collisionMode;
  }
}
