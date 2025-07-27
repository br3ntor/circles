export class Vector2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  multiply(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  subtract(other: Vector2) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  distanceTo(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    return mag > 0
      ? new Vector2(this.x / mag, this.y / mag)
      : new Vector2(0, 0);
  }

  dot(other: Vector2) {
    return this.x * other.x + this.y * other.y;
  }
}
