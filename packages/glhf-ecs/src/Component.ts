interface Component {
    bitmask: bigint;
    prototype: {
        bitmask: bigint;
    }
}

class Component {
    constructor(public properties: {}) {}

    // Lazy init / Re-init.
    init(properties: {}) {
        this.properties = properties;
    }
}

export default Component;