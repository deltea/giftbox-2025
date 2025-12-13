export class State {
  gameTime: number = 0;
  isStarted: boolean = false;

  update(currentTime: number): void {
    this.gameTime = currentTime;
  }

  start(): void {
    this.isStarted = true;
    this.gameTime = 0;
  }

  end(): void {
    this.isStarted = false;
  }
}
