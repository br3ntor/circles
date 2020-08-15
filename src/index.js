import { Goal, Player } from "./Classes";
import {
  randInt,
  randomColor,
  getColor,
  niceColor,
  distance,
  balls,
} from "./utils";
import {
  particleCreator,
  circlePattern,
  newParticlePattern,
} from "./particle-creators";
import {
  changeParticlesSequential,
  changeParticlesConcurrent,
} from "./particle-manipulators";

// Options for the original particleCreator function to create levels
const particleConfigs = [
  {
    objects: () => balls(),
    radius: () => Math.random() * 60 + 15,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    xSpeed: () => (Math.random() - 0.5) * 5,
    ySpeed: () => (Math.random() - 0.5) * 5,
    color: () => getColor(),
  },
  {
    wallCollision: false,
    objects: () => balls() + 10,
    radius: () => 30,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    ySpeed: () => (Math.random() - 0.5) * 8,
    xSpeed: () => (Math.random() - 0.5) * 1,
    color: () => randomColor(colors),
  },
  {
    objects: () => balls() + 20,
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
    color: () => getColor(),
  },
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.background = "#0c0c0c";
// canvas.style.background = "green";
// canvas.style.background = "rgb(0, 0, 0)";

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

// Colors for randomColor function
const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

let level = 1;

let wall = true;

// Updates mouse state
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Resizing resets game
addEventListener("resize", (event) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

/**
 * Left click event.
 * Starts the game when player is clicked.
 */
addEventListener("click", (event) => {
  const clickDistance = distance(
    event.clientX,
    event.clientY,
    player.x,
    player.y
  );

  // If click happens within radius of player circle, set wall to false
  if (clickDistance < player.radius) {
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
 * Right click event.
 * Resets the game.
 */
addEventListener("contextmenu", (event) => {
  event.preventDefault();
  init();
});

// Objects for canvas
let particles;
let player;
let goal;

let frameRequest;

// Sets game state and all objects to starting setup
function init() {
  particles = [];
  player = null;
  wall = true;
  goal = null;

  // Create particle objects
  particles = particleCreator(particleConfigs[level]);
  // particles = newParticlePattern();
  // particles = stackParticles();
  // particles = circlePattern();

  // Create player object
  const pR = 30;
  const pX = randInt(pR, 100 - pR);
  const pY = randInt(pR, canvas.height - pR);
  player = new Player(pX, pY, pR, "red");

  // Create goal object
  const goalWidth = 100;
  const goalHeight = 160;
  const goalX = canvas.width - goalWidth;
  const goalY = canvas.height / 2 - goalHeight / 2;
  goal = new Goal(goalX, goalY, goalWidth, goalHeight);

  return "Initialized game objects.";
}

// Used inside animate to draw still particles
function drawParticleFrame(ctx) {
  particles.forEach((p) => {
    p.draw(ctx);
  });
}

// The animation loop
function animate() {
  frameRequest = requestAnimationFrame(animate);

  // Clear canvas for next draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Alt to clearRect using fillRect

  // ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  // ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draws goal and detects if player has entered the goal.
  // Returns undefined until goal reached then returns true.
  const goalReached = goal.update(ctx, player);

  // If Goal is reached set to next level and continue
  if (goalReached) {
    cancelAnimationFrame(frameRequest);
    goal.draw(ctx);
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
    drawParticleFrame(ctx);
  } else {
    /**
     * Loop through particles array
     * and call their update functions
     */
    particles.forEach((p) => {
      // Hmm what happens here when init and animate
      // are called after cancle animation?
      // p.circleUpdate(ctx, mouse);
      const collision = p.update(ctx, particles, player);

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
  }

  player.update(ctx, wall, mouse);
}

init();

// drawParticleFrame(ctx);
animate();
