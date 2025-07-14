import { Goal, Player } from "./game-objects";
import { guardianCreator } from "./particle-creators";
import { levelSet } from "./levels";
import {
  canvas,
  ctx,
  level,
  mouse,
  player,
  setFrameRequest,
  setGoal,
  setGuardians,
  setParticles,
  setPlayer,
  setGameRunning,
  gameRunning,
  guardians,
  particles,
  goal,
  frameRequest,
  setLevel,
} from "./game-state";
import { randInt } from "./utils";

// Sets game state and all objects to starting setup
export function init() {
  // Setup level particles
  const currentLevel = levelSet[level];
  setParticles(currentLevel.particles());
  setGuardians(guardianCreator(canvas));

  // Create player object
  const pR = 30;
  const pX = randInt(pR, 100 - pR);
  const pY = randInt(pR, canvas.height - pR);
  setPlayer(new Player(pX, pY, pR, "red"));

  // Draw goal on the right side
  const goalWidth = 120;
  const goalHeight = 120;
  const goalX = canvas.width / 1.2 - goalWidth / 2;
  const goalY = canvas.height / 2 - goalHeight / 2;
  setGoal(new Goal(goalX, goalY, goalWidth, goalHeight));

  // Test for starting functions that change behavior mid game,
  // could trigger on other events as well.
  // changeParticlesConcurrent(particles);
  // changeParticlesSequential(particles);
  setGameRunning(false);
}

/**
 * Used inside animate to draw still
 * particles before game starts
 */
function drawCurrentState(ctx: CanvasRenderingContext2D) {
  particles.forEach((p) => {
    p.draw(ctx);
  });
  guardians.forEach((g) => {
    g.draw(ctx);
  });
}

/**
 * Draws a startup message in the center of the screen
 */
function drawStartupMessage(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "white";
  ctx.font = "26px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Click the red circle or press space bar to start the game",
    canvas.width / 2,
    canvas.height - 200
  );
}

// The animation loop
export function animate() {
  setFrameRequest(requestAnimationFrame(animate));

  // Clear canvas for next draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draws goal and detects if player has entered the goal.
  // Returns undefined until goal reached then returns true.
  const goalReached = goal!.update(ctx, player!);

  // If Goal is reached set to next level and continue
  if (goalReached) {
    cancelAnimationFrame(frameRequest);
    goal!.draw(ctx);
    setTimeout(() => {
      alert(`You beat level ${level + 1}!`);
      if (level < levelSet.length - 1) {
        setLevel(level + 1);
      } else {
        setLevel(0);
      }
      init();
      animate();
    });
  }

  // If they player is behind starting wall, draw the wall
  // else, update / draw particle position and check for
  // collision. If collision then reset level
  if (!gameRunning) {
    // Draw left start area barrier
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, canvas.height);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#eeeeee";
    ctx.stroke();
    ctx.closePath();
    drawCurrentState(ctx);
    drawStartupMessage(ctx);
  } else {
    /**
     * Loop through particles array
     * and call their update functions
     */
    particles.forEach((p) => {
      const collision = p.update(ctx, particles, player!);

      if (collision) {
        cancelAnimationFrame(frameRequest);
        p.draw(ctx);

        setTimeout(() => {
          alert("You lose");
          init();
          animate();
        });
      }
    });

    // Update guardians of the goal
    guardians.forEach((g) => {
      const collision = g.update(ctx, particles, player!);

      if (collision) {
        cancelAnimationFrame(frameRequest);
        g.draw(ctx);

        setTimeout(() => {
          alert("You lose");
          init();
          animate();
        });
      }
    });
  }

  // Might make sense to draw/update player first
  player!.update(ctx, gameRunning, mouse);
}
