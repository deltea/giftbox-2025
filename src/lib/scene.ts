import { config } from "./config";
import type { Entity } from "./entity";
import type { InputManager } from "./input-manager";
import type { Renderer } from "./renderer";
import type { SceneManager } from "./scene-manager";
import type { State } from "./state";

export abstract class Scene {
  entities: Entity[] = [];
  abstract load(): Promise<void>;
  init(): void {};

  update(state: State, input: InputManager, scenes: SceneManager): void {
    for (const entity of this.entities) {
      entity.update(state);
    }
  };

  draw(state: State, renderer: Renderer): void {
    // draw background
    renderer.drawRect(0, 0, renderer.width, renderer.height, config.bgChar, config.colors.bg);

    const sortedEntities = this.entities.slice().sort((a, b) => a.layer - b.layer);
    for (const entity of sortedEntities) {
      entity.draw(renderer);
    }
  };

  addEntity<T extends Entity>(entity: T): T {
    this.entities.push(entity);
    console.log(this.entities.slice());
    return entity;
  }
}
