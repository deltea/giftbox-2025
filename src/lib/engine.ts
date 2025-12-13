import { EventManager } from "./eventManager";
import { Grid } from "./grid";
import { Renderer } from "./renderer";
import { State } from "./state";
import type { EngineConfig } from "./types";

export class Engine {
  private config: EngineConfig;
  private eventManager: EventManager;
  private grid: Grid;
  private renderer: Renderer;
  private gameState: State;
  private animationId: number = 0;
  private isRunning: boolean = false;

  constructor(config: EngineConfig) {
    this.config = config;
    this.eventManager = new EventManager();
    this.grid = new Grid(config.gridWidth, config.gridHeight);
    this.renderer = new Renderer(config);
    this.gameState = new State();
  }

  async init(): Promise<void> {
    this.renderer.init();
    this.setupInput();
    this.isRunning = true;
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  private setupInput(): void {
    this.eventManager.onKeyDown("ArrowLeft", () => {
      // this.gameState.moveLeft();
    });
    this.eventManager.onKeyDown("ArrowRight", () => {
      // this.gameState.moveRight();
    });
  }

  private gameLoop(currentTime: number): void {
    this.update(currentTime);
    this.render(currentTime);

    if (this.isRunning) {
      this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
  }

  private update(currentTime: number): void {
    this.gameState.update(currentTime);
    this.grid.clear();
    this.updateBackground(currentTime);
    this.updateUI(currentTime);
  }

  private updateBackground(currentTime: number): void {
    const time = currentTime * 0.002;
    const chars = " .:-=+*#%@";

    for (let y = 0; y < this.grid.height; y++) {
      const sinY = Math.sin(y * 0.3 + time);

      for (let x = 0; x < this.grid.width; x++) {
        const sinX = Math.sin(x * 0.3 + time);
        const sinXY = Math.sin((x + y) * 0.2 + time);

        const value = sinX + sinY + sinXY;
        const normalized = (value + 3) / 6;
        const charIndex = Math.floor(normalized * 9);

        this.grid.cells[y][x] = {
          char: chars.charAt(charIndex),
          color: `hsl(135, 9%, ${normalized * 95 + 5}%)`
        };
      }
    }
  }

  private updateUI(currentTime: number): void {
    const centerX = Math.floor(this.grid.width / 2);
    const centerY = Math.floor(this.grid.height / 2);

    this.grid.drawRoundedRect(
      this.grid.width / 3,
      this.grid.height / 3,
      this.grid.width / 3,
      this.grid.height / 3,
      4
    );

    this.grid.drawText(
      centerX,
      centerY - 6,
      "THE GIFT MACHINE (for maddie!)",
      this.config.colors.fg
    );
    this.grid.drawText(
      centerX,
      centerY - 4,
      "a small toy made for hack club giftbox",
      this.config.colors.fg
    );
    this.grid.drawText(
      centerX,
      centerY + 4,
      "press   and   to start",
      this.config.colors.accent
    );

    const arrowColor = (isPressed: boolean) =>
      isPressed ? this.config.colors.fg : this.config.colors.accent;

    this.grid.drawText(
      centerX - 5,
      centerY + 4,
      "⬅",
      arrowColor(this.eventManager.isKeyPressed("ArrowLeft")),
      false
    );
    this.grid.drawText(
      centerX + 1,
      centerY + 4,
      "⮕",
      arrowColor(this.eventManager.isKeyPressed("ArrowRight")),
      false
    );
  }

  private render(currentTime: number): void {
    this.renderer.render(this.grid);
  }

  getEventManager(): EventManager {
    return this.eventManager;
  }

  getGrid(): Grid {
    return this.grid;
  }

  getState(): State {
    return this.gameState;
  }

  pause(): void {
    this.isRunning = false;
  }

  resume(): void {
    this.isRunning = true;
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  destroy(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.eventManager.destroy();
    this.renderer.destroy();
  }
}
