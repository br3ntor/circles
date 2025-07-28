import { IBehavior } from "../managers/BehaviorManager";
import { IGameObject } from "../game-objects/types";
import { Guardian } from "../game-objects/Guardian";
import { Goal } from "../game-objects/Goal";
import { Vector2 } from "../game-objects/Vector2";
import { getHSL } from "../utils/utils";

export class GuardianOrbitBehavior implements IBehavior {
  constructor(private goal: Goal) {}

  update(gameObject: IGameObject, deltaTime: number, time: number): void {
    const guardian = gameObject as Guardian;
    if (guardian.state === "returned") {
      return;
    }
    const lastPosition = new Vector2(guardian.position.x, guardian.position.y);

    // Circular Motion
    guardian.radians += guardian.circlVelocity;

    // Update position based on current distanceFromCenter and initial radians
    guardian.position.x =
      this.goal.x + Math.cos(guardian.radians) * guardian.distanceFromCenter;
    guardian.position.y =
      this.goal.y + Math.sin(guardian.radians) * guardian.distanceFromCenter;

    if (guardian.state === "returning") {
      // Inverse circular motion: return to startPosition
      const initialDistanceFromCenter = 50; // Assuming this is the initial distance from createGuardians
      const returnSpeed = 3; // Adjust as needed

      if (guardian.distanceFromCenter > initialDistanceFromCenter) {
        // Srink the circle over time
        guardian.distanceFromCenter = Math.max(
          initialDistanceFromCenter,
          guardian.distanceFromCenter - returnSpeed
        );
      } else {
        guardian.distanceFromCenter = initialDistanceFromCenter; // Ensure it doesn't go below initial
        guardian.state = "returned";
        guardian.velocity = new Vector2(0, 0); // Set velocity to zero
      }
    } else {
      // Expand the circle over time
      if (guardian.distanceFromCenter < 300) {
        guardian.distanceFromCenter += 0.5;
      }
    }

    // Reset back to transparent after collision
    if (guardian.opacity > 0.02) {
      guardian.opacity -= 0.02;
      guardian.opacity = Math.max(0, guardian.opacity);
    }

    // Changes back to original color
    if (guardian.color !== "hsl(56deg, 0%, 87%)") {
      const hsl = getHSL(guardian.color);
      if (hsl) {
        let h = hsl.H;
        if (h > 56) {
          h = Math.max(56, h - 1);
        } else if (h < 56) {
          h = Math.min(56, h + 1);
        }

        const s = Math.max(0, hsl.S - 1);

        let l = hsl.L;
        if (l > 87) {
          l = Math.max(87, l - 1);
        } else if (l < 87) {
          l = Math.min(87, l + 1);
        }
        guardian.color = `hsl(${h}deg, ${s}%, ${l}%)`;
      }
    }

    // Only update velocity if not returning and stopped
    if (guardian.state !== "returning") {
      guardian.velocity.x = (guardian.position.x - lastPosition.x) * 3;
      guardian.velocity.y = (guardian.position.y - lastPosition.y) * 3;
    }
  }
}
