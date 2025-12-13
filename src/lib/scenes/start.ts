import { config } from "$lib/config";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";

export class StartScene extends Scene {
  isLeftPressed: boolean = false;
  isRightPressed: boolean = false;

  init(state: State, input: InputManager): void {
    console.log("scene initialized");
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    this.isLeftPressed = input.isKeyPressed("ArrowLeft");
    this.isRightPressed = input.isKeyPressed("ArrowRight");

    if (this.isLeftPressed && this.isRightPressed) {
      scenes.changeScene("game");
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

    // Draw box
    renderer.drawRoundedRect(centerX - 30, centerY - 12, 60, 24, 1);

    // Draw text
    renderer.drawText(centerX, centerY - 6, "THE GIFT MACHINE (for maddie!)", config.colors.fg);
    renderer.drawText(centerX, centerY - 4, "a small toy made for hack club giftbox", config.colors.accent);
    renderer.drawText(centerX, centerY + 4, "press   and   to start", config.colors.accent);

    renderer.drawText(centerX - 5, centerY + 4, "⬅", this.isLeftPressed ? config.colors.fg : config.colors.accent, false);
    renderer.drawText(centerX + 1, centerY + 4, "⮕", this.isRightPressed ? config.colors.fg : config.colors.accent, false);
  }
}
