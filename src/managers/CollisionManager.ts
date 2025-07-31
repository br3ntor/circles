import type { Goal } from "../game-objects/Goal";
import { Particle } from "../game-objects/Particle";
import type { Player } from "../game-objects/Player";
import type { Guardian } from "../game-objects/Guardian";
import { Vector2 } from "../game-objects/Vector2";
import { WallBehavior } from "../particle-behaviors";

type Collidable = Particle | Player | Guardian | Goal;

export class CollisionManager extends EventTarget {
  private canvas: HTMLCanvasElement;
  private activeCollisions = new Set<string>();

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
  }

  private getCollisionKey(obj1: Collidable, obj2: Collidable): string {
    // Ensure consistent order for the key
    const ids = [obj1.id, obj2.id].sort();
    return ids.join("-");
  }

  public getWrappedPositions(object: Collidable): Vector2[] {
    const positions: Vector2[] = [object.position];

    // Only apply wrapping logic for particles with seamless wall behavior
    if (object instanceof Particle) {
      const wallBehavior = object.behaviorManager.findBehavior(
        (b) => b instanceof WallBehavior
      ) as WallBehavior | undefined;

      if (wallBehavior?.mode === "seamless") {
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
      }
    }

    return positions;
  }

  public checkCollisions(
    objects: Exclude<Collidable, Goal>[],
    goal?: Goal
  ): void {
    const currentFrameCollisions = new Set<string>();

    // Reset ghost collision flags
    for (const obj of objects) {
      if ("isGhostColliding" in obj) {
        obj.isGhostColliding = false;
      }
    }

    if (goal) {
      this.checkParticleGoalCollisions(
        objects.filter((obj) => obj instanceof Particle) as Particle[],
        goal
      );
    }

    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const obj1 = objects[i];
        const obj2 = objects[j];

        const obj1Positions = this.getWrappedPositions(obj1);
        const obj2Positions = this.getWrappedPositions(obj2);

        for (const pos1 of obj1Positions) {
          for (const pos2 of obj2Positions) {
            if (pos1.distanceTo(pos2) < obj1.radius + obj2.radius) {
              const collisionKey = this.getCollisionKey(obj1, obj2);
              currentFrameCollisions.add(collisionKey);

              if (!this.activeCollisions.has(collisionKey)) {
                // New collision
                this.activeCollisions.add(collisionKey);
                this.dispatchEvent(
                  new CustomEvent("collision-start", {
                    detail: {
                      object1: obj1,
                      object2: obj2,
                      position1: pos1,
                      position2: pos2,
                    },
                  })
                );
              }

              // Handle ghost collision flags
              if (pos1 !== obj1.position && "isGhostColliding" in obj1) {
                obj1.isGhostColliding = true;
              }
              if (pos2 !== obj2.position && "isGhostColliding" in obj2) {
                obj2.isGhostColliding = true;
              }

              // Break from inner loops once a collision is found for the pair
              goto_next_pair: break;
            }
          }
          // Label for goto
          // @ts-ignore
          if (typeof goto_next_pair !== "undefined") break;
        }
      }
    }

    // Check for ended collisions
    for (const key of this.activeCollisions) {
      if (!currentFrameCollisions.has(key)) {
        const [id1, id2] = key.split("-");
        const obj1 = objects.find((o) => o.id === id1);
        const obj2 = objects.find((o) => o.id === id2);
        if (obj1 && obj2) {
          this.dispatchEvent(
            new CustomEvent("collision-end", {
              detail: { object1: obj1, object2: obj2 },
            })
          );
        }
        this.activeCollisions.delete(key);
      }
    }
  }

  public checkParticleGoalCollisions(particles: Particle[], goal: Goal): void {
    for (const particle of particles) {
      const distance = particle.position.distanceTo(goal.position);
      if (distance < particle.radius + goal.radius) {
        // Collision detected, dispatch an event
        this.dispatchEvent(
          new CustomEvent("particle-goal-collision", {
            detail: {
              particle,
              goal,
            },
          })
        );
      }
    }
  }
}
