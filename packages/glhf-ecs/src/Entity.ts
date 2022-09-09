import Component, {ComponentConstructor, ComponentConstructorWithPrototype, IComponent} from "./Component";
import {addBit, hasBit} from "@glhf/bitmask/bitmask";

export default class Entity {
    public componentsBitmask: bigint = 0n;
    public components: {[key: string]: IComponent} = {};

    public addComponent(declaration: ComponentConstructorWithPrototype, properties?: {}) {
        const instance = new declaration(properties);
        this.components[instance.constructor.name] = instance;
        if (typeof instance.bitmask === "undefined") {
            throw new Error(`Please register the component ${instance.constructor.name} in the ComponentRegistry.`);
        }
        this.componentsBitmask = addBit(this.componentsBitmask, instance.bitmask);
    }

    public getComponent(declaration: ComponentConstructor): Component {
        return this.components[declaration.name] as Component;
    }

    public hasComponent(declaration: ComponentConstructorWithPrototype): boolean {
        // return !!this.components[componentDeclaration.name];
        return hasBit(this.componentsBitmask, declaration.prototype.bitmask);
    }
}