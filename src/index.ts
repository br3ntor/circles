import "./styles/style.css";
import { Game } from "./game";
import { setupEventListeners } from "./utils/event-listeners";

(function initGame() {
  const game = new Game();
  setupEventListeners(game);
})();
