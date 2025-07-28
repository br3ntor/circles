import type { Goal } from "../game-objects/Goal";
import type { Particle } from "../game-objects/Particle";
import type { Player } from "../game-objects/Player";
import type { Guardian } from "../game-objects/Guardian";
import { Vector2 } from "../game-objects/Vector2";

type Collidable = Particle | Player | Guardian | Goal;

export class CollisionManager extends EventTarget {
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
  }

  public getWrappedPositions(object: Collidable): Vector2[] {
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

  public checkCollisions(
    objects: Exclude<Collidable, Goal>[],
    goal: Goal
  ): void {
    // Reset ghost collision flags at the beginning of the check
    for (const obj of objects) {
      if ("isGhostColliding" in obj) {
        obj.isGhostColliding = false;
      }
    }

    this.checkParticleGoalCollisions(
      objects.filter((obj) => "velocity" in obj) as Particle[],
      goal
    );

    pair_loop: for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const obj1 = objects[i];
        const obj2 = objects[j];

        const obj1Positions = this.getWrappedPositions(obj1);
        const obj2Positions = this.getWrappedPositions(obj2);

        for (const pos1 of obj1Positions) {
          for (const pos2 of obj2Positions) {
            const distance = pos1.distanceTo(pos2);

            if (distance < obj1.radius + obj2.radius) {
              const isObj1Ghost = pos1 !== obj1.position;
              const isObj2Ghost = pos2 !== obj2.position;

              if (isObj1Ghost && "isGhostColliding" in obj1) {
                obj1.isGhostColliding = true;
              }
              if (isObj2Ghost && "isGhostColliding" in obj2) {
                obj2.isGhostColliding = true;
              }

              this.dispatchEvent(
                new CustomEvent("collision", {
                  detail: {
                    object1: obj1,
                    object2: obj2,
                    position1: pos1,
                    position2: pos2,
                  },
                })
              );
              // Prevent dispatching multiple events for the same pair in one frame
              continue pair_loop;
            }
          }
        }
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
