import { Game } from "../game";
import { MainMenuState } from "./MainMenuState";
import { State } from "./State";

export class LoadingState extends State {
  constructor(game: Game) {
    super(game);
  }

  enter(): void {
    this.game.loadSounds().then(() => {
      this.game.stateMachine.transitionTo(new MainMenuState(this.game));
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.game.uiManager.drawLoadingScreen(ctx);
  }

  exit(): void {
    // Optional: clean up any resources used by this state
  }

  update(deltaTime: number, time: number): void {
    // The loading screen is drawn once in the enter method.
    // No need to redraw every frame.
  }
}
