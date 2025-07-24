export const gameConfig = {
  player: {
    radius: 30,
  },
  goal: {
    radius: 60,
  },
  guardians: {
    count: 6,
    radius: 50,
  },
  transitions: {
    speed: 1500, // Pixels per second
  },
  ui: {
    startMessage: "Click the white circle or press space bar to start the game",
    startFont: "26px Arial",
    gameOverFont: "100px 'Times New Roman'",
    restartFont: "24px 'Times New Roman'",
    primaryColor: "#DEDEDE",
    timerFont:
      "64px Consolas, Monaco, 'Lucida Console', 'Courier New', monospace",
    finalScoreWinFont: "72px Arial",
    finalScoreWinColor: "green",
    finalScoreDetailFont:
      "32px Consolas, Monaco, 'Lucida Console', 'Courier New', monospace",
    finalScoreOverlayColor: "rgba(0, 0, 0, 0.7)",
  },
};
