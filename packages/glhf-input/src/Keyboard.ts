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

    public isBoundKey(keyCode: string) {
        return this.boundKeys.has(keyCode);
    }

    public keyDownListener(e: { key: string; preventDefault: () => void; stopPropagation: () => void; }) {
        console.log("keyDownListener", e.key);
        e.preventDefault();
        e.stopPropagation();
        if (this.isBoundKey(e.key)) {
            const action = this.boundKeys.get(e.key) as InputActions;
            this.ongoingActions.add(action);
        }
    };

    public keyUpListener(e: { key: string; preventDefault: () => void; stopPropagation: () => void; }) {
        console.log("keyUpListener", e.key);
        e.preventDefault();
        e.stopPropagation();
        if (this.isBoundKey(e.key)) {
            const action = this.boundKeys.get(e.key) as InputActions;
            this.ongoingActions.delete(action);
        }
    };

    public listen() {
        window.addEventListener("keydown", this.keyDownListener.bind(this), { capture: false });
        window.addEventListener("keyup", this.keyDownListener.bind(this), { capture: false });
    }
}