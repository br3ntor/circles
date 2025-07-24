export class Timer {
  running: boolean;
  startTime: number;
  endTime: number;
  duration: number;

  constructor() {
    this.running = false;
    this.startTime = 0;
    this.endTime = 0;
    this.duration = 0;
  }
  start() {
    if (this.running) {
      // throw new Error("Already started");
    }
    this.running = true;
    this.startTime = Date.now();
  }
  stop() {
    if (!this.running) {
      // throw new Error("Not started");
    }
    this.running = false;
    this.endTime = Date.now();
    const seconds = (this.endTime - this.startTime) / 1000;
    this.duration += seconds;
  }
  reset() {
    this.startTime = 0;
    this.endTime = 0;
    this.running = false;
    this.duration = 0;
  }
  getElapsedTime() {
    if (!this.running) {
      return 0;
    }
    return (Date.now() - this.startTime) / 1000;
  }
}
