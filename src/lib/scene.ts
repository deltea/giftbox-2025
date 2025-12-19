import { config } from "./config";
import type { Entity } from "./entity";
import type { InputManager } from "./input-manager";
import type { Renderer } from "./renderer";
import type { SceneManager } from "./scene-manager";
import type { State } from "./state";

export abstract class Scene {
  entities: Entity[] = [];
  abstract load(): Promise<void>;

  init(scenes: SceneManager, state: State): void {};

  update(state: State, input: InputManager, scenes: SceneManager): void {
    for (const entity of this.entities) {
      entity.update(state, input);
    }
  };

  draw(state: State, renderer: Renderer, bgChar: string = config.bgChar, bgColor: string = config.colors.bg): void {
    // draw background
    renderer.drawRect(0, 0, renderer.width, renderer.height, bgChar, bgColor);

    const sortedEntities = this.entities.slice().sort((a, b) => a.layer - b.layer);
    for (const entity of sortedEntities) {
      entity.draw(renderer);
    }
  };

  destroy(): void {
    this.entities = [];
  }

  addEntity<T extends Entity>(entity: T): T {
    this.entities.push(entity);
    console.log(this.entities.slice());
    return entity;
  }
}
