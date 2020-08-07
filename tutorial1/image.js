const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#050505";

class Image {
  constructor(imagePath, xpos, ypos, width, height) {
    this.imagePath = imagePath;
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
  }
}

function createImage(context, imgPath, xpos, ypos, width, height) {
  const myImage = document.createElement("img");
  myImage.src = imgPath;
  myImage.onload = () => context.drawImage(myImage, xpos, ypos, width, height);
}

const image = new Image("minami-ke7.png", 50, 50, 200, 200);

createImage(
  context,
  image.imagePath,
  image.xpos,
  image.ypos,
  image.width,
  image.height
);
