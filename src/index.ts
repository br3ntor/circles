import "./style.css";
import { Game } from "./game";
import { setupEventListeners } from "./event-listeners";

(function initGame() {
  const game = new Game();
  setupEventListeners(game);
})();
