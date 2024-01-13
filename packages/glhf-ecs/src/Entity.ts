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

    public getComponent(declaration: typeof Component): Component {
        return this.components[declaration.name] as Component;
    }

    public hasComponent(declaration: Component): boolean {
        // return !!this.components[componentDeclaration.name];
        return hasBit(this.componentsBitmask, declaration.bitmask);
    }
}