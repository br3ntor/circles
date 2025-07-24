export class Timer {
  running: boolean;
  startTime: Date | number;
  endTime: Date | number;
  durration: number;

  constructor() {
    this.running = false;
    this.startTime = 0;
    this.endTime = 0;
    this.durration = 0;
  }
  start() {
    if (this.running) {
      throw new Error("Already started");
    }
    this.running = true;
    this.startTime = new Date();
  }
  stop() {
    if (!this.running) {
      throw new Error("Not started");
    }
    this.running = false;
    this.endTime = new Date();
    const seconds =
      ((this.endTime as Date).getTime() - (this.startTime as Date).getTime()) /
      1000;
    this.durration += seconds;
  }
  reset() {
    this.startTime = 0;
    this.endTime = 0;
    this.running = false;
    this.durration = 0;
  }
  now() {
    return (Date.now() - (this.startTime as Date).getTime()) / 1000;
  }
}
