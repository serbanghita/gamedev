import World from "./World";
import Query from "./Query";

// export type SystemConstructor = new (world: World, properties?: {}) => System;

export type SystemSettings = {
    // How many times to run the system before de-registering itself from the loop.
    runTimes: number;
}

export default class System {
    public settings: SystemSettings = { runTimes: -1 };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public constructor(public world: World, public query: Query, ...args: unknown[]) {
    }

    public runOnlyOnce() {
        this.settings.runTimes = 1;
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(now: number = 0): void
    {
        throw new Error(`System update() must be implemented.`)
    }
}