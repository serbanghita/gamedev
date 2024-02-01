import Component from "./Component";
import {addBit, hasBit, removeBit} from "../../glhf-bitmask/src/bitmask";

export default class Entity {
    public componentsBitmask: bigint = 0n;
    // Cache of Component instances.
    public components: Map<string, Component> = new Map();

    constructor(public id: string) {}

    public addComponent<T extends typeof Component>(declaration: T, properties: {} = {})
    {
        let instance = this.components.get(declaration.name);
        // If the Component's instance is already in our cache, just re-use the instance and lazy init it.
        if (instance) {
            instance.init(properties);
        } else {
            instance = new declaration(properties);
        }

        this.components.set(instance.constructor.name, instance);

        if (typeof instance.bitmask === "undefined") {
            throw new Error(`Please register the component ${instance.constructor.name} in the ComponentRegistry.`);
        }

        this.componentsBitmask = addBit(this.componentsBitmask, instance.bitmask);
    }

    public getComponent<T extends typeof Component>(declaration: T): InstanceType<T>
    {
        const instance = this.components.get(declaration.name) as InstanceType<T>;

        if (!instance) {
            throw new Error(`Component requested ${declaration.name} is non-existent.`);
        }

        return instance;
    }

    public getComponentByName(name: string): Component {
        const instance = this.components.get(name);

        if (!instance) {
            throw new Error(`Component requested ${name} is non-existent.`);
        }

        return instance;
    }

    public removeComponent<T extends typeof Component>(declaration: T)
    {
        const component = this.getComponent(declaration);

        this.componentsBitmask = removeBit(this.componentsBitmask, component.bitmask);
    }

    public hasComponent(declaration: typeof Component): boolean {
        return hasBit(this.componentsBitmask, declaration.prototype.bitmask);
    }
}