import { config } from "./config";
import type { State } from "./state";
import type { Scene } from "./types";

export class SceneManager {
  activeSceneId: string | null = null;
  isTransitioning: boolean = false;

  getScene(id: string): Scene | undefined {
    return config.scenes[id];
  }

  getCurrentScene(): Scene | null {
    if (this.activeSceneId === null) return null;
    return config.scenes[this.activeSceneId];
  }

  async changeScene(sceneId: string, state: State): Promise<void> {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const scene = config.scenes[sceneId];
    if (!scene) {
      console.warn(`scene with id "${sceneId}" not found`);
      return;
    }

    await scene.load();

    this.getCurrentScene()?.destroy();

    this.activeSceneId = sceneId;

    scene.init(this, state);

    this.isTransitioning = false;
  }
}
