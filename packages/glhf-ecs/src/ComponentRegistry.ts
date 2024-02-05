// create a singleton class
import Component from "./Component";

export default class ComponentRegistry {
  private bitmask: bigint = 1n;
  private static instance: ComponentRegistry;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  public registerComponent(ComponentDeclaration: typeof Component) {
    // @todo: Safety check if Base was already registered.
    ComponentDeclaration.prototype.bitmask = (this.bitmask <<= 1n);

    return ComponentDeclaration;
  }

  public getLastBitmask() {
    return this.bitmask;
  }
}