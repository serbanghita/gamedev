export interface ComponentConstructor {
    bitmask: bigint;
    new (properties?: {}): Component;
    prototype: Component;
}

export default abstract class Component {
    public bitmask: bigint | undefined;

    protected constructor(public properties?: {}) {
    }

    // public abstract notify(eventName: string, properties: {});
}