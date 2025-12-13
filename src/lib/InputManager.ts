export class InputManager {
  private keysPressed: Map<string, boolean> = new Map();
  private keyDownCallbacks: Map<string, Set<() => void>> = new Map();
  private keyUpCallbacks: Map<string, Set<() => void>> = new Map();
  private holdCallbacks: Map<string, Set<() => void>> = new Map();

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    const isNewPress = !this.keysPressed.get(key);

    this.keysPressed.set(key, true);

    // Fire keydown callbacks only on initial press
    if (isNewPress) {
      this.executeCallbacks(this.keyDownCallbacks.get(key));
    }

    // Fire hold callbacks while key is pressed
    this.executeCallbacks(this.holdCallbacks.get(key));
  }

  private handleKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    this.keysPressed.set(key, false);

    // Fire keyup callbacks
    this.executeCallbacks(this.keyUpCallbacks.get(key));
  }

  private executeCallbacks(callbacks?: Set<() => void>) {
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.get(key.toLowerCase()) ?? false;
  }

  onKeyDown(key: string, callback: () => void) {
    const keyLower = key.toLowerCase();
    if (!this.keyDownCallbacks.has(keyLower)) {
      this.keyDownCallbacks.set(keyLower, new Set());
    }
    this.keyDownCallbacks.get(keyLower)!.add(callback);
  }

  onKeyUp(key: string, callback: () => void) {
    const keyLower = key.toLowerCase();
    if (!this.keyUpCallbacks.has(keyLower)) {
      this.keyUpCallbacks.set(keyLower, new Set());
    }
    this.keyUpCallbacks.get(keyLower)!.add(callback);
  }

  onKeyHold(key: string, callback: () => void) {
    const keyLower = key.toLowerCase();
    if (!this.holdCallbacks.has(keyLower)) {
      this.holdCallbacks.set(keyLower, new Set());
    }
    this.holdCallbacks.get(keyLower)!.add(callback);
  }

  removeKeyDownCallback(key: string, callback: () => void) {
    const keyLower = key.toLowerCase();
    this.keyDownCallbacks.get(keyLower)?.delete(callback);
  }

  removeKeyUpCallback(key: string, callback: () => void) {
    const keyLower = key.toLowerCase();
    this.keyUpCallbacks.get(keyLower)?.delete(callback);
  }

  removeKeyHoldCallback(key: string, callback: () => void) {
    const keyLower = key.toLowerCase();
    this.holdCallbacks.get(keyLower)?.delete(callback);
  }

  getPressedKeys(): string[] {
    return Array.from(this.keysPressed.entries())
      .filter(([_, pressed]) => pressed)
      .map(([key, _]) => key);
  }

  destroy() {
    window.removeEventListener("keydown", (e) => this.handleKeyDown(e));
    window.removeEventListener("keyup", (e) => this.handleKeyUp(e));
    this.keysPressed.clear();
    this.keyDownCallbacks.clear();
    this.keyUpCallbacks.clear();
    this.holdCallbacks.clear();
  }
}
