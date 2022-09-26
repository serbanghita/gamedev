// create a singleton class
import Component from "Component";

export default class ComponentRegistry {
  private bitmask: bigint = 0n;
  private static instance: ComponentRegistry;
  private constructor() {}

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  registerComponent(ComponentDeclaration: typeof Component) {
    // @todo: Safety check if Base was already registered.
    ComponentDeclaration.prototype.bitmask = ++this.bitmask;

    return ComponentDeclaration;
  }

  getLastBitmask() {
    return this.bitmask;
  }
}