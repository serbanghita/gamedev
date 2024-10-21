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
    public dataSet: Map<string, Entity> = new Map();


    /**
     * Create a "query" of Entities that contain certain Components set.
     *
     * @param world
     * @param id
     * @param filters
     */
    constructor(public world: World, public id: string, public filters: IQueryFilters) {
        this.checkIfComponentsAreRegistered();
        this.processFiltersAsBitMasks();
    }

    private checkIfComponentsAreRegistered() {
      // Get a list of unique "Components" that are being used in the filters.
      [...new Set<typeof Component>(Object.values(this.filters).reduce((acc, value) => {
        return acc.concat(value);
      }, []))].forEach((component) => {
        if (typeof component.prototype.bitmask === "undefined") {
          throw new Error(`Please register the component ${component.name} in the ComponentRegistry.`);
        }
      });
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
    public execute(): Map<string, Entity> {
        if (!this.hasExecuted) {
            this.dataSet = new Map([...this.dataSet].filter(([id, entity]) => this.match(entity)));
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
        if (this.any !== 0n) {
            return hasAnyOfBits(entity.componentsBitmask, this.any);
        }

        // Check all bits.
        if (this.all !== 0n) {
            return hasBit(entity.componentsBitmask, this.all);
        }

        return true;
    }

    public candidate(entity: Entity) {
        if (this.match(entity)) {
            this.dataSet.set(entity.id, entity);
            return true;
        }

        return false;
    }

    public add(entity: Entity)
    {
        this.dataSet.set(entity.id, entity);
    }

    public remove(entity: Entity) {
        this.dataSet.delete(entity.id);
    }
}
