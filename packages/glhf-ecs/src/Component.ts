interface Component {
    bitmask: bigint;
    prototype: {
        bitmask: bigint;
    }
}

class Component {
    constructor(public properties: {}) {}
}

export default Component;