const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// canvas.style.background = "#0a0a0a";
canvas.style.background = "linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%)";

addEventListener("resize", (event) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

const colors = [
  "#8ABF40",
  "#B53EBB",
  "#4088BF",
  "#C15444",
  "#66C7CC",
  "#62CBB1",
  "#EDC9E5",
];

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Random Int from Range Inclusive
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
    };
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();

    // Collision detection for walls
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

let particles;

function init() {
  particles = [];
  const amount = 50;

  // Populate particles array
  for (let i = 0; i < amount; i++) {
    const radius = 50;
    let x = randInt(radius, canvas.width - radius);
    let y = randInt(radius, canvas.height - radius);

    const color = randomColor(colors);

    // Skip first generation, only 1 particle
    // if (i !== 0) {
    //   // Keep track of retries for a no overlap particle
    //   let retries = 0;

    //   for (let j = 0; j < particles.length; j++) {
    //     if (retries > 100) throw "Failed to draw particle, tried 100 times!";

    //     // Get distance between the previous
    //     // particle, and the next particle
    //     const dist = distance(x, y, particles[j].x, particles[j].y);

    //     // If next circle overlaps with prev get new coords and try again
    //     // Currently assumes both particles have the same radius
    //     if (dist - radius * 2 < 0) {
    //       x = randInt(radius, canvas.width - radius);
    //       y = randInt(radius, canvas.height - radius);
    //       j = -1;
    //       retries++;
    //     }
    //   }
    // }

    // Create the particles, feed it with yummy arguments!
    particles.push(new Particle(x, y, radius, color));
  }

  return "Particles created.";
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
  });
}

init();
animate();
