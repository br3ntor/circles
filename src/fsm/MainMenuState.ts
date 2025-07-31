import { animatedMainMenuLevels } from "../config/animated-main-menu-configs";
import { Game } from "../game";
import { LeaderboardState } from "./LeaderboardState";
import { LevelState } from "./LevelState";
import { ReadyToStartState } from "./ReadyToStartState";

export class MainMenuState extends LevelState {
  private options = ["Start Game", "Leaderboards"];
  private selectedOption = 0;

  constructor(game: Game) {
    super(game);
  }

  enter(): void {
    super.enter();
    const randomIndex = Math.floor(
      Math.random() * animatedMainMenuLevels.length
    );
    const levelConfig = animatedMainMenuLevels[randomIndex];
    this.game.particleManager.createPattern(levelConfig);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    const animatedGradient =
      this.game.animatedMainMenuManager.getAnimatedGradientFill(ctx);
    this.game.uiManager.drawMainMenu(
      ctx,
      this.options,
      this.selectedOption,
      animatedGradient
    );
  }

  exit(): void {
    super.exit();
  }

  update(deltaTime: number, time: number): void {
    super.update(deltaTime, time);
    this.game.collisionManager.checkCollisions(
      this.game.particleManager.getParticles()
    );
    this.game.animatedMainMenuManager.update(deltaTime, time);
  }

  handleInput(event: KeyboardEvent | MouseEvent) {
    if (event instanceof KeyboardEvent) {
      if (event.key === "ArrowUp") {
        this.selectedOption =
          (this.selectedOption - 1 + this.options.length) % this.options.length;
      } else if (event.key === "ArrowDown") {
        this.selectedOption = (this.selectedOption + 1) % this.options.length;
      } else if (event.key === "Enter" || event.key === " ") {
        this.selectOption();
      }
    }
  }

  private selectOption() {
    const option = this.options[this.selectedOption];
    if (option === "Start Game") {
      this.game.stateMachine.transitionTo(new ReadyToStartState(this.game));
    } else if (option === "Leaderboards") {
      this.game.stateMachine.transitionTo(new LeaderboardState(this.game));
    }
  }
}
