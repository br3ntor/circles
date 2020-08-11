/**
 * Random Int from Range Inclusive
 */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Three optional function to get colors
export function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function niceColor() {
  const r = randInt(0, 360);
  return `hsl(${r}deg 100% 50%)`;
}

// Pythagorean theorem
export function distance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
