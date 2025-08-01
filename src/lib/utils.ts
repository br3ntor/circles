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
 * Random color from hue, hsl format
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
  const hslRegex = /hsl\((\d+)deg,\s*([\d.]+)%,\s*([\d.]+)%\)/;
  const match = hsl.match(hslRegex);

  if (match) {
    const H = parseFloat(match[1]);
    const S = parseFloat(match[2]);
    const L = parseFloat(match[3]);
    return { H, S, L };
  }

  return null;
}

/**
 * Canvas Utilities
 */
export function getRandomX(
  radius: number,
  wall: number,
  canvas: HTMLCanvasElement
) {
  return randInt(radius + wall, canvas.width - radius);
}

export function getRandomY(radius: number, canvas: HTMLCanvasElement) {
  return randInt(radius, canvas.height - radius);
}

/**
 * Returns a random integer between min and max, inclusive.
 * The distribution is weighted towards the minimum value.
 */
export function randIntLow(min: number, max: number) {
  // Using Math.pow with a higher exponent further skews the distribution towards 0.
  const r = Math.pow(Math.random(), 10);
  return Math.floor(r * (max - min + 1) + min);
}

// Helper to resolve properties that can be functions
export function resolve<T>(value: T | (() => T)): T {
  if (typeof value === "function") {
    return (value as () => T)();
  }
  return value;
}

export type Range = { min: number; max: number };

// Helper to get the average value from a number or a Range object.
export function getAverageValue(value: number | Range): number {
  if (typeof value === "number") {
    return value;
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "min" in value &&
    "max" in value
  ) {
    return (value.min + value.max) / 2;
  }
  // Fallback for unexpected types, returning a default.
  console.warn(
    `Unexpected type for getAverageValue: ${typeof value}. Returning default 10.`
  );
  return 10;
}
