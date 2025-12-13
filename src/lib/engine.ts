import { InputManager } from "./input-manager";
import { Renderer } from "./renderer";
import { State } from "./state";
import { config } from "./config";
import { SceneManager } from "./scene-manager";

export class Engine {
  inputManager: InputManager;
  sceneManager: SceneManager;
  renderer: Renderer;
  state: State;
  animationId: number = 0;
  isRunning: boolean = false;
  lastFrameTime: number = 0;

  constructor() {
    this.inputManager = new InputManager();
    this.sceneManager = new SceneManager();
    this.renderer = new Renderer(config.dims.width, config.dims.height);
    this.state = new State();
  }

  async init(): Promise<void> {
    this.renderer.init();
    this.isRunning = true;
    this.animationId = requestAnimationFrame(time => this.loop(time));

    this.sceneManager.changeScene(config.startScene);
  }

  loop(time: number): void {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = time;
      this.state.deltaTime = 0;
    } else {
      const delta = time - this.lastFrameTime;
      this.state.deltaTime = delta / 1000;
      this.lastFrameTime = time;
    }

    const activeScene = this.sceneManager.getCurrentScene();
    this.state.gameTime = time;

    this.renderer.clear();
    if (activeScene) {
      activeScene.update(this.state, this.inputManager, this.sceneManager);
      activeScene.draw(this.state, this.renderer);
    }
    this.renderer.render();

    if (this.isRunning) {
      this.animationId = requestAnimationFrame(time => this.loop(time));
    }
  }

  pause(): void {
    this.isRunning = false;
    this.lastFrameTime = 0;
  }

  resume(): void {
    this.isRunning = true;
    this.lastFrameTime = 0;
    this.animationId = requestAnimationFrame(time => this.loop(time));
  }

  destroy(): void {
    this.isRunning = false;
    this.lastFrameTime = 0;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.inputManager.destroy();
    this.renderer.destroy();
  }
}
