import { Particle, ParticleBehavior } from "../game-objects";

export class SinusoidalMovement implements ParticleBehavior {
  private canvas: HTMLCanvasElement;
  private amplitude: number;
  private frequency: number;
  private initialY: number | null = null;
  private actualAmplitude: number;

  constructor(
    canvas: HTMLCanvasElement,
    amplitude: number = 100,
    frequency = 1
  ) {
    this.canvas = canvas;
    this.amplitude = amplitude;
    this.frequency = frequency;

    // A value of -1 for amplitude means we want it to fill the canvas height
    this.actualAmplitude =
      this.amplitude === -1 ? this.canvas.height / 2 : this.amplitude;
  }

  update(particle: Particle, deltaTime: number, time: number): void {
    if (this.initialY === null) {
      // We'll oscillate around the center of the canvas
      this.initialY = this.canvas.height / 2;
    }

    // We directly set the y position to create the wave.
    // The particle's x velocity will continue to move it forward.
    particle.position.y =
      this.initialY + this.actualAmplitude * Math.sin(this.frequency * time);
  }
}
