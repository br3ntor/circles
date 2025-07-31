import { animatedMainMenuLevels } from "../config/animated-main-menu-configs";
import { ColorSchemeName, getColorScheme } from "../config/color-schemes";
import { Particle } from "../game-objects/Particle";
import { Game } from "../game";

export class AnimatedMainMenuManager {
  private game: Game;
  public gradientAnimationTime = 0;
  public gradientSpeed = 0.05;
  public colorDensity = 4;
  public colorSchemeName: ColorSchemeName = "cosmic";
  public colors: string[] = [];

  constructor(game: Game) {
    this.game = game;
    const scheme = getColorScheme(this.colorSchemeName);
    const repeatedScheme = Array(this.colorDensity).fill(scheme).flat();
    this.colors = [...repeatedScheme, scheme[0]];
  }

  public update(deltaTime: number, time: number): void {
    this.gradientAnimationTime += this.gradientSpeed * deltaTime;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.game.particleManager.draw(ctx);
  }

  public getAnimatedGradientFill(
    ctx: CanvasRenderingContext2D
  ): CanvasGradient {
    const gradient = ctx.createLinearGradient(
      0,
      ctx.canvas.height / 2 - 200,
      ctx.canvas.width,
      ctx.canvas.height / 2
    );

    const offset = this.gradientAnimationTime % 1;
    const numColors = this.colors.length;
    const stops: { position: number; color: string }[] = [];

    for (let i = 0; i < numColors; i++) {
      const position = (i / (numColors - 1) + offset) % 1;
      stops.push({ position, color: this.colors[i] });
    }

    stops.sort((a, b) => a.position - b.position);

    for (const stop of stops) {
      gradient.addColorStop(stop.position, stop.color);
    }

    return gradient;
  }
}
