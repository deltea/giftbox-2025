export class State {
  gameTime: number = 0;
  deltaTime: number = 0;
  isStarted: boolean = false;
  spawnPoint: { x: number; y: number } = { x: 0, y: 0 };

  hasKey: boolean = false;
  hasMission: boolean = false;
  isEnd: boolean = false;
}
