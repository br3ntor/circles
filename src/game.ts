import {
  Goal,
  Guardian,
  ParticleSystem,
  Player,
  Vector2,
} from "./game-objects";
import { levels } from "./level-configs";
import { StateMachine } from "./fsm/StateMachine";
import { ReadyToStartState } from "./fsm/ReadyToStartState";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
  player: Player;
  goal: Goal;
  particleSystem: ParticleSystem;
  guardians: Guardian[];
  stateMachine: StateMachine;
  frameRequest: number;
  time: number;
  lastTime: number;
  currentLevel: number;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.background = "#0c0c0c";
    this.mouse = { x: 0, y: 0 };
    this.particleSystem = new ParticleSystem(this.canvas);
    this.player = new Player(50, this.canvas.height / 2, 30);
    this.guardians = [];
    this.goal = new Goal(this.canvas.width / 1.2, this.canvas.height / 2, 60);
    this.stateMachine = new StateMachine();
    this.frameRequest = 0;
    this.time = 0;
    this.lastTime = 0;
    this.currentLevel = 0;
    this.loadLevel();
    this.stateMachine.transitionTo(new ReadyToStartState(this));
  }

  loadLevel() {
    const levelConfig = levels[this.currentLevel];
    if (!levelConfig) {
      console.error("Level not found:", this.currentLevel);
      return;
    }

    this.guardians = [];
    this.player = new Player(50, this.canvas.height / 2, 30);
    this.goal.fill = false;

    // The createParticles clears old particles but
    // createGuardians does not...
    this.particleSystem.createPattern(levelConfig);
    this.createGuardians();

    // this.draw();
  }

  createGuardians() {
    const particleCount = 6;
    const spaceBetween = 1 / particleCount;
    let angle = 0;

    for (let i = 0; i < particleCount; i++) {
      const radians = angle * Math.PI * 2;
      const radius = 50;
      const distance = radius;
      const x = this.goal.x + Math.cos(radians) * distance;
      const y = this.goal.y + Math.sin(radians) * distance;
      const newGuardian = new Guardian(x, y, radius, radians);
      this.guardians.push(newGuardian);
      angle += spaceBetween;
    }
  }

  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Should prob do this but not 100% sure why
    this.time = 0;
    this.lastTime = performance.now();

    this.guardians = [];
    this.player = new Player(50, this.canvas.height / 2, 30);
    this.goal.fill = false;
    this.loadLevel();
    this.stateMachine.transitionTo(new ReadyToStartState(this));
  }

  // Main loop
  animate() {
    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.time += deltaTime;
    this.lastTime = now;

    this.frameRequest = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.update(deltaTime);
    this.draw();
  }

  update(deltaTime: number) {
    this.stateMachine.update(deltaTime);
  } // Main Loop End

  draw() {
    this.stateMachine.draw(this.ctx);
  }
}
