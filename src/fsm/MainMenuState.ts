import { Game } from "../game";
import { State } from "./State";
import { LeaderboardState } from "./LeaderboardState";
import { ReadyToStartState } from "./ReadyToStartState";

export class MainMenuState extends State {
  private options = ["Start Game", "Leaderboards"];
  private selectedOption = 0;

  constructor(game: Game) {
    super(game);
  }

  enter(): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    this.game.uiManager.drawMainMenu(ctx, this.options, this.selectedOption);
  }

  exit(): void {}

  update(): void {}

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
