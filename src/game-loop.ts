import { Game } from "./game";
import { setupEventListeners } from "./event-listeners";

export function startGame() {
  const game = new Game();
  game.start();
  setupEventListeners(game);
}
