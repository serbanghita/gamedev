import Component from "./Component";
import { addBit, hasBit, removeBit } from "@serbanghita-gamedev/bitmask";
import World from "./World";

type PropsInitFor<T extends typeof Component> =
  T extends new (props: infer P) => any
    ? P
    : never;

export default class Entity {
  // Bitmask for storing Entity's components.
  public componentsBitmask = 0n;
  // Cache of Component instances.
  public components = new Map<string, Component>();

  constructor(
    public world: World,
    public id: string,
  ) {}

  public addComponent<T extends typeof Component>(declaration: T, properties: PropsInitFor<T> = {} as PropsInitFor<T>): Entity {
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

    this.onAddComponent(instance);

    return this;
  }

  public getComponent<T extends typeof Component>(declaration: T): InstanceType<T> {
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

  public removeComponent<T extends typeof Component>(declaration: T): Entity {
    const component = this.getComponent(declaration);

    this.componentsBitmask = removeBit(this.componentsBitmask, component.bitmask);

    this.onRemoveComponent(component);

    return this;
  }

  public hasComponent(declaration: typeof Component): boolean {
    if (typeof declaration.prototype.bitmask === "undefined") {
      throw new Error(`Please register the component ${declaration.name} in the ComponentRegistry.`);
    }
    return hasBit(this.componentsBitmask, declaration.prototype.bitmask);
  }

  private onAddComponent(newComponent: Component) {
    this.world.notifyQueriesOfEntityComponentAddition(this, newComponent);
    return this;
  }

  private onRemoveComponent(oldComponent: Component) {
    this.world.notifyQueriesOfEntityComponentRemoval(this, oldComponent);
  }
}
