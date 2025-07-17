import { Goal, ParticleSystem, Player } from "./game-objects";
import { levels, LevelConfig } from "./level-configs";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
  player: Player;
  goal: Goal;
  particleSystem: ParticleSystem;
  gameRunning: boolean;
  gameOver: boolean;
  fadeAlpha: number;
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
    this.player = new Player(50, this.canvas.height / 2, 30, "red");
    this.goal = new Goal(
      this.canvas.width / 1.2 - 60,
      this.canvas.height / 2 - 60,
      120,
      120
    );
    this.gameRunning = false;
    this.gameOver = false;
    this.fadeAlpha = 0;
    this.frameRequest = 0;
    this.time = 0;
    this.lastTime = 0;
    this.currentLevel = 0;
    this.loadLevel();
  }

  loadLevel() {
    const levelConfig = levels[this.currentLevel];
    if (!levelConfig) {
      console.error("Level not found:", this.currentLevel);
      return;
    }
    this.recreateSystem(levelConfig);
  }

  recreateSystem(levelConfig: LevelConfig) {
    this.particleSystem.createPattern(
      levelConfig.pattern,
      levelConfig.behaviors,
      levelConfig.particleCount,
      levelConfig.radius,
      levelConfig.color
    );
  }

  reset() {
    cancelAnimationFrame(this.frameRequest);
    // this.goal.fill = false;
    this.particleSystem.clearParticles();
    this.player = new Player(50, this.canvas.height / 2, 30, "red");
    this.gameRunning = false;
    this.gameOver = false;
    this.fadeAlpha = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.loadLevel();

    this.draw();
  }

  start() {
    if (!this.gameOver) {
      // Maybe set gameRunning true here?
      this.lastTime = performance.now();
      this.animate();
    }
  }

  // Main loop
  animate() {
    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.time += deltaTime;
    this.lastTime = now;

    this.frameRequest = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.gameOver) {
      this.update(deltaTime);
    }
    this.draw();

    if (this.gameOver) {
      this.drawGameOver();
    }
  }

  update(deltaTime: number) {
    this.player.update(this.ctx, this.gameRunning, this.mouse);
    this.particleSystem.update(deltaTime, this.time);
    if (this.goal.update(this.ctx, this.player)) {
      this.currentLevel++;
      if (this.currentLevel >= levels.length) {
        this.currentLevel = 0; // Loop back to the first level
      }
      this.reset();
    }

    if (
      this.player.detectCollision(this.particleSystem.getParticles()) &&
      this.gameRunning
    ) {
      this.gameRunning = false;
      this.gameOver = true;
    }
  }

  draw() {
    this.particleSystem.draw(this.ctx);
    this.player.draw(this.ctx);
    this.goal.draw(this.ctx);

    if (!this.gameRunning && !this.gameOver) {
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
  }

  drawGameOver() {
    if (this.fadeAlpha < 1) {
      this.fadeAlpha += 0.01;
      this.fadeAlpha = Math.min(this.fadeAlpha, 1);
    }

    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeAlpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = `rgba(255, 0, 0, ${this.fadeAlpha})`;
    this.ctx.font = "100px 'Times New Roman'";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "YOU DIED",
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    if (this.fadeAlpha >= 0.8) {
      this.ctx.fillStyle = "white";
      this.ctx.font = "24px 'Times New Roman'";
      this.ctx.fillText(
        "Click to restart",
        this.canvas.width / 2,
        this.canvas.height / 2 + 60
      );
    }
  }
}
