// create a singleton class
import Component from "./Component";

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

  public registerComponent(declaration: typeof Component) {
    declaration.prototype.bitmask = ++this.bitmask;
  }

  getLastBitmask() {
    return this.bitmask;
  }
}