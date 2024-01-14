import Component from "./Component";
import {addBit, hasBit} from "../../glhf-bitmask/src/bitmask";

export default class Entity {
    public componentsBitmask: bigint = 0n;
    public components: {[key: string]: Component} = {};

    constructor(public id: string) {}

    public addComponent<T extends Component>(instance: T) {

        this.components[instance.constructor.name] = instance;
        if (typeof instance.bitmask === "undefined") {
            throw new Error(`Please register the component ${instance.constructor.name} in the ComponentRegistry.`);
        }
        this.componentsBitmask = addBit(this.componentsBitmask, instance.bitmask);
    }

    public getComponent<T extends typeof Component>(declaration: T): InstanceType<T> {
        const instance = this.components[declaration.name] as InstanceType<T>;
        if (!instance) {
            throw new Error(`Component requested ${declaration.name} is non-existent.`);
        }

        return instance;
    }

    public hasComponent(declaration: typeof Component): boolean {
        // return !!this.components[componentDeclaration.name];
        return hasBit(this.componentsBitmask, declaration.prototype.bitmask);
    }
}