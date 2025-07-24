import { ScoreManager } from "./ScoreManager";
import { Timer } from "./game-objects/Timer";
import { gameConfig } from "./game-config";

export class UIManager {
  private static instance: UIManager;
  private timer: Timer;
  private scoreManager: ScoreManager;

  private constructor() {
    this.timer = new Timer();
    this.scoreManager = ScoreManager.getInstance();
  }

  public static getInstance(): UIManager {
    if (!UIManager.instance) {
      UIManager.instance = new UIManager();
    }
    return UIManager.instance;
  }

  public setTimer(timer: Timer): void {
    this.timer = timer;
  }

  public drawTimer(ctx: CanvasRenderingContext2D): void {
    const elapsedTime = this.timer.getElapsedTime();
    const formattedTime = this.formatTime(elapsedTime);
    ctx.save();
    ctx.fillStyle = gameConfig.ui.primaryColor;
    ctx.font = gameConfig.ui.timerFont;
    ctx.textAlign = "right";
    ctx.fillText(formattedTime, ctx.canvas.width - 20, 60);
    ctx.restore();
  }

  private formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    const milliseconds = Math.floor((timeInSeconds * 100) % 100)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  }

  public drawFinalScore(ctx: CanvasRenderingContext2D): void {
    const score = this.scoreManager.calculateScore();
    const totalTime = this.scoreManager.getTotalTime();
    const formattedTotalTime = this.formatTime(totalTime);

    ctx.save();
    ctx.fillStyle = gameConfig.ui.finalScoreOverlayColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = gameConfig.ui.finalScoreWinColor;
    ctx.font = gameConfig.ui.finalScoreWinFont;
    ctx.textAlign = "center";
    ctx.fillText("You Win!", ctx.canvas.width / 2, ctx.canvas.height / 2 - 100);

    ctx.fillStyle = gameConfig.ui.primaryColor;
    ctx.font = gameConfig.ui.finalScoreDetailFont;
    ctx.fillText(
      `Total Time: ${formattedTotalTime}`,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2
    );
    ctx.fillText(
      `Final Score: ${score}`,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 + 50
    );
    ctx.restore();
  }
}
