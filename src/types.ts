import { Particle } from "./game-objects";

export type ParticleProps = {
  // Position
  x: number;
  y: number;

  // Appearance
  radius: number;
  color: string;

  // Movement
  dx: number;
  dy: number;

  // Behavior
  wallCollision: boolean;
};

export type Level = {
  title: string;
  particles: () => Particle[];
};

export type DynamicParticleConfig = {
  title: string;
  particleCount: () => number;
  x: (radius: number, wall: number, canvas: HTMLCanvasElement) => number;
  y: (radius: number, canvas: HTMLCanvasElement) => number;
  radius: () => number;
  color: () => string;
  dx: () => number; // Or initialDx
  dy: () => number; // Or initialDy
  wallCollision: boolean;
};

export type RotatingParticleGroup = {
  particles: Particle[];
  centerX: number;
  centerY: number;
  angle: number;
  rotationSpeed: number;
};
