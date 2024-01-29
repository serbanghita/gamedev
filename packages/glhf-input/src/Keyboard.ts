interface IKeyboardEvent {
    eventName: string;
    listener: (e: WindowEventMap) => any;
    useCapture: boolean;
}

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

    public bindKey(keyCode: string, action: InputActions) {
        this.boundKeys.set(keyCode, action);
    }

    public unbindKey(keyCode: string) {
        this.boundKeys.delete(keyCode);
    }

    public areKeysPressed()
    {
        return this.ongoingActions.size > 0;
    }

    public isBoundKey(keyCode: string) {
        return this.boundKeys.has(keyCode);
    }

    public keyDownCallback(e: { key: string; preventDefault: () => void; stopPropagation: () => void; }) {
        // console.log("keyDownCallback", e.key);
        e.preventDefault();
        e.stopPropagation();
        if (this.isBoundKey(e.key)) {
            const action = this.boundKeys.get(e.key) as InputActions;
            this.ongoingActions.add(action);
        }
    };

    public keyUpCallback(e: { key: string; preventDefault: () => void; stopPropagation: () => void; }) {
        console.log("keyUpCallback", e.key);
        e.preventDefault();
        e.stopPropagation();
        if (this.isBoundKey(e.key)) {
            const action = this.boundKeys.get(e.key) as InputActions;
            this.ongoingActions.delete(action);
        }
    };

    public listen() {
        window.addEventListener("keydown", this.keyDownCallback.bind(this), { capture: false });
        window.addEventListener("keyup", this.keyUpCallback.bind(this), { capture: false });
    }
}