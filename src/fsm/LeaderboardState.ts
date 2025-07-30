import { Game } from "../game";
import { State } from "./State";
import { MainMenuState } from "./MainMenuState";

export class LeaderboardState extends State {
  constructor(game: Game) {
    super(game);
  }

  enter(): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    this.game.uiManager.drawLeaderboard(ctx, this.getMockLeaderboard());
  }

  exit(): void {
    // Optional: clean up any resources used by this state
  }

  update(): void {
    // Wait for input to return to the main menu
  }

  handleInput(event: KeyboardEvent | MouseEvent) {
    if (
      event instanceof KeyboardEvent &&
      (event.key === "Escape" || event.key === "Enter" || event.key === " ")
    ) {
      this.game.stateMachine.transitionTo(new MainMenuState(this.game));
    }
  }

  private getMockLeaderboard() {
    return [
      { name: "Player 1", score: 1000 },
      { name: "Player 2", score: 900 },
      { name: "Player 3", score: 800 },
      { name: "Player 4", score: 700 },
      { name: "Player 5", score: 600 },
    ];
  }
}
