import { Game } from "../game";
import { UIManager } from "../managers/UIManager";

export class Renderer {
  game: Game;
  ctx: CanvasRenderingContext2D;
  uiManager: UIManager;

  constructor(game: Game) {
    this.game = game;
    this.ctx = game.ctx;
    this.uiManager = UIManager.getInstance();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    const state = this.game.stateMachine.currentState;
    if (state) {
      state.draw(this.ctx);
    }
  }
}
