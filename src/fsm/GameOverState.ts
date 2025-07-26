import { State } from "./State";
import { Game } from "../game";
import { Guardian, Particle } from "../game-objects";

export class GameOverState extends State {
  public fadeAlpha: number = 0;
  public collidedObject: Particle | Guardian;

  constructor(game: Game, collidedObject: Particle | Guardian) {
    super(game);
    this.collidedObject = collidedObject;
  }

  public enter(): void {
    this.game.timer.stop();
  }

  public update(deltaTime: number): void {
    if (this.fadeAlpha < 1) {
      this.fadeAlpha += 0.01; // A simple fade-in speed
      this.fadeAlpha = Math.min(this.fadeAlpha, 1);
    }
  }

  public exit(): void {
    this.fadeAlpha = 0;
  }
}
