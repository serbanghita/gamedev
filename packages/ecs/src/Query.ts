import Entity from "./Entity";

import {addBit, hasAnyOfBits, hasBit} from "@serbanghita-gamedev/bitmask";
import Component from "./Component";
import World from "./World";

export interface IQueryFilters {
    all?: typeof Component[];
    any?: typeof Component[];
    none?: typeof Component[];
}

export interface IQueryFiltersBitmask {
    all: bigint;
    any: bigint;
    none: bigint;
}

export default class Query {
    public all = 0n;
    public any = 0n;
    public none = 0n;
    private hasExecuted = false;
    public dataSet: Entity[] = [];


    /**
     * Create a "query" of Entities that contain certain Components set.
     *
     * @param world
     * @param id
     * @param filters
     */
    constructor(public world: World, public id: string, public filters: IQueryFilters) {
        this.processFiltersAsBitMasks();
    }

    private processFiltersAsBitMasks(): void {
        if (this.filters.all) {
            this.filters.all.forEach((component) => {
                this.all = addBit(this.all, component.prototype.bitmask);
            });
        }

        if (this.filters.any) {
            this.filters.any.forEach((component) => {
                this.any = addBit(this.any, component.prototype.bitmask);
            });
        }

        if (this.filters.none) {
            this.filters.none.forEach((component) => {
                this.none = addBit(this.none, component.prototype.bitmask);
            });
        }
    }

    public init()
    {
        this.world.entities.forEach(entity => {
            this.candidate(entity);
        });
    }

    /**
     * Set only the entities that correspond to the filters given.
     */
    public execute(): Entity[] {
        if (!this.hasExecuted) {
            this.dataSet = this.dataSet.filter((entity) => this.match(entity));
            this.hasExecuted = true;
        }

        return this.dataSet;
    }

    private match(entity: Entity): boolean {
        // Reject all entities that have a component(s) that is in the none filter.
        if (this.none !== 0n && hasAnyOfBits(entity.componentsBitmask, this.none)) {
            return false;
        }

        // Include any entity that has all the components in the "any" filter.
        if (this.any !== 0n && hasAnyOfBits(entity.componentsBitmask, this.any)) {
            return true;
        }

        // Check all bits.
        if (this.all !== 0n && !hasBit(entity.componentsBitmask, this.all)) {
            return false;
        }

        return true;
    }

    public candidate(entity: Entity) {
        if (this.match(entity)) {
            this.dataSet.push(entity);
            return true;
        }

        return false;
    }

    public add(entity: Entity)
    {
        this.dataSet.push(entity);
    }

    public remove(entity: Entity) {
        const index = this.dataSet.indexOf(entity);
        if (index !== -1) {
            this.dataSet.splice(index, 1);
        }
    }
}