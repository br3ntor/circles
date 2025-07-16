import { Goal, ParticleSystem, Player } from "./game-objects";

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
    this.setupControls();
    this.recreateSystem();
  }

  setupControls() {
    const patternSelector = document.createElement("select");
    patternSelector.style.position = "absolute";
    patternSelector.style.top = "10px";
    patternSelector.style.left = "10px";
    document.body.appendChild(patternSelector);

    const patterns = ["random", "spiral", "star", "circle", "waves", "orbit"];
    for (const pattern of patterns) {
      const option = document.createElement("option");
      option.value = pattern;
      option.text = pattern;
      patternSelector.appendChild(option);
    }
    patternSelector.addEventListener("change", () => this.recreateSystem());

    const wallBehaviorSelector = document.createElement("select");
    wallBehaviorSelector.style.position = "absolute";
    wallBehaviorSelector.style.top = "40px";
    wallBehaviorSelector.style.left = "10px";
    document.body.appendChild(wallBehaviorSelector);

    const wallBehaviors = ["collide", "wrap", "none"];
    for (const behavior of wallBehaviors) {
      const option = document.createElement("option");
      option.value = behavior;
      option.text = behavior;
      wallBehaviorSelector.appendChild(option);
    }
    wallBehaviorSelector.addEventListener("change", () =>
      this.recreateSystem()
    );
  }

  recreateSystem() {
    const patternSelector = document.querySelector("select");
    const wallBehaviorSelector = document.querySelectorAll("select")[1];
    const pattern = patternSelector?.value || "random";
    const wallBehavior =
      (wallBehaviorSelector?.value as "collide" | "wrap" | "none") || "collide";
    this.particleSystem.createPattern(pattern, wallBehavior);
  }

  reset() {
    cancelAnimationFrame(this.frameRequest);
    this.particleSystem.clearParticles();
    this.player = new Player(50, this.canvas.height / 2, 30, "red");
    this.gameRunning = false;
    this.gameOver = false;
    this.fadeAlpha = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.recreateSystem();

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
    this.goal.update(this.ctx, this.player);

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
