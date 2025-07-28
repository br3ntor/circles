import { Vector2 } from "../game-objects/Vector2.js";
import { IGameObject } from "../game-objects/types";

export interface IBehavior {
  update(gameObject: IGameObject, deltaTime: number, time: number): void;
  handleCollision?(
    gameObject: IGameObject,
    other: IGameObject,
    position: Vector2,
    otherPosition: Vector2
  ): void;
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
  ) {
    for (const behavior of this.behaviors) {
      if (behavior.handleCollision) {
        behavior.handleCollision(gameObject, other, position, otherPosition);
      }
    }
  }
}
