import Entity from "./Entity";
import World from "./World";

export type SystemConstructor = new (world: World, properties?: {}) => System;

interface ISystemProps {
    fps: number;
}

export default abstract class System {
    protected constructor(protected world: World, public properties: ISystemProps){
        this.world = world;
        this.properties = properties;
    }

    public abstract update(now: number, entities: Entity[]): void;
}