import { Goal, ParticleSystem, Player } from "./game-objects";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
  player: Player;
  goal: Goal;
  particleSystem: ParticleSystem;
  gameRunning: boolean;
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
    this.player = new Player(50, this.canvas.height / 2, 30, "red");
    this.goal = new Goal(
      this.canvas.width / 1.2 - 60,
      this.canvas.height / 2 - 60,
      120,
      120
    );
    this.gameRunning = false;
    this.frameRequest = 0;
    this.time = 0;
    this.lastTime = 0;
    this.particleSystem.createPattern("random");
  }

  reset() {
    cancelAnimationFrame(this.frameRequest);
    this.particleSystem.clearParticles();
    this.player = new Player(50, this.player.y, 30, "red");
    this.gameRunning = false;
    this.start();
  }

  start() {
    this.lastTime = performance.now();
    this.animate();
  }

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
    this.player.update(this.ctx, this.gameRunning, this.mouse);
    this.particleSystem.update(deltaTime, this.time);
  }

  draw() {
    if (!this.gameRunning) {
      // Draw left start area barrier
      this.ctx.beginPath();
      this.ctx.moveTo(100, 0);
      this.ctx.lineTo(100, this.canvas.height);
      this.ctx.lineWidth = 10;
      this.ctx.strokeStyle = "#eeeeee";
      this.ctx.stroke();
      this.ctx.closePath();

      // Draw startup message
      this.ctx.fillStyle = "white";
      this.ctx.font = "26px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Click the red circle or press space bar to start the game",
        this.canvas.width / 2,
        this.canvas.height - 200
      );
    }

    this.particleSystem.draw(this.ctx);
    this.player.draw(this.ctx);
    this.goal.draw(this.ctx);
  }
}
