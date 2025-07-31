import { animatedMainMenuLevels } from "../config/animated-main-menu-configs";
import { Game } from "../game";

export class AnimatedMainMenuManager {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.loadRandomLevel();
  }

  private loadRandomLevel(): void {
    const randomIndex = Math.floor(
      Math.random() * animatedMainMenuLevels.length
    );
    const levelConfig = animatedMainMenuLevels[randomIndex];
    this.game.particleManager.createPattern(levelConfig);
  }

  public update(deltaTime: number, time: number): void {
    this.game.particleManager.update(deltaTime, time);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleManager.draw(ctx);
  }
}
