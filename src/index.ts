import "./style.css";
import { Game } from "./game";
import { setupEventListeners } from "./event-listeners";

function startGame() {
  const game = new Game();
  game.draw();
  setupEventListeners(game);
}

// Start this bad boy up!
startGame();
