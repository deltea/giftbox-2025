export class GameState {
  // private playerPosition: { x: number; y: number } = { x: 0, y: 0 };
  private gameTime: number = 0;
  private isStarted: boolean = false;

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

  // moveLeft(): void {
  //   this.playerPosition.x -= 1;
  // }

  // moveRight(): void {
  //   this.playerPosition.x += 1;
  // }

  // getPlayerPosition(): { x: number; y: number } {
  //   return { ...this.playerPosition };
  // }

  hasStarted(): boolean {
    return this.isStarted;
  }

  getGameTime(): number {
    return this.gameTime;
  }
}
