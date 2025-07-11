import { Goal, Player } from "./Classes.ts";
import {
  randInt,
  distance,
  balls,
  niceColor,
} from "./utils.ts";
import {
  particleCreator,
  guardianCreator,
} from "./particle-creators.ts";

// Options for the original particleCreator function to create levels
const particleConfigs: { wallCollision?: boolean; objects: () => number; radius: () => number; x: (radius: number, wall: number) => number; y: (radius: number) => number; xSpeed: () => number; ySpeed: () => number; color: () => string; }[] = [
  {
    wallCollision: false,
    objects: () => balls(),
    radius: () => 20,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    xSpeed: () => -1,
    ySpeed: () => -1,
    color: () => `hsl(0deg, 100%, 50%)`,
  },
  {
    wallCollision: false,
    objects: () => balls(),
    radius: () => 60,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    // xSpeed: () => 0,
    xSpeed: () => 0,
    ySpeed: () => -0.5,
    // color: () => `hsl(220deg, 100%, 50%)`,
    color: () => `hsl(75deg, 100%, 50%)`,
  },
  {
    objects: () => balls(),
    radius: () => Math.random() * 60 + 15,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    xSpeed: () => (Math.random() - 0.5) * 5,
    ySpeed: () => (Math.random() - 0.5) * 5,
    color: () => niceColor(),
  },
  {
    wallCollision: false,
    objects: () => balls(),
    radius: () => 30,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    ySpeed: () => (Math.random() - 0.5) * 8,
    xSpeed: () => (Math.random() - 0.5) * 1,
    color: () => niceColor(),
  },
  {
    objects: () => balls() + 15,
    radius: () => 10,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    xSpeed: () => 3,
    ySpeed: () => 0,
    color: () => niceColor(),
  },
  {
    objects: () => balls() - 4,
    radius: () => 100,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    xSpeed: () => (Math.random() - 0.5) * 2,
    ySpeed: () => (Math.random() - 0.5) * 2,
    color: () => niceColor(),
  },
];

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.background = "#0c0c0c";

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

// Colors for randomColor function
let level = 0;

let wall = false;

// Updates mouse state
addEventListener("mousemove", (event: MouseEvent) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Resizing resets game
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

/**
 * Left click event.
 * Starts the game when player is clicked.
 */
addEventListener("click", (event: MouseEvent) => {
  const clickDistance = distance(
    event.clientX,
    event.clientY,
    player!.x,
    player!.y
  );

  // If click happens within radius of player circle, set wall to false
  if (clickDistance < player!.radius) {
    wall = false;
  }

  /**
   * Starting some particle manipulation functions
   * triggered at the start game event
   */

  // changeParticlesSequential(particles);
  // changeParticlesConcurrent(particles);
});

/**
 * Events to add a mouse boost
 */
// addEventListener("mousedown", (event) => {
//   player.speed = 5;
// });
// addEventListener("mouseup", (event) => {
//   player.speed = 2;
// });

/**
 * Right click event.
 * Resets the game.
 */
addEventListener("contextmenu", (event: MouseEvent) => {
  event.preventDefault();
  init();
});

// Objects for canvas
let particles: import("./Classes").Particle[];
let guardians: import("./Classes").Guardian[];
let player: Player | null;
let goal: Goal | null;
let frameRequest: number;

// Sets game state and all objects to starting setup
function init() {
  particles = [];
  player = null;
  wall = true;
  goal = null;

  // Create particle objects
  particles = particleCreator(particleConfigs[level]);
  guardians = guardianCreator();
  // test = newParticlePattern();

  // Create player object
  const pR = 30;
  const pX = randInt(pR, 100 - pR);
  const pY = randInt(pR, canvas.height - pR);
  player = new Player(pX, pY, pR, "red");

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
  goal = new Goal(goalX, goalY, goalWidth, goalHeight);

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
function animate() {
  frameRequest = requestAnimationFrame(animate);

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
      if (level < particleConfigs.length - 1) {
        level += 1;
      } else {
        level = 0;
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

// Start this bad boy up!
init();
animate();
