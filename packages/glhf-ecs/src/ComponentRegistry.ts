// create a singleton class
import {ComponentConstructor, ComponentConstructorWithPrototype, IComponent} from "./Component";

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

  registerComponent<TBase extends ComponentConstructor>(Base: TBase) {
    // @todo: Safety check if Base was already registered.
    
    class NewComponent extends Base {
      constructor(...args: any[]) {
        super(...args);
      }
    }

    NewComponent.prototype.bitmask = ++this.bitmask;

    return NewComponent as unknown as ComponentConstructorWithPrototype & TBase;
  }

  getLastBitmask() {
    return this.bitmask;
  }
}