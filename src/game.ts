import {
  Goal,
  Guardian,
  ParticleSystem,
  Player,
  Vector2,
} from "./game-objects";
import { levels } from "./level-configs";

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
    this.player = new Player(50, this.canvas.height / 2, 30);
    this.guardians = [];
    this.goal = new Goal(this.canvas.width / 1.2, this.canvas.height / 2, 60);
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
    this.draw();
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
    // this.gameRunning = false;
    // this.gameOver = false;
    // this.fadeAlpha = 0;

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
    cancelAnimationFrame(this.frameRequest);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Should prob do this but not 100% sure why
    this.time = 0;
    this.lastTime = 0;

    this.guardians = [];
    this.player = new Player(50, this.canvas.height / 2, 30);
    this.goal.fill = false;
    this.gameRunning = false;
    this.gameOver = false;
    this.fadeAlpha = 0;
    this.loadLevel();
    this.draw();
  }

  start() {
    if (!this.gameOver) {
      this.gameRunning = true;
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

    // Update state if game is NOT over and IS running
    // I'm prettyr sure we can get rid of gameRunning and just use gameOver
    if (!this.gameOver && this.gameRunning) {
      this.update(deltaTime);
    }
    this.draw();

    if (this.gameOver) {
      this.drawGameOver();
    }
  }

  update(deltaTime: number) {
    if (this.levelComplete) {
      if (this.transitionPhase === 0) {
        this.guardians.forEach((guardian) => {
          // guardian.update(this.ctx, [], this.goal);
          guardian.update([], this.goal);
        });
      }

      // Not sure if even need to check if transitioning here
      if (
        this.guardians.every((g) => g.state === "returned") &&
        !this.transitioning
      ) {
        // Guardians have returned, start wipe in
        this.transitioning = true;
        this.transitionPhase = 1; // Wipe in
        this.transitionCenter = new Vector2(this.goal.x, this.goal.y);
        this.transitionRadius =
          Math.max(this.canvas.width, this.canvas.height) * 1.5;
      }

      if (this.transitioning) {
        if (this.transitionPhase === 1) {
          // Wipe in (shrinking circle)
          this.transitionRadius -= this.transitionSpeed * deltaTime;
          if (this.transitionRadius <= 0) {
            this.transitionRadius = 0;
            this.transitionPhase = 2; // Switch to wipe out
            this.currentLevel++;
            if (this.currentLevel >= levels.length) {
              this.currentLevel = 0; // Loop back to the first level
            }
            this.loadLevel(); // Load next level behind the curtain
            // Update focus to player
            this.transitionCenter = new Vector2(this.player.x, this.player.y); // Center on player for wipe out
          }
        } else if (this.transitionPhase === 2) {
          // Wipe out (expanding circle)
          this.transitionRadius += this.transitionSpeed * deltaTime;
          const maxRadius =
            Math.max(this.canvas.width, this.canvas.height) * 1.5;
          if (this.transitionRadius >= maxRadius) {
            // End of transition
            this.transitioning = false;
            this.transitionPhase = 0;
            this.levelComplete = false;
            this.gameRunning = false;
            cancelAnimationFrame(this.frameRequest);
          }
        }
      }
      return;
    }

    // Update state for all drawn objects
    this.player.update(this.gameRunning, this.mouse);
    this.particleSystem.update(deltaTime, this.time);
    this.guardians.forEach((guardian) =>
      // guardian.update(this.ctx, this.particleSystem.getParticles(), this.goal)
      guardian.update(this.particleSystem.getParticles(), this.goal)
    );

    // Guardian collision check
    for (const guardian of this.guardians) {
      if (guardian.detectPlayerCollision(this.player) && this.gameRunning) {
        this.gameRunning = false;
        this.gameOver = true;
        break;
      }
    }

    // Goal is reached! Level Complete!
    if (this.goal.update(this.ctx, this.player)) {
      this.startLevelCompletion();
    }

    // Player collided with particles and DIED!
    if (
      this.player.detectCollision(this.particleSystem.getParticles()) &&
      this.gameRunning
    ) {
      this.gameRunning = false;
      this.gameOver = true;
    }
  } // Main Loop End

  draw() {
    // Draw all game objects
    this.particleSystem.draw(this.ctx);
    this.player.draw(this.ctx);
    this.goal.draw(this.ctx);
    this.guardians.forEach((guardian) => guardian.draw(this.ctx));

    // Game is NOT running NOT over and NOT transitioning.
    // if (!this.gameRunning && !this.gameOver && !this.transitioning) {
    if ((!this.gameRunning && !this.gameOver) || this.transitionPhase === 2) {
      // Draw left start area barrier
      this.ctx.beginPath();
      this.ctx.moveTo(100, 0);
      this.ctx.lineTo(100, this.canvas.height);
      this.ctx.lineWidth = 10;
      this.ctx.strokeStyle = "#DEDEDE";
      this.ctx.stroke();
      this.ctx.closePath();

      // Draw startup message
      this.ctx.fillStyle = "#DEDEDE";
      this.ctx.font = "26px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Click the white circle or press space bar to start the game",
        this.canvas.width / 2,
        this.canvas.height - 200
      );
    }

    if (this.transitioning) {
      this.drawIrisWipe();
    }
  }

  startLevelCompletion() {
    this.levelComplete = true;
    this.guardians.forEach((g) => (g.state = "returning"));
  }

  drawIrisWipe() {
    this.ctx.save();
    this.ctx.fillStyle = "#DEDEDE";

    // Outer rectangle path
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);

    // Inner circle path (counter-clockwise)
    this.ctx.arc(
      this.transitionCenter.x,
      this.transitionCenter.y,
      this.transitionRadius,
      0,
      Math.PI * 2,
      true // Counter-clockwise
    );

    // Fill the path using the even-odd rule to create a hole
    this.ctx.fill("evenodd");

    this.ctx.restore();
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
