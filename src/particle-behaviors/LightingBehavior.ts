import { IGameObject } from "../game-objects/types";
import { IBehavior } from "../managers/BehaviorManager";

export type LightingBehaviorMode = "none" | "lightUp";

export class LightingBehavior implements IBehavior {
  mode: LightingBehaviorMode;

  constructor(mode: LightingBehaviorMode = "lightUp") {
    this.mode = mode;
  }

  update(gameObject: IGameObject): void {
    // This behavior might have time-based lighting effects in the future
  }

  handleCollision(gameObject: IGameObject, other: IGameObject) {
    if (this.mode === "lightUp") {
      gameObject.fillOpacity = 0.8;
      other.fillOpacity = 0.8;
    }
  }
}
