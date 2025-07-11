import { Goal, Player } from "./Classes";
import { particleCreator, guardianCreator } from "./particle-creators";
import { getParticleConfigs } from "./level-configs";
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
  setWall,
  wall,
  guardians,
  particles,
  goal,
  frameRequest,
  setLevel,
} from "./game-state";
import { randInt } from "./utils";

// Sets game state and all objects to starting setup
export function init() {
  // Create particle objects
  setParticles(particleCreator(getParticleConfigs(canvas, "roo")[level]));
  setGuardians(guardianCreator());
  // test = newParticlePattern();

  // Create player object
  const pR = 30;
  const pX = randInt(pR, 100 - pR);
  const pY = randInt(pR, canvas.height - pR);
  setPlayer(new Player(pX, pY, pR, "red"));

  // Create goal object
  // const goalWidth = 100;
  // const goalHeight = 160;
  // const goalX = canvas.width - goalWidth;
  // const goalY = canvas.height / 2 - goalHeight / 2;

  // Draw goal on the right side
  const goalWidth = 120;
  const goalHeight = 120;
  const goalX = canvas.width / 1.2 - goalWidth / 2;
  const goalY = canvas.height / 2 - goalHeight / 2;
  setGoal(new Goal(goalX, goalY, goalWidth, goalHeight));

  setWall(true);

  return "Initialized game objects.";
}

/**
 * Used inside animate to draw still
 * particles while the wall is up
 */
function drawCurrentState(ctx: CanvasRenderingContext2D) {
  particles.forEach((p) => {
    p.draw(ctx);
  });
  guardians.forEach((g) => {
    g.draw(ctx);
  });
  // test.forEach((t) => {
  //   t.draw(ctx);
  // });
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
      if (level < getParticleConfigs(canvas, "roo").length - 1) {
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
  if (wall === true) {
    // Draw left start area barrier
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, canvas.height);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#eeeeee";
    ctx.stroke();
    ctx.closePath();
    drawCurrentState(ctx);
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
      // g.draw(ctx);
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

    // test.forEach((p) => {
    //   const collision = p.update(ctx, particles, player);

    //   if (collision) {
    //     cancelAnimationFrame(frameRequest);
    //     p.draw(ctx);

    //     setTimeout(() => {
    //       alert("You lose");
    //       init();
    //       animate();
    //     });
    //   }
    // });
  }

  // Might make sense to draw/update player first
  player!.update(ctx, wall, mouse);
}
