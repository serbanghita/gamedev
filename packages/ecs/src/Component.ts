// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Component {
    bitmask: bigint;
    prototype: {
        bitmask: bigint;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Component {
    constructor(public properties: NonNullable<object>) {}

    // Lazy init / Re-init.
    init(properties: NonNullable<object>) {
        this.properties = properties;
    }
}

export default Component;