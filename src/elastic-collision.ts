import { Vector2 } from "./game-objects";

interface Collidable {
  velocity: Vector2;
  mass: number;
  radius: number;
  position: Vector2;
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
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = position2.x - position1.x;
  const yDist = position2.y - position1.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    const angle = -Math.atan2(yDist, xDist);
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    const v1 = new Vector2(
      (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      u1.y
    );
    const v2 = new Vector2(
      (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      u2.y
    );

    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    particle.velocity = vFinal1;
    otherParticle.velocity = vFinal2;

    // Positional correction to prevent sticking
    const overlap =
      particle.radius + otherParticle.radius - position1.distanceTo(position2);
    if (overlap > 0) {
      const correction = position2
        .subtract(position1)
        .normalize()
        .multiply(overlap / 2);
      particle.position = particle.position.subtract(correction);
      otherParticle.position = otherParticle.position.add(correction);
    }
  }
}
