import Entity from "./Entity";
import World from "./World";
import Query from "./Query";

export type SystemConstructor = new (world: World, properties?: {}) => System;

interface ISystemProps {
    fps: number;
}

export default abstract class System {
    public abstract query: Query;

    public abstract update(now: number): void;
}