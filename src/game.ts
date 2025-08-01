import { Goal, Guardian, Player } from "./game-objects";
import { ParticleManager } from "./managers/ParticleManager";
import { StateMachine } from "./fsm/StateMachine";
import { LoadingState } from "./fsm/LoadingState";
import { ReadyToStartState } from "./fsm/ReadyToStartState";
import { LevelManager } from "./managers/LevelManager";
import { Renderer } from "./managers/Renderer";
import { gameConfig } from "./config/game-config";
import { Timer } from "./game-objects/Timer";
import { ScoreManager } from "./managers/ScoreManager";
import { UIManager } from "./managers/UIManager";
import { CollisionManager } from "./managers/CollisionManager";
import { SoundManager } from "./managers/SoundManager";
import { AnimatedMainMenuManager } from "./managers/AnimatedMainMenuManager";
const isDev = import.meta.env.DEV;
const baseAssetsPath = isDev
  ? "/circles/sounds"
  : "https://westcoastnoobs.com/assets";
console.log(baseAssetsPath);

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
  player!: Player; // Initialized by LevelManager
  goal: Goal;
  particleManager: ParticleManager;
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
  soundManager: SoundManager;
  animatedMainMenuManager: AnimatedMainMenuManager;
  paused = false;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.background = "#0c0c0c";
    this.mouse = { x: 0, y: 0 };
    this.goal = new Goal(
      this.canvas.width / 1.2,
      this.canvas.height / 2,
      gameConfig.goal.radius
    );
    this.particleManager = new ParticleManager(this.canvas, this.goal);
    this.guardians = [];
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
    this.soundManager = SoundManager.getInstance();
    this.animatedMainMenuManager = new AnimatedMainMenuManager(this);
  }

  public async init() {
    this.stateMachine.transitionTo(new LoadingState(this));
    this.animate();
  }

  async loadSounds() {
    await this.soundManager.loadSound(
      "level1",
      `${baseAssetsPath}/Half-Life02.mp3`
    );
    await this.soundManager.loadSound(
      "level2",
      `${baseAssetsPath}/Half-Life19.mp3`
    );
    await this.soundManager.loadSound(
      "player-death",
      `${baseAssetsPath}/squeaky.ogg`
    );
    await this.soundManager.loadSound(
      "particle-collision",
      `${baseAssetsPath}/match-ready.ogg`
    );
    // await this.soundManager.loadSound(
    //   "particle-goal-collision",
    //   "/sounds/particle-goal-collision.wav"
    // );
    await this.soundManager.loadSound(
      "level-complete",
      `${baseAssetsPath}/cow_moo_1.ogg`
    );
  }

  initAudio(): void {
    this.soundManager.resumeAudioContext();
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

    this.update(deltaTime, this.time);
    this.draw();
  }

  pause() {
    this.paused = true;
    this.soundManager.pauseAllSounds();
  }

  resume() {
    this.paused = false;
    this.soundManager.resumeAllSounds();
    this.lastTime = performance.now();
  }

  update(deltaTime: number, time: number) {
    this.stateMachine.update(deltaTime, time);
  }

  draw() {
    this.renderer.draw();
    this.uiManager.drawSoundIcon(this.ctx);
  }
}
