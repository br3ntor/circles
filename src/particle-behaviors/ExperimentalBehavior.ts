import { Particle, ParticleBehavior, Vector2 } from "../game-objects";

export class ExperimentalBehavior implements ParticleBehavior {
  turnSpeed: number;

  constructor(turnSpeed: number = 1) {
    this.turnSpeed = turnSpeed;
  }

  update(particle: Particle, deltaTime: number, time: number): void {
    const speed = 10; // Constant speed
    const state = Math.floor(Math.random() * 4);

    let angle = 0;
    if (state === 0) {
      angle = 0; // Right
    } else if (state === 1) {
      angle = Math.PI / 2; // Down
    } else if (state === 2) {
      angle = Math.PI; // Left
    } else {
      angle = (3 * Math.PI) / 2; // Up
    }

    particle.velocity = new Vector2(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
  }
}
