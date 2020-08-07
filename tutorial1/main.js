const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#6849a0";

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
    context.font = "30px Arial";
    context.fillText(this.text, this.x_pos, this.y_pos);

    // Circle
    context.strokeStyle = this.color;
    context.lineWidth = this.thick;
    context.beginPath();
    context.arc(this.x_pos, this.y_pos, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  reverseX() {
    this.nextX = -this.nextX;
  }

  reverseY() {
    this.nextY = -this.nextY;
  }

  update() {
    // this.text = hit_counter;

    this.draw(context);

    if (this.x_pos + this.radius > window_width) {
      this.nextX = -this.nextX;
      // hit_counter++;
    }

    if (this.x_pos - this.radius < 0) {
      this.nextX = -this.nextX;
      // hit_counter++;
    }

    if (this.y_pos + this.radius > window_height) {
      this.nextY = -this.nextY;
      // hit_counter++;
    }

    if (this.y_pos - this.radius < 0) {
      this.nextY = -this.nextY;
      // hit_counter++;
    }

    this.x_pos += this.nextX;
    this.y_pos += this.nextY;
  }
}

const getDistance = (xpos1, ypos1, xpos2, ypos2) => {
  const result = Math.sqrt(
    Math.pow(xpos2 - xpos1, 2) + Math.pow(ypos2 - ypos1, 2)
  );
  return result;
};

// let circle_counter = 1;
// let hit_counter = 0;

// const rR = Math.random() * 50 + 10;
const rR = 100;

// const rX = getRandomIntInclusive(rR, window_width - rR);
// const rY = getRandomIntInclusive(rR, window_height - rR);

const rX = () => getRandomIntInclusive(rR, window_width - rR);
const rY = () => getRandomIntInclusive(rR, window_height - rR);

const rThick = () => Math.random() * 20 + 1;
const color = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

// const my_circle = new Circle(rX, rY, rR, color, rThick, hit_counter, 4);
// const my_circle2 = new Circle(rX, rY, rR, color, rThick, hit_counter, 4);

const my_circle = new Circle(rX(), rY(), rR, color(), rThick(), "A", 4);
const my_circle2 = new Circle(rX(), rY(), 200, color(), rThick(), "B", 0);

// const my_circle = new Circle(100, 100, 100, color, rThick, hit_counter, 4);
// const my_circle2 = new Circle(rX, rY, rR, color, rThick, hit_counter, 4);

my_circle.draw(context);
my_circle2.draw(context);

const updateCircle = function () {
  requestAnimationFrame(updateCircle);
  context.clearRect(0, 0, window_width, window_height);
  my_circle.update();
  my_circle2.update();

  if (
    getDistance(
      my_circle.x_pos,
      my_circle.y_pos,
      my_circle2.x_pos,
      my_circle2.y_pos
    ) <=
    my_circle2.radius + my_circle.radius
  ) {
    my_circle2.color = "red";
    my_circle.reverseY();
    my_circle.reverseX();
  } else {
    my_circle2.color = "black";
  }
};

updateCircle();

// Helper functions

// The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
