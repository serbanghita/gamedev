import Entity from "./Entity";

import {addBit, hasAnyOfBits, hasBit} from "@glhf/bitmask/bitmask";
import Component from "./Component";

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
    public filtersAsBitmasks: IQueryFiltersBitmask = {
        all: 0n,
        any: 0n,
        none: 0n
    };
    public result: Entity[] = [];

    constructor(public allEntities: Entity[], public filters: IQueryFilters) {
        this.setFiltersAsBitmasks();
        this.setResult();
    }

    public setFiltersAsBitmasks(): void {
        if (this.filters.all) {
            this.filters.all.forEach((component) => {
                this.filtersAsBitmasks.all = addBit(this.filtersAsBitmasks.all, component.prototype.bitmask);
            });
        }

        if (this.filters.any) {
            this.filters.any.forEach((component) => {
                this.filtersAsBitmasks.any = addBit(this.filtersAsBitmasks.any, component.prototype.bitmask);
            });
        }

        if (this.filters.none) {
            this.filters.none.forEach((component) => {
                this.filtersAsBitmasks.none = addBit(this.filtersAsBitmasks.none, component.prototype.bitmask);
            });
        }
    }

    /**
     * Set only the entities that correspond to the filters given.
     */
    public setResult(): Entity[] {

        this.result = this.allEntities.filter((entity) => {
            // Reject all entities that have a component(s) that is in the none filter.
            if (this.filtersAsBitmasks.none !== 0n && hasBit(entity.componentsBitmask, this.filtersAsBitmasks.none)) {
                return false;
            }
            // Include any entity that has all the components in the "any" filter.
            if (this.filtersAsBitmasks.any !== 0n && hasAnyOfBits(entity.componentsBitmask, this.filtersAsBitmasks.any)) {
                return true;
            }

            // Check all bits.
            return hasBit(entity.componentsBitmask, this.filtersAsBitmasks.all);
        });

         return this.result;
    }
}