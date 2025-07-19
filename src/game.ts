import { Goal, Guardian, ParticleSystem, Player } from "./game-objects";
import { StateMachine } from "./fsm/StateMachine";
import { ReadyToStartState } from "./fsm/ReadyToStartState";
import { LevelManager } from "./LevelManager";
import { Renderer } from "./Renderer";
import { gameConfig } from "./game-config";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
  player!: Player; // Initialized by LevelManager
  goal: Goal;
  particleSystem: ParticleSystem;
  guardians: Guardian[];
  stateMachine: StateMachine;
  levelManager: LevelManager;
  renderer: Renderer;
  frameRequest: number;
  time: number;
  lastTime: number;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.background = "#0c0c0c";
    this.mouse = { x: 0, y: 0 };
    this.particleSystem = new ParticleSystem(this.canvas);
    this.guardians = [];
    this.goal = new Goal(
      this.canvas.width / 1.2,
      this.canvas.height / 2,
      gameConfig.goal.radius
    );
    this.stateMachine = new StateMachine();
    this.levelManager = new LevelManager(this);
    this.renderer = new Renderer(this);
    this.frameRequest = 0;
    this.time = 0;
    this.lastTime = 0;
    this.levelManager.loadLevel();
    this.stateMachine.transitionTo(new ReadyToStartState(this));
  }

  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Should prob do this but not 100% sure why
    this.time = 0;
    this.lastTime = performance.now();

    this.levelManager.reset();
    this.stateMachine.transitionTo(new ReadyToStartState(this));
  }

  // Main loop
  animate() {
    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.time += deltaTime;
    this.lastTime = now;

    this.frameRequest = requestAnimationFrame(() => this.animate());

    this.update(deltaTime);
    this.draw();
  }

  update(deltaTime: number) {
    this.stateMachine.update(deltaTime);
  }

  draw() {
    this.renderer.draw();
  }
}
