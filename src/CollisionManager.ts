import type { Particle } from "./game-objects/Particle";
import type { Player } from "./game-objects/Player";
import type { Guardian } from "./game-objects/Guardian";
import { Vector2 } from "./game-objects/Vector2";

type Collidable = Particle | Player | Guardian;

export class CollisionManager extends EventTarget {
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
  }

  private getWrappedPositions(object: Collidable): Vector2[] {
    const positions: Vector2[] = [object.position];
    const { width, height } = this.canvas;
    const { x, y } = object.position;
    const r = object.radius;

    // Ghost positions for seamless wrapping
    if (x < r) positions.push(new Vector2(x + width, y));
    if (x > width - r) positions.push(new Vector2(x - width, y));
    if (y < r) positions.push(new Vector2(x, y + height));
    if (y > height - r) positions.push(new Vector2(x, y - height));

    // Corner ghosts
    if (x < r && y < r) positions.push(new Vector2(x + width, y + height));
    if (x > width - r && y < r)
      positions.push(new Vector2(x - width, y + height));
    if (x < r && y > height - r)
      positions.push(new Vector2(x + width, y - height));
    if (x > width - r && y > height - r)
      positions.push(new Vector2(x - width, y - height));

    return positions;
  }

  public checkCollisions(objects: Collidable[]): void {
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const obj1 = objects[i];
        const obj2 = objects[j];

        const obj1Positions = this.getWrappedPositions(obj1);

        for (const pos1 of obj1Positions) {
          // No need to wrap obj2's main position, as obj1's ghosts cover all cases.
          const distance = pos1.distanceTo(obj2.position);

          if (distance < obj1.radius + obj2.radius) {
            this.dispatchEvent(
              new CustomEvent("collision", {
                detail: {
                  object1: obj1,
                  object2: obj2,
                },
              })
            );
            // Prevent dispatching multiple events for the same pair in one frame
            return;
          }
        }
      }
    }
  }
}
