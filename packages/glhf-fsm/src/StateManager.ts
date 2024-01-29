export enum StateStatus {
    NOT_STARTED = 0,
    STARTED = 1,
    RUNNING = 2,
    PERFORMING_ACTION = 3,
    FINISHED = 4
}

export interface IStateInstance {
    status: StateStatus;

    enter(...args: any[]): boolean;
    exit(): void;
    update(): boolean;
}

interface IStateInQueue {
    id: string;
    args: any[];
}

export interface IState {
    id: string;
    priority: number;
    instance: IStateInstance;
}

export default class StateManager {

    private defaultStateId: string = "";
    private states: Map<string, IState> = new Map();
    public currentState: IState | null = null;
    private queue: IStateInQueue[] = [];

    public registerState(id: string, priority: number, instance: IStateInstance) {
        this.states.set(id, { id, priority, instance });
    }

    public getCurrentStateName(): string {
        if (!this.currentState) {
            throw new Error('There is no current state being set.');
        }
        return this.currentState.id;
    }

    public getCurrentStateInstance(): IStateInstance {
        if (!this.currentState) {
            throw new Error('There is no current state being set.');
        }
        return this.currentState.instance;
    }

    public setDefaultStateId(stateId: string) {
        this.defaultStateId = stateId;
    }

    public getDefaultState(): IState
    {
        const state = this.states.get(this.defaultStateId);
        if (!state) {
            throw new Error('No "default" state has been set.');
        }

        return state;
    }

    public unregisterState(stateName: string) {
        this.states.delete(stateName);
    }

    public queueState(id: string, ...args: any[]): StateManager {
        this.queue.push({id, args});
        return this;
    }

    public deleteQueue() {
        this.queue = [];
    }

    public hasQueue(): boolean {
        return this.queue.length > 0;
    }

    public triggerState(id: string, ...args: any[]): boolean {
        // If state doesn't exist, just don't execute anything.
        // This means the actual current state will persist until it's replaced with a valid one.
        const newState = this.states.get(id);
        if (!newState) {
            return false;
        }

        // If there's no currentState set, that means we can start executing the new requested state.
        if (this.currentState === null) {
            this.currentState = newState;
            this.currentState.instance.enter.apply(this.currentState.instance, args);
            return true;
        }

        // Exit current state if it's "Finished" or the new state has higher priority.
        if (this.currentState.instance.status === StateStatus.FINISHED ||
            (
                newState.priority <= this.currentState.priority &&
                newState.id !== this.currentState.id
            )
        ) {
            this.currentState.instance.exit(); // @todo: Should we just "exit" and then wait for the next tick?
            this.currentState = newState;
            this.currentState.instance.enter.apply(this.currentState.instance, args);
            return true;
        } else {
            return false;
        }
    }

    public update(): void {

        // console.log(this.entity.className, this.currentState);
        if (this.currentState !== null && this.currentState.instance.status !== StateStatus.FINISHED) {
            this.currentState.instance.update();
        } else {
            // Can be overridden ...
            if (this.hasQueue()) {
                // First item or the next one in the queue.
                if (this.currentState?.instance.status === StateStatus.FINISHED) {
                    const queuedItem = this.queue.splice(0, 1)[0];
                    this.triggerState(queuedItem.id, ...queuedItem.args);
                    return;
                }
            }

            this.currentState = this.getDefaultState();
            this.currentState.instance.enter();
        }
    }

}
