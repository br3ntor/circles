import type { Game } from "../game";

export abstract class State {
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public enter(): void {}
  public exit(): void {}
  public abstract update(deltaTime: number, time: number): void;
  public draw(ctx: CanvasRenderingContext2D): void {}
}
