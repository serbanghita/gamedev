import World from "./World";
import Query from "./Query";

// export type SystemConstructor = new (world: World, properties?: {}) => System;

export default class System {
    public constructor(public world: World, public query: Query, ...args: any[]) {
    }

    public update(now: number): void
    {
        throw new Error(`System update() must be implemented.`)
    }
}