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
  }

  resume(): void {
    this.isRunning = true;
    this.animationId = requestAnimationFrame(time => this.loop(time));
  }

  destroy(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.inputManager.destroy();
    this.renderer.destroy();
  }
}
