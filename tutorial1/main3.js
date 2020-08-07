const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#050505";

class Circle {
  constructor(x_pos, y_pos, radius, color, thick, text, speed) {
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.radius = radius;
    this.color = color;
    this.thick = thick;
    this.text = text;
    this.speed = speed;

    this.nextX = 1 * this.speed;
    this.nextY = 1 * this.speed;
  }

  draw(context) {
    // Circle Text
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "16px Arial";
    context.fillText(this.text, this.x_pos, this.y_pos);

    // Circle
    context.strokeStyle = this.color;
    context.lineWidth = this.thick;
    context.beginPath();
    context.arc(this.x_pos, this.y_pos, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update() {
    this.draw(context);

    if (this.x_pos + this.radius > window_width) {
      this.nextX = -this.nextX;
    }

    if (this.x_pos - this.radius < 0) {
      this.nextX = -this.nextX;
    }

    if (this.y_pos + this.radius > window_height) {
      this.nextY = -this.nextY;
    }

    if (this.y_pos - this.radius < 0) {
      this.nextY = -this.nextY;
    }

    this.x_pos += this.nextX;
    this.y_pos += this.nextY;
  }
}

// Random integer range, min and max inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSpeed(min, max) {
  return Math.random() * (max - min) + min;
}

const all_circles = [];

const minRadius = 40;
const maxRadius = 100;

const rR = (min, max) => getRandomIntInclusive(min, max);
const rX = () => getRandomIntInclusive(maxRadius, window_width - maxRadius);
const rY = () => getRandomIntInclusive(maxRadius, window_height - maxRadius);
const speed = () => randomSpeed(0, 0.5);
const color = () => "#" + Math.floor(Math.random() * 16777215).toString(16);
const thickness = () => getRandomIntInclusive(2, 12);

for (let i = 0; i < 20; i++) {
  const radius = rR(minRadius, maxRadius);
  const my_circle = new Circle(
    rX(),
    rY(),
    radius,
    color(),
    thickness(),
    "",
    speed()
  );
  all_circles.push(my_circle);
}

const updateCircle = function () {
  requestAnimationFrame(updateCircle);
  context.clearRect(0, 0, window_width, window_height);

  all_circles.forEach((element) => {
    // element.text = Math.round(element.x_pos) + ", " + Math.round(element.y_pos);
    element.update();
  });
};

updateCircle();
