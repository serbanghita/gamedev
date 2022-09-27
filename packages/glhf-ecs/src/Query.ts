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
    public all: bigint = 0n;
    public any: bigint = 0n;
    public none: bigint = 0n;

    public records: Entity[] = [];
    public result: Entity[] = [];

    constructor(public name: string = "", public filters: IQueryFilters) {
        this.processFilters();
    }

    public setRecords(records: Entity[]): void {
        this.records = records;
    }

    private processFilters(): void {
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

    /**
     * Set only the entities that correspond to the filters given.
     */
    public execute(): Entity[] {

        this.result = this.records.filter((entity) => {
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
        });

         return this.result;
    }
}