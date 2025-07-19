import type { State } from "./State";

export class StateMachine {
  private _currentState: State | null = null;

  public get currentState(): State | null {
    return this._currentState;
  }

  public transitionTo(newState: State): void {
    if (this._currentState) {
      this._currentState.exit();
    }
    this._currentState = newState;
    this._currentState.enter();
  }

  public update(deltaTime: number): void {
    if (this._currentState) {
      this._currentState.update(deltaTime);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this._currentState) {
      this._currentState.draw(ctx);
    }
  }
}
