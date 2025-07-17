import {
  Goal,
  Guardian,
  ParticleSystem,
  Player,
  Vector2,
} from "./game-objects";
import { levels, LevelConfig } from "./level-configs";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
  player: Player;
  goal: Goal;
  particleSystem: ParticleSystem;
  guardians: Guardian[];
  gameRunning: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  transitioning: boolean;
  transitionPhase: number; // 0: none, 1: wipe in, 2: wipe out
  transitionRadius: number;
  transitionCenter: Vector2;
  transitionSpeed: number;
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
    this.guardians = [];
    this.goal = new Goal(
      this.canvas.width / 1.2 - 60,
      this.canvas.height / 2 - 60,
      120,
      120
    );
    this.gameRunning = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.transitioning = false;
    this.transitionPhase = 0;
    this.transitionRadius = 0;
    this.transitionCenter = new Vector2(0, 0);
    this.transitionSpeed = 1500; // Pixels per second
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
    this.createGuardians();
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

  createGuardians() {
    const particleCount = 6;
    const spaceBetween = 1 / particleCount;
    let angle = 0;

    for (let i = 0; i < particleCount; i++) {
      const radians = angle * Math.PI * 2;
      const radius = 50;
      const distance = radius;
      const x =
        this.goal.x + this.goal.width / 2 + Math.cos(radians) * distance;
      const y =
        this.goal.y + this.goal.height / 2 + Math.sin(radians) * distance;
      const newGuardian = new Guardian(
        x,
        y,
        radius,
        radians,
        "hsl(0deg, 0%, 100%)"
      );
      this.guardians.push(newGuardian);
      angle += spaceBetween;
    }
  }

  reset() {
    cancelAnimationFrame(this.frameRequest);
    // this.goal.fill = false;
    this.particleSystem.clearParticles();
    this.guardians = [];
    this.player = new Player(50, this.canvas.height / 2, 30, "red");
    this.gameRunning = false;
    this.gameOver = false;
    this.levelComplete = false;
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
    if (this.levelComplete) {
      this.guardians.forEach((guardian) => {
        guardian.update(this.ctx, [], this.goal);
      });

      if (this.guardians.every((g) => !g.isReturning) && !this.transitioning) {
        // Guardians have returned, start wipe in
        this.transitioning = true;
        this.transitionPhase = 1; // Wipe in
        this.transitionCenter = new Vector2(
          this.goal.x + this.goal.width / 2,
          this.goal.y + this.goal.height / 2
        );
        this.transitionRadius = 0;
      }

      if (this.transitioning) {
        if (this.transitionPhase === 1) {
          // Wipe in
          this.transitionRadius += this.transitionSpeed * deltaTime;
          const maxRadius =
            Math.max(this.canvas.width, this.canvas.height) * 1.5; // Ensure it covers the screen
          if (this.transitionRadius >= maxRadius) {
            this.transitionRadius = maxRadius;
            this.transitionPhase = 2; // Switch to wipe out
            this.currentLevel++;
            if (this.currentLevel >= levels.length) {
              this.currentLevel = 0; // Loop back to the first level
            }
            this.reset(); // Load next level
            this.transitionCenter = new Vector2(this.player.x, this.player.y); // Center on player for wipe out
          }
        } else if (this.transitionPhase === 2) {
          // Wipe out
          this.transitionRadius -= this.transitionSpeed * deltaTime;
          if (this.transitionRadius <= 0) {
            this.transitionRadius = 0;
            this.transitioning = false;
            this.transitionPhase = 0; // Transition complete
            this.levelComplete = false; // Reset level complete flag
          }
        }
      }
      return;
    }

    this.player.update(this.gameRunning, this.mouse);
    this.particleSystem.update(deltaTime, this.time);
    this.guardians.forEach((guardian) =>
      guardian.update(this.ctx, this.particleSystem.getParticles(), this.goal)
    );

    for (const guardian of this.guardians) {
      if (guardian.detectPlayerCollision(this.player) && this.gameRunning) {
        this.gameRunning = false;
        this.gameOver = true;
        break;
      }
    }

    if (this.goal.update(this.ctx, this.player)) {
      this.startLevelCompletion();
    }

    if (
      this.player.detectCollision(this.particleSystem.getParticles()) &&
      this.gameRunning
    ) {
      this.gameRunning = false;
      this.gameOver = true;
    }
  }

  startLevelCompletion() {
    this.levelComplete = true;
    this.guardians.forEach((g) => (g.isReturning = true));
  }

  draw() {
    this.particleSystem.draw(this.ctx);
    this.player.draw(this.ctx);
    this.goal.draw(this.ctx);
    this.guardians.forEach((guardian) => guardian.draw(this.ctx));

    if (!this.gameRunning && !this.gameOver && !this.transitioning) {
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

    if (this.transitioning) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(
        this.transitionCenter.x,
        this.transitionCenter.y,
        this.transitionRadius,
        0,
        Math.PI * 2
      );
      this.ctx.clip();
      this.particleSystem.draw(this.ctx);
      this.player.draw(this.ctx);
      this.goal.draw(this.ctx);
      this.guardians.forEach((guardian) => guardian.draw(this.ctx));
      this.ctx.restore();
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
