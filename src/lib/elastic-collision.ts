import { IGameObject, Vector2 } from "../game-objects";

export interface Collidable extends IGameObject {
  velocity: Vector2;
  mass: number;
}

/**
 * Rotates a vector by a given angle.
 * @param velocity - The vector to rotate.
 * @param angle - The angle in radians.
 * @returns The rotated vector.
 */
function rotate(velocity: Vector2, angle: number): Vector2 {
  return new Vector2(
    velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  );
}

/**
 * Resolves elastic collisions between two particles.
 * @param particle - The first particle.
 * @param otherParticle - The second particle.
 * @param position1 - The collision position of the first particle.
 * @param position2 - The collision position of the second particle.
 */
export default function resolveCollision(
  particle: Collidable,
  otherParticle: Collidable,
  position1: Vector2,
  position2: Vector2
): void {
  // Calculate the difference in velocities.
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  // Calculate the distance between the particles' centers.
  const xDist = position2.x - position1.x;
  const yDist = position2.y - position1.y;

  // Prevent resolving collisions for particles moving away from each other.
  // This is checked by taking the dot product of the relative velocity and the distance vector.
  // If the result is positive, the particles are moving towards each other.
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Calculate the angle of the collision axis.
    const angle = -Math.atan2(yDist, xDist);

    // Store mass of each particle for easier access.
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Rotate the velocity vectors to align with the collision axis (1D problem).
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Apply the 1D elastic collision formula.
    // The x-component of velocity is changed, while the y-component remains the same.
    const v1 = new Vector2(
      (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      u1.y
    );
    const v2 = new Vector2(
      (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      u2.y
    );

    // Rotate the new velocity vectors back to the original coordinate system.
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Update the particles' velocities.
    particle.velocity = vFinal1;
    otherParticle.velocity = vFinal2;

    // Positional correction to prevent particles from sticking together.
    // This can happen due to floating point inaccuracies or discrete time steps.
    const overlap =
      particle.radius + otherParticle.radius - position1.distanceTo(position2);
    if (overlap > 0) {
      // Move each particle back along the collision axis by half the overlap distance.
      // const correction = position2
      //   .subtract(position1)
      //   .normalize()
      //   .multiply(overlap / 2);
      // particle.position = particle.position.subtract(correction);
      // otherParticle.position = otherParticle.position.add(correction);
    }
  }
}
