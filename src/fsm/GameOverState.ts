import { State } from "./State";
import { Game } from "../game";
import { Guardian, Particle, Vector2 } from "../game-objects";

export class GameOverState extends State {
  public collidedObject: Particle | Guardian;
  public collisionPosition: Vector2;
  public fadeAlpha: number = 0;

  constructor(
    game: Game,
    collidedObject: Particle | Guardian,
    collisionPosition: Vector2
  ) {
    super(game);
    this.collidedObject = collidedObject;
    this.collisionPosition = collisionPosition;
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

  public exit(): void {}
}
