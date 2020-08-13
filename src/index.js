// import resolveCollision from "./util-elastic-collision";
import { Particle, Goal, Player } from "./Classes";
import { randInt, randomColor, getColor, niceColor, distance } from "./utils";

// function circlePattern() {
//   const p = [];
//   const particleCount = 15;

//   let angle = 360 - 90;
//   let dangle = 360 / particleCount;

//   for (let i = 0; i < particleCount; i++) {
//     angle += dangle;
//     circle.style.transform = `rotate(${angle}deg) translate(${ciclegraph.clientWidth /
//       2}px) rotate(-${angle}deg)`;
//     p.push(new Particle());
//   }

//   return p;
// }
function singleParticle() {
  return [new Particle(innerWidth / 2, innerHeight / 2, 30, getColor(), 0, 0)];
}

function stackParticles() {
  const p = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    p.push(new Particle(innerWidth / 2, innerHeight / 2, 10, getColor(), 0, 0));
  }

  return p;
}
function circleParticles() {
  const p = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 5 + 2;
    p.push(
      new Particle(innerWidth / 2, innerHeight / 2, radius, getColor(), 0, 0)
    );
  }

  return p;
}

// This would be great to make it accept also a function and delay pehaps
function changeParticlesSequential(particles) {
  let i = 0;

  const interval = setInterval(() => {
    particles[i].velocity.x = (Math.random() - 0.5) * 6;
    particles[i].velocity.y = (Math.random() - 0.5) * 6;

    if (i++ >= particles.length - 1) {
      i = 0;
      // clearInterval(interval);
    }
  }, 300);

  return interval;
}

function changeParticlesConcurrent(particles) {
  const moveSequence = [
    [2, 0],
    [0, 1],
    [-2, 0],
    [0, -1],
  ];
  let i = 0;

  const interval = setInterval(() => {
    particles.forEach((p) => {
      p.velocity.x = moveSequence[i][0];
      p.velocity.y = moveSequence[i][1];
    });

    if (i >= moveSequence.length - 1) {
      i = 0;
    } else {
      i++;
    }
  }, 2000);

  return interval;
}

function newParticlePattern() {
  const p = [];
  const particleCount = 15;

  for (let i = 1; i <= particleCount; i++) {
    if (i % 2 === 0) {
      p.push(new Particle(60 * i + 105, 40, 30, getColor(), 2, 2, false));
    } else {
      p.push(
        new Particle(
          60 * i + 105,
          innerHeight - 40,
          30,
          getColor(),
          2,
          -2,
          false
        )
      );
    }
  }

  return p;
}

// Create particle objects
function particleCreator(level) {
  const p = [];
  const wallEnd = 105;
  const objects = level.objects();

  for (let i = 0; i < objects; i++) {
    const radius = level.radius();
    let x = level.x(radius, wallEnd);
    let y = level.y(radius);
    const xS = level.xSpeed();
    const yS = level.ySpeed();
    const color = level.color();

    // Skip first generation, only 1 circle
    if (i !== 0) {
      // Keep track of retries for a no overlap circle
      let retries = 0;

      for (let j = 0; j < p.length; j++) {
        if (retries > 100) {
          console.log("Not enough space for circles!");
          break;
        }
        const dist = distance(x, y, p[j].x, p[j].y);

        if (dist - radius - p[j].radius < 0) {
          // The + 105 here is for the wall
          x = level.x(radius, wallEnd);
          y = level.y(radius);

          // Reset loop to check if replacement
          // circle has overlap itself.
          j = -1;
          retries++;
        }
      }
    }

    p.push(new Particle(x, y, radius, color, xS, yS, level.wallCollision));
  }
  return p;
}

// Sets game state and all objects to starting setup
function init() {
  particles = [];
  player = null;
  wall = true;
  goal = null;

  // Create particle objects
  // particles = particleCreator(particleConfigs[level]);
  // particles = newParticlePattern();
  // particles = stackParticles();
  particles = circleParticles();

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

// The animation loop
function animate() {
  frameRequest = requestAnimationFrame(animate);

  // Clear canvas for next draw
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Alt to clearRect for an effect
  // ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    // Hmm what happens here when init and animate
    // are called after cancle animation?
    particles.forEach((p) => {
      p.circleUpdate(ctx, mouse);
      // const collision = p.update(ctx, particles, player);
      // if (collision) {
      //   cancelAnimationFrame(frameRequest);
      //   p.draw(ctx);
      //   setTimeout(() => {
      //     alert("You lose");
      //     init();
      //     animate();
      //   });
      // }
    });
  }

  player.update(ctx, wall, mouse);
}

// For testing to see first render. Comment out animate().
function drawParticleFrame(ctx) {
  particles.forEach((p) => {
    p.draw(ctx);
  });
}

// Dynamically generate number of balls based on screen dimensions
function balls() {
  return Math.floor(innerHeight / 100 + innerWidth / 200);
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
// canvas.style.background = "#0c0c0c";
// canvas.style.background = "green";
// canvas.style.background = "rgb(0, 0, 0)";

// Colors for randomColor function
const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

let mouse = {
  x: 30,
  y: innerHeight / 2,
};

let level = 0;

let wall = true;

// Objects for canvas
let particles;
let player;
let goal;

let frameRequest;

// Options for particle objects
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
    objects: () => balls() - 5,
    radius: () => 100,
    x: (radius, wall) => randInt(radius + wall, canvas.width - radius),
    y: (radius) => randInt(radius, canvas.height - radius),
    xSpeed: () => (Math.random() - 0.5) * 2,
    ySpeed: () => (Math.random() - 0.5) * 2,
    color: () => getColor(),
  },
];

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

  changeParticlesSequential(particles);
  // changeParticlesConcurrent(particles);
});

// Right click resets game
addEventListener("contextmenu", (event) => {
  event.preventDefault();
  init();
});

init();

// drawParticleFrame(ctx);
animate();
