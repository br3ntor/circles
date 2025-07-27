import {
  Goal,
  Guardian,
  Particle,
  ParticleSystem,
  Player,
} from "./game-objects";
import { StateMachine } from "./fsm/StateMachine";
import { GameOverState } from "./fsm/GameOverState";
import { ReadyToStartState } from "./fsm/ReadyToStartState";
import { LevelManager } from "./LevelManager";
import { Renderer } from "./Renderer";
import { gameConfig } from "./game-config";
import { Timer } from "./game-objects/Timer";
import { ScoreManager } from "./ScoreManager";
import { UIManager } from "./UIManager";
import { CollisionManager } from "./CollisionManager";

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
  timer: Timer;
  scoreManager: ScoreManager;
  uiManager: UIManager;
  collisionManager: CollisionManager;
  paused = false;

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
    this.collisionManager = new CollisionManager(this.canvas);
    this.frameRequest = 0;
    this.time = 0;
    this.lastTime = performance.now();
    this.timer = new Timer();
    this.scoreManager = ScoreManager.getInstance();
    this.uiManager = UIManager.getInstance();
    this.uiManager.setTimer(this.timer);
    this.levelManager.loadLevel();
    this.stateMachine.transitionTo(new ReadyToStartState(this));
    this.setupEventListeners();
    this.animate();
  }

  private setupEventListeners() {
    this.canvas.addEventListener("click", () => {
      const state = this.stateMachine.currentState;
      if (state instanceof GameOverState && state.fadeAlpha >= 1) {
        this.reset();
      }
    });
  }

  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Should prob do this but not 100% sure why
    this.time = 0;
    this.lastTime = performance.now();

    this.goal = new Goal(
      this.canvas.width / 1.2,
      this.canvas.height / 2,
      gameConfig.goal.radius
    );

    this.levelManager.reset();
    this.scoreManager.reset();
    this.timer.reset();
    this.stateMachine.transitionTo(new ReadyToStartState(this));
  }

  // Main loop
  animate() {
    this.frameRequest = requestAnimationFrame(() => this.animate());

    if (this.paused) {
      return;
    }

    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.time += deltaTime;
    this.lastTime = now;

    this.update(deltaTime);
    this.draw();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.lastTime = performance.now();
  }

  update(deltaTime: number) {
    this.stateMachine.update(deltaTime);
  }

  draw() {
    this.renderer.draw();
  }
}
