import Component, {ComponentConstructor} from "./Component";
import {addBit, hasBit} from "@glhf/bitmask/bitmask";

export default class Entity {
    public componentsBitmask: bigint = 0n;
    public components: {[key: string]: Component} = {};

    public addComponent(declaration: ComponentConstructor, properties?: {}) {
        const instance = new declaration(properties);
        this.components[instance.constructor.name] = instance;
        if (typeof instance.bitmask === "undefined") {
            throw new Error(`Please register the component ${instance.constructor.name} in the ComponentRegistry.`);
        }
        this.componentsBitmask = addBit(this.componentsBitmask, instance.bitmask);
    }

    public getComponent<Component>(declaration: ComponentConstructor): Component {
        return this.components[declaration.name] as unknown as Component;
    }

    public hasComponent(declaration: ComponentConstructor): boolean {
        // return !!this.components[componentDeclaration.name];
        return hasBit(this.componentsBitmask, declaration.bitmask);
    }
}