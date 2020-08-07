const closeInfo = document.getElementById("close-info");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

closeInfo.onclick = function (e) {
  e.target.parentNode.style.display = "none";
};

canvas.width = innerWidth;
canvas.height = innerHeight;

canvas.style.background = "linear-gradient( 135deg, #F97794 10%, #623AA2 60%)";

let mouse = {
  // x: innerWidth / 2,
  // y: innerHeight / 2,
  x: 0,
  y: 0,

  velocity: {
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    // x: 0.5 * 2,
    // y: 0.5 * 2,
    // x: 2,
    // y: 2,
  },
  mass: 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", (event) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

// Random Int from Range Inclusive
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Three optional function to get different colors
function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}
const getColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);
const niceColor = () => randInt(0, 360);

// Pythagorean theorem
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
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1; // Used in elastic collision
    this.opacity = 0.2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.lineWidth = 2;
    ctx.fillStyle = this.color;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }

  update(particles) {
    this.draw();

    // Loop over particles for collision detection
    for (let i = 0; i < particles.length; i++) {
      // Never compare particle to itself, skips if true.
      if (this === particles[i]) continue;

      const dist = distance(this.x, this.y, particles[i].x, particles[i].y);
      // const mD = distance(mouse.x, mouse.y, this.x, this.y);

      if (dist - this.radius - particles[i].radius < 0) {
        // Elastic collision
        resolveCollision(this, particles[i]);

        // Light up particles on collision
        this.opacity = 0.6;
        particles[i].opacity = 0.6;
      }

      // if (mD - this.radius -  < 0) {}
    }

    // Collision detection for walls
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    // Mouse collision detection
    // if (
    //   distance(mouse.x, mouse.y, this.x, this.y) < this.radius &&
    //   this.opacity < 1
    // ) {
    //   this.opacity += 0.02;
    // } else if (this.opacity > 0) {
    //   this.opacity -= 0.02;
    //   this.opacity = Math.max(0, this.opacity);
    // }

    if (distance(mouse.x, mouse.y, this.x, this.y) < this.radius + 30) {
      if (this.opacity < 1) {
        this.opacity += 0.02;
      }

      // console.log("I touch you!");
      // resolveCollision(this, mouse);
      // mouse.velocity.x = Math.random() * 2;
      // mouse.velocity.y = Math.random() * 2;
      // mouse.velocity.x = (Math.random() - 0.5) * 2;
      // mouse.velocity.y = (Math.random() - 0.5) * 2;
      // mouse.velocity.x = 5;
      // mouse.velocity.y = 5;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    // Set particles to next position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

let particles;

function init(numOfObj = 15) {
  particles = [];

  for (let i = 0; i < numOfObj; i++) {
    const radius = Math.random() * 60 + 15;
    let x = randInt(radius, canvas.width - radius);
    let y = randInt(radius, canvas.height - radius);

    const color = getColor();

    // Skip first generation, only 1 circle
    if (i !== 0) {
      // Keep track of retries for a no overlap circle
      let retries = 0;

      for (let j = 0; j < particles.length; j++) {
        if (retries > 100) {
          console.log("Not enough space for circles!");
          break;
        }
        const dist = distance(x, y, particles[j].x, particles[j].y);

        if (dist - radius - particles[j].radius < 0) {
          x = randInt(radius, canvas.width - radius);
          y = randInt(radius, canvas.height - radius);

          // Reset loop to check if replacement
          // circle has overlap itself.
          j = -1;
          retries++;
        }
      }
    }

    particles.push(new Particle(x, y, radius, color));
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

addEventListener("click", (event) => {
  particles.forEach((p) => {
    const d = distance(event.clientX, event.clientY, p.x, p.y);
    if (d < p.radius) {
      p.velocity.x = p.velocity.x * 5;
      p.velocity.y = p.velocity.y * 5;
    }
  });
});

addEventListener("contextmenu", (event) => {
  event.preventDefault();
  init();
});

init();
animate();
