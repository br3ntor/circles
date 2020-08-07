// I want to remake this whole thing, clean it up
// Get greater control over it, think about the steps a bit more.
// I want to if you click on a circle have it stop moving, click again and it will start
// Maybe some better collision detection with the mouse
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#0a0a0a";
// canvas.style.background = "#white";

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
  velocity: {
    x: 0.5 * 2,
    y: 0.5 * 2,
  },
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Random Int from Range Inclusive
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}
const getColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);
const niceColor = () => randInt(0, 360);

function distance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Should these methods be on the prototype?
function Particle(x, y, radius, color, thick) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
  };
  this.radius = radius;
  this.color = color;
  this.mass = 1;
  this.opacity = 0.2;
  this.thick = thick;

  this.update = (particles) => {
    this.draw();

    // Loop over particles for collision detection
    for (let i = 0; i < particles.length; i++) {
      // Never compare particle to itself, skips if true.
      if (this === particles[i]) continue;

      const dist = distance(this.x, this.y, particles[i].x, particles[i].y);

      // if (dist - this.radius * 2 < 0) {
      if (dist - this.radius - particles[i].radius < 0) {
        // Elastic collision
        resolveCollision(this, particles[i]);
        this.opacity = 0.5;
        particles[i].opacity = 0.5;
      }
    }

    // Collision detection for walls
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }
    // Mouse collision detection
    if (
      distance(mouse.x, mouse.y, this.x, this.y) < this.radius &&
      this.opacity < 1
    ) {
      this.opacity += 0.02;
      // this.velocity.x = -this.velocity.x;
      // this.velocity.y = -this.velocity.y;
      // this.velocity.x = 0;
      // this.velocity.y = 0;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
      // this.velocity.x = (Math.random() - 0.5) * 2;
      // this.velocity.y = (Math.random() - 0.5) * 2;
    }

    // if (distance(mouse.x, mouse.y, this.x, this.y) < 30) {
    // }
    // for (let i = 0; i < particles.length; i++) {
    //   const dMouse = distance(mouse.x, mouse.y, this.x, this.y)
    // }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };

  this.draw = () => {
    // ctx.lineWidth = this.thick;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  };
}

let particles;

function init() {
  particles = [];

  // TODO: Figure out how to calculate if diff radius
  for (let i = 0; i < 0; i++) {
    // const radius = 20;
    // const radius = 3 * i;
    const radius = Math.random() * 60 + 15;
    let x = randInt(radius, canvas.width - radius);
    let y = randInt(radius, canvas.height - radius);
    const thickness = Math.random() * 20 + 1;

    // Trying 3 different methods to get color
    // const color = `hsl(${niceColor()}deg, 100%, 50%)`;
    const color = getColor();
    // const color = randomColor(colors);

    // Skip first generation, only 1 circle
    if (i !== 0) {
      // Keep track of retries for a no overlap circle
      let retries = 0;

      for (let j = 0; j < particles.length; j++) {
        if (retries > 100) throw "Failed to draw circle, tried 100 times!";
        const dist = distance(x, y, particles[j].x, particles[j].y);

        if (dist - radius * 2 < 0) {
          x = randInt(radius, canvas.width - radius);
          y = randInt(radius, canvas.height - radius);

          // Reset loop to check if replacement
          // circle has overlap itself.
          j = -1;
          retries++;
        }
      }
    }

    particles.push(new Particle(x, y, radius, color, thickness));
  }

  return "Particles created.";
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update(particles);
  });
}

// Used for testing
// function draw() {
//   particles.forEach((p) => {
//     p.draw();
//   });
// }

init();
animate();
