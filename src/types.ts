export type ParticleConfig = {
  objects: () => number;
  radius: () => number;
  x: (radius: number, wall: number) => number;
  y: (radius: number) => number;
  xSpeed: () => number;
  ySpeed: () => number;
  color: () => string;
  wallCollision?: boolean;
};
