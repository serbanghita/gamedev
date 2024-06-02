import World from "./World";
import Query from "./Query";

// export type SystemConstructor = new (world: World, properties?: {}) => System;

export default class System {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public constructor(public world: World, public query: Query, ...args: never[]) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(now: number): void
    {
        throw new Error(`System update() must be implemented.`)
    }
}