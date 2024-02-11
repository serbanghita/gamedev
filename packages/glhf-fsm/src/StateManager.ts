import State, {StateStatus} from "./State";

type StateInQueue = {
    id: string;
    args: any[];
}

export default class StateManager {

    private defaultState: State | undefined;
    public currentState: State | undefined;
    private states: Map<string, State> = new Map();

    private queue: Map<string, StateInQueue> = new Map();

    public registerState(state: State) {
        this.states.set(state.id, state);
        if (state.isDefault) {
            this.defaultState = state;
        }
    }

    public getState(id: string): State
    {
        const state = this.states.get(id);
        if (!state) {
            throw new Error(`Requested state ${id} is not registered.`);
        }

        return state;
    }

    public getDefaultState(): State
    {
        if (!this.defaultState) {
            throw new Error('No "default" state has been set.');
        }

        return this.defaultState;
    }

    public getCurrentState(): State {
        if (!this.currentState) {
            throw new Error('No "current" state has been set yet.');
        }
        return this.currentState;
    }

    public unregisterStateWithName(stateName: string) {
        this.states.delete(stateName);
    }

    public queueState(id: string, ...args: any[]): StateManager {
        this.queue.set(id, {id, args});
        return this;
    }

    public emptyQueue() {
        this.queue.clear();
    }

    public hasQueue(): boolean {
        return this.queue.size > 0;
    }

    public triggerState(id: string, ...args: any[]): boolean {
        // If state doesn't exist, just don't execute anything.
        // This means the actual current state will persist until it's replaced with a valid one.
        const newState = this.states.get(id);
        if (!newState) {
            return false;
        }

        // If there's no currentState set, that means we can start executing the new requested state.
        if (!this.currentState) {
            this.currentState = newState;
            this.currentState.enter.apply(this.currentState, args);
            return true;
        }

        // Exit current state if it's "Finished" or the new state has higher priority.
        if (this.currentState.status === StateStatus.FINISHED ||
            (
                newState.priority <= this.currentState.priority &&
                newState.id !== this.currentState.id
            )
        ) {
            this.currentState.exit(); // @todo: Should we just "exit" and then wait for the next tick?
            this.currentState = newState;
            this.currentState.enter.apply(this.currentState, args);
            return true;
        } else {
            return false;
        }
    }

    public update(): void {

        // console.log(this.entity.className, this.currentState);
        if (this.currentState && this.currentState.status !== StateStatus.FINISHED) {
            this.currentState.update();
        } else {
            // Can be overridden ...
            if (this.hasQueue()) {
                // First item or the next one in the queue.
                if (this.currentState?.status === StateStatus.FINISHED) {
                    const [queuedStateId, queuedStateValue] = this.queue.entries().next().value;
                    this.queue.delete(queuedStateId);
                    const wasSuccessful = this.triggerState(queuedStateId, ...queuedStateValue.args);
                    if (wasSuccessful) {
                        return;
                    }
                }
            }

            this.currentState = this.getDefaultState();
            this.currentState.enter();
        }
    }

}
