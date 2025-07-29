import "./styles/style.css";
import { Game } from "./game";
import { setupEventListeners } from "./managers/InputManager";

(async function initGame() {
  const game = new Game();
  await game.init();
  setupEventListeners(game);
})();
