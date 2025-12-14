import { config } from "$lib/config";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { loadArt } from "$lib/utils";

export class StartScene extends Scene {
  isLeftPressed: boolean = false;
  isRightPressed: boolean = false;

  duckArt: string[][] = [];

  async load(): Promise<void> {
    this.duckArt = await loadArt("/src/lib/assets/duck-small.txt");
  }

  init(): void {
    console.log("scene initialized");
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    this.isLeftPressed = input.isKeyPressed("ArrowLeft");
    this.isRightPressed = input.isKeyPressed("ArrowRight");

    if (this.isLeftPressed && this.isRightPressed) {
      scenes.changeScene("home");
    }
  }

  draw(state: State, renderer: Renderer): void {
    const time = state.gameTime * 0.002;
    const chars = " .:-=+*#%@";

    for (let y = 0; y < renderer.height; y++) {
      const sinY = Math.sin(y * 0.3 + time);

      for (let x = 0; x < renderer.width; x++) {
        const sinX = Math.sin(x * 0.3 + time);
        const sinXY = Math.sin((x + y) * 0.2 + time);

        const value = sinX + sinY + sinXY;
        const normalized = (value + 3) / 6;
        const charIndex = Math.floor(normalized * 9);

        renderer.setCell(x, y, chars.charAt(charIndex), `hsl(135, 9%, ${normalized * 95 + 5}%)`);
      }
    }

    const centerX = renderer.width / 2;
    const centerY = renderer.height / 2;

    renderer.drawRoundedRect(centerX - 30, centerY - 12, 60, 24, 1, ".", config.colors.bg);

    renderer.drawText(centerX, centerY - 7, "THE GACHA MACHINE", config.colors.fg);
    renderer.drawText(centerX, centerY - 4, "a small game made for hack club giftbox", config.colors.accent);
    renderer.drawText(centerX, centerY - 3, "(for maddie!)", config.colors.accent);

    renderer.drawArt(
      centerX - 4,
      centerY,
      8,
      4,
      this.duckArt,
      config.colors.fg
    );

    renderer.drawText(centerX, centerY + 6, "press   and   to start", config.colors.accent);
    renderer.drawText(centerX - 5, centerY + 6, "⬅", this.isLeftPressed ? config.colors.fg : config.colors.accent, false);
    renderer.drawText(centerX + 1, centerY + 6, "⮕", this.isRightPressed ? config.colors.fg : config.colors.accent, false);
  }
}
