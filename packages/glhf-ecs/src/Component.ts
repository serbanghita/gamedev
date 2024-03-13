interface Component {
    bitmask: bigint;
    prototype: {
        bitmask: bigint;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Component {
    constructor(public properties: NonNullable<unknown>) {}

    // Lazy init / Re-init.
    init(properties: NonNullable<unknown>) {
        this.properties = properties;
    }
}

export default Component;