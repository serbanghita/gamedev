// interface IKeyboardEvent {
//     eventName: string;
//     listener: (e: WindowEventMap) => any;
//     useCapture: boolean;
// }

export enum InputActions {
    MOVE_UP = 1,
    MOVE_DOWN,
    MOVE_LEFT,
    MOVE_RIGHT,
    ACTION_1,
    ACTION_2,
    ACTION_3,
    ACTION_4,
}

export default class Keyboard {
  public ongoingActions: Set<InputActions> = new Set([]);
  protected boundKeys: Map<string, InputActions> = new Map([]);

  private isListening = false;
  
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.isBoundKey(e.key)) {
      e.stopPropagation();
      const action = this.boundKeys.get(e.key) as InputActions;
      this.ongoingActions.add(action);
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    if (this.isBoundKey(e.key)) {
      e.stopPropagation();
      const action = this.boundKeys.get(e.key) as InputActions;
      this.ongoingActions.delete(action);
    }
  };

  public bindKey(keyCode: string, action: InputActions) {
    this.boundKeys.set(keyCode, action);
  }

  public unbindKey(keyCode: string) {
    this.boundKeys.delete(keyCode);
  }

  public areKeysPressed(): boolean {
    return this.ongoingActions.size > 0;
  }

  public areMovementKeysPressed(): boolean {
    return this.ongoingActions.has(InputActions.MOVE_UP) ||
      this.ongoingActions.has(InputActions.MOVE_DOWN) ||
      this.ongoingActions.has(InputActions.MOVE_LEFT) ||
      this.ongoingActions.has(InputActions.MOVE_RIGHT);
  }

  public isBoundKey(keyCode: string): boolean {
    return this.boundKeys.has(keyCode);
  }

  public listen() {
    if (this.isListening) return;
    this.isListening = true;
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public unlisten() {
    if (!this.isListening) return;
    this.isListening = false;
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}

