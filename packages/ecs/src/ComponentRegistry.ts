// create a singleton class
import Component from "./Component";

export default class ComponentRegistry {
  private bitmask: bigint = 1n;
  private static instance: ComponentRegistry;
  private components: Map<string, typeof Component> = new Map();

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

    this.components.set(ComponentDeclaration.prototype.constructor.name, ComponentDeclaration);

    return ComponentDeclaration;
  }
  public registerComponents(declarations: Array<typeof Component>)
  {
    declarations.forEach((declaration) => {
      this.registerComponent(declaration);
    });
  }

  public getComponent(name: string): typeof Component
  {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component requested ${name} is non-existent.`);
    }

    return component;
  }

  public getLastBitmask() {
    return this.bitmask;
  }
}