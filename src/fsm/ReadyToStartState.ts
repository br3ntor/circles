import { State } from "./State";

export class ReadyToStartState extends State {
  public enter(): void {
    // The game is already reset before entering this state.
  }

  public update(deltaTime: number): void {
    // The initial state is static. Player movement is handled by the PlayingState.
  }
}
