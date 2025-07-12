export type ParticleConfig = {
  title: string;
  particleCount: () => number;
  radius: () => number;
  x: (radius: number, wall: number) => number;
  y: (radius: number) => number;
  dx: () => number;
  dy: () => number;
  color: () => string;
  wallCollision?: boolean;
};
