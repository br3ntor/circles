/**
 * Random Int from Range Inclusive
 */
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Random custom color from array.
 */
export function randomColor(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Random hexidecimal color
 */
export function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Random color from hue
 */
export function niceColor() {
  const r = randInt(0, 360);
  return `hsl(${r}deg 100% 50%)`;
}

/**
 * Pythagorean theorem
 */
export function distance(x1: number, y1: number, x2: number, y2: number) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

/**
 * Dynamically generate appropriate number of balls based on screen dimensions
 */
export function balls() {
  return Math.floor(innerHeight / 100 + innerWidth / 200);
}

/**
 * Parses values out of HSL string
 * @param String | hsl | CSS hsl string
 * @return Object | HSL values
 */
export function getHSL(hsl: string) {
  const H = parseFloat(hsl.slice(4, hsl.indexOf("d")));
  const S = parseFloat(hsl.split(",")[1]);
  const L = parseFloat(hsl.split(",")[2].slice(0, -1));
  return { H, S, L };
}
