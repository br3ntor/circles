import { Player, Goal, Particle, Guardian } from "./game-objects.ts";

export const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
export const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.background = "#0c0c0c";

export const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

export const wallEnd = 105;

export let level = 0;
export let gameRunning = false;
export let particles: Particle[];
export let guardians: Guardian[];
export let player: Player | null;
export let goal: Goal | null;
export let frameRequest: number;

export function setLevel(newLevel: number) {
  level = newLevel;
}

export function setGameRunning(isRunning: boolean) {
  gameRunning = isRunning;
}

export function setParticles(newParticles: Particle[]) {
  particles = newParticles;
}

export function setGuardians(newGuardians: Guardian[]) {
  guardians = newGuardians;
}

export function setPlayer(newPlayer: Player | null) {
  player = newPlayer;
}

export function setGoal(newGoal: Goal | null) {
  goal = newGoal;
}

export function setFrameRequest(newFrameRequest: number) {
  frameRequest = newFrameRequest;
}
