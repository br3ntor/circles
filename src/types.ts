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
  particles: Particle[];
};

export type ParticleConfig = {
  particleCount: () => number;
  x: (radius: number, wall: number) => number;
  y: (radius: number) => number;
  radius: () => number;
  color: () => string;
  dx: () => number; // Or initialDx
  dy: () => number; // Or initialDy
};
