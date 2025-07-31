import { ScoreManager } from "./ScoreManager";
import { Timer } from "../game-objects/Timer";
import { gameConfig } from "../config/game-config";
import { SoundManager } from "./SoundManager";

export class UIManager {
  private static instance: UIManager;
  private timer: Timer;
  private scoreManager: ScoreManager;
  private soundManager: SoundManager;

  private constructor() {
    this.timer = new Timer();
    this.scoreManager = ScoreManager.getInstance();
    this.soundManager = SoundManager.getInstance();
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

  public drawSoundIcon(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = gameConfig.ui.primaryColor;
    ctx.font = "30px Arial";
    ctx.textAlign = "left";
    const icon = this.soundManager.getMuted() ? "🔇" : "🔊";
    ctx.fillText(icon, 20, 60);
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
  public drawGameOverUI(
    ctx: CanvasRenderingContext2D,
    fadeAlpha: number,
    canvas: HTMLCanvasElement
  ) {
    // Fade out the game world
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawText(
      ctx,
      "YOU DIED",
      canvas.width / 2,
      canvas.height / 2,
      "100px 'Times New Roman'",
      `rgba(255, 0, 0, ${fadeAlpha})`
    );

    if (fadeAlpha >= 0.8) {
      this.drawText(
        ctx,
        "Click to restart",
        canvas.width / 2,
        canvas.height / 2 + 70,
        "24px 'Times New Roman'",
        "#DEDEDE"
      );
    }
  }
  public drawGameCompleteUI(
    ctx: CanvasRenderingContext2D,
    fadeAlpha: number,
    canvas: HTMLCanvasElement
  ) {
    const score = this.scoreManager.calculateScore();
    const totalTime = this.scoreManager.getTotalTime();
    const formattedTotalTime = this.formatTime(totalTime);
    // Fade out the game world
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawText(
      ctx,
      "YOU WIN",
      canvas.width / 2,
      canvas.height / 2 - 100,
      "100px 'Times New Roman'",
      `rgba(0, 255, 0, ${fadeAlpha})`
    );

    this.drawText(
      ctx,
      `Total Time: ${formattedTotalTime}`,
      canvas.width / 2,
      canvas.height / 2,
      "24px 'Times New Roman'",
      `rgba(222, 222, 222, ${fadeAlpha})`
    );
    this.drawText(
      ctx,
      `Final Score: ${score}`,
      canvas.width / 2,
      canvas.height / 2 + 50,
      "24px 'Times New Roman'",
      `rgba(222, 222, 222, ${fadeAlpha})`
    );

    if (fadeAlpha >= 0.8) {
      this.drawText(
        ctx,
        "Click to return to main menu",
        canvas.width / 2,
        canvas.height / 2 + 100,
        "24px 'Times New Roman'",
        "#DEDEDE"
      );
    }
  }
  public drawReadyUI(ctx: CanvasRenderingContext2D, game: any) {
    // Draw left start area barrier
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, game.canvas.height);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#DEDEDE";
    ctx.stroke();
    ctx.closePath();

    this.drawText(
      ctx,
      "Click the white circle or press space bar to start the game",
      game.canvas.width / 2,
      game.canvas.height - 200,
      "26px Arial",
      "#DEDEDE"
    );
  }
  private drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font: string,
    color: string | CanvasGradient
  ) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
  }

  public drawLoadingScreen(ctx: CanvasRenderingContext2D): void {
    this.drawText(
      ctx,
      "Loading...",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      "50px Arial",
      "#DEDEDE"
    );
  }

  public drawMainMenu(
    ctx: CanvasRenderingContext2D,
    options: string[],
    selectedOption: number,
    animatedGradient?: CanvasGradient
  ): void {
    this.drawText(
      ctx,
      "Circles",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 - 150,
      "80px Arial",
      animatedGradient || "#DEDEDE"
    );

    options.forEach((option, index) => {
      const color = index === selectedOption ? "yellow" : "#DEDEDE";
      this.drawText(
        ctx,
        option,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 - 50 + index * 50,
        "30px Arial",
        color
      );
    });
  }

  public drawLeaderboard(
    ctx: CanvasRenderingContext2D,
    leaderboard: { name: string; score: number }[]
  ): void {
    this.drawText(
      ctx,
      "Leaderboard",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 - 150,
      "50px Arial",
      "#DEDEDE"
    );

    leaderboard.forEach((entry, index) => {
      this.drawText(
        ctx,
        `${entry.name}: ${entry.score}`,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2 - 50 + index * 50,
        "30px Arial",
        "#DEDEDE"
      );
    });

    this.drawText(
      ctx,
      "Press Enter to return",
      ctx.canvas.width / 2,
      ctx.canvas.height - 100,
      "20px Arial",
      "#DEDEDE"
    );
  }
}
