import { InputManager } from "./InputManager";
import { Renderer } from "./renderer";
import { State } from "./state";
import type { Scene } from "./scene";
import { config } from "./config";

export class Engine {
  inputManager: InputManager;
  renderer: Renderer;
  state: State;
  animationId: number = 0;
  isRunning: boolean = false;

  // scene management
  activeSceneId: string | null = null;
  transitionDuration: number = 0;
  transitionProgress: number = 0;
  isTransitioning: boolean = false;

  constructor() {
    this.inputManager = new InputManager();
    this.renderer = new Renderer(config.dims.width, config.dims.height);
    this.state = new State();
  }

  async init(): Promise<void> {
    this.renderer.init();
    this.isRunning = true;
    this.animationId = requestAnimationFrame(time => this.gameLoop(time));

    this.changeScene(config.startScene);
  }

  gameLoop(currentTime: number): void {
    const activeScene = this.getCurrentScene();
    this.state.update(currentTime);
    this.renderer.clear();
    if (activeScene) {
      activeScene.update(this.state, this.inputManager);
      activeScene.render(this.state, this.renderer);
    }
    this.renderer.render();

    if (this.isRunning) {
      this.animationId = requestAnimationFrame(time => this.gameLoop(time));
    }
  }

  pause(): void {
    this.isRunning = false;
  }

  resume(): void {
    this.isRunning = true;
    this.animationId = requestAnimationFrame(time => this.gameLoop(time));
  }

  destroy(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.inputManager.destroy();
    this.renderer.destroy();
  }

  // scene management
  getScene(id: string): Scene | undefined {
    return config.scenes[id];
  }

  getCurrentScene(): Scene | null {
    if (this.activeSceneId === null) return null;
    return config.scenes[this.activeSceneId];
  }

  changeScene(sceneId: string, duration: number = 0): void {
    const scene = config.scenes[sceneId];
    if (!scene) {
      console.warn(`scene with id "${sceneId}" not found`);
      return;
    }

    const activeScene = this.getCurrentScene();
    // if (activeScene) {
    //   activeScene.onExit();
    // }

    this.activeSceneId = sceneId;
    this.transitionDuration = duration;
    this.transitionProgress = 0;
    this.isTransitioning = duration > 0;

    scene.init(this.state, this.inputManager);
  }
}
