import Entity from "./Entity";
import Component, {IComponent} from "./Component";
import {addBit, hasBit} from "@glhf/bitmask/bitmask";

export interface IQueryFilters {
    all: IComponent[];
    any: IComponent[];
    none: IComponent[];
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
    public filteredEntities: Entity[] = [];

    constructor(public allEntities: Entity[], public filters: IQueryFilters) {
        this.setFiltersAsBitmasks();
        this.setFilteredEntities();
    }

    public setFiltersAsBitmasks(): void {
        this.filters.all.forEach((component) => {
            this.filtersAsBitmasks.all = addBit(this.filtersAsBitmasks.all, component.bitmask);
        });
        this.filters.any.forEach((component) => {
            this.filtersAsBitmasks.any = addBit(this.filtersAsBitmasks.any, component.bitmask);
        });
        this.filters.none.forEach((component) => {
            this.filtersAsBitmasks.none = addBit(this.filtersAsBitmasks.none, component.bitmask);
        });
    }

    public setFilteredEntities(): Entity[] {

        this.filteredEntities = this.allEntities.filter((entity) => {
            // Reject all entities that have a component(s) that is in the none filter.
            if (this.filtersAsBitmasks.none !== 0n && hasBit(entity.componentsBitmask, this.filtersAsBitmasks.none)) {
                return false;
            }
            // Include any entity that has all the components in the "any" filter.
            if (this.filtersAsBitmasks.any !== 0n) {
                hasBit(entity.componentsBitmask, this.filtersAsBitmasks.any)
                return true;
            }

            return hasBit(entity.componentsBitmask, this.filtersAsBitmasks.all);
        });

         return this.filteredEntities;
    }
}