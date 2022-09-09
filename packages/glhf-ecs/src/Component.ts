export type ComponentConstructor = new (...args: any[]) => {};

export type ComponentConstructorWithPrototype = new (...args: any[]) => {
    bitmask: bigint;
    prototype: Component;
};

export interface IComponent {
    bitmask: bigint;
}

export default abstract class Component {
    // abstract bitmask: bigint;
    protected constructor(public properties?: {}) {}
}

