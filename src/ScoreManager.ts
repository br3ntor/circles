export class ScoreManager {
  private levelTimes: number[];
  private static instance: ScoreManager;

  private constructor() {
    this.levelTimes = [];
  }

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  public addLevelTime(time: number): void {
    this.levelTimes.push(time);
  }

  public getTotalTime(): number {
    return this.levelTimes.reduce((total, time) => total + time, 0);
  }

  public calculateScore(): number {
    const totalTime = this.getTotalTime();
    if (totalTime === 0) {
      return 0;
    }
    // A simple scoring formula where a lower time results in a higher score.
    return Math.round(100000 / totalTime);
  }

  public reset(): void {
    this.levelTimes = [];
  }
}
