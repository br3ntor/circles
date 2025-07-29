import { Game } from "../game";
import { Guardian, Player } from "../game-objects";
import { levels } from "../config/level-configs";

export class LevelManager {
  game: Game;
  currentLevel: number;

  constructor(game: Game) {
    this.game = game;
    this.currentLevel = 0;
  }

  loadLevel() {
    const levelConfig = levels[this.currentLevel];
    if (!levelConfig) {
      console.error("Level not found:", this.currentLevel);
      return;
    }

    // this.game.soundManager.stopAllSounds();
    if (levelConfig.music) {
      // Lets just do a good old fashion human bad code hack
      // This is to keep the previous song playing if the new level has no music set
      this.game.soundManager.stopAllSounds();
      this.game.soundManager.playSound(levelConfig.music, true);
    }

    this.game.guardians = [];
    this.game.player = new Player(50, this.game.canvas.height / 2, 30);
    this.game.goal.fill = false;

    this.game.particleManager.createPattern(levelConfig);
    this.createGuardians();
  }

  createGuardians() {
    const particleCount = 6;
    const spaceBetween = 1 / particleCount;
    let angle = 0;

    for (let i = 0; i < particleCount; i++) {
      const radians = angle * Math.PI * 2;
      const radius = 50;
      const distance = radius;
      const x = this.game.goal.x + Math.cos(radians) * distance;
      const y = this.game.goal.y + Math.sin(radians) * distance;
      const newGuardian = new Guardian(x, y, radius, this.game.goal, radians);
      this.game.guardians.push(newGuardian);
      angle += spaceBetween;
    }
  }

  reset() {
    this.loadLevel();
  }
}
