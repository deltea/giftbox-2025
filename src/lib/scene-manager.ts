import { config } from "./config";
import type { Scene } from "./types";

export class SceneManager {
  activeSceneId: string | null = null;
  transitionDuration: number = 0;
  transitionProgress: number = 0;
  isTransitioning: boolean = false;

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

    this.activeSceneId = sceneId;
    this.transitionDuration = duration;
    this.transitionProgress = 0;
    this.isTransitioning = duration > 0;

    // scene.init(this.state, this.inputManager);
  }
}
