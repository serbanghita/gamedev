import ComponentRegistry from "./ComponentRegistry";
import Component from "./Component";

interface IBodyProps {
    width: number;
    height: number;
}

class Body extends Component {
    constructor(public properties: IBodyProps) {
        super(properties);
    }
}
class Position extends Component {
    constructor({}) {
        super({});
    }
}
class Map extends Component {
    constructor({}) {
        super({});
    }
}

test('constructor', () => {
    const reg = ComponentRegistry.getInstance();
    expect(reg).toBeInstanceOf(ComponentRegistry);
});

test('registerComponent', () => {
    const reg = ComponentRegistry.getInstance();
    expect(reg).toBeInstanceOf(ComponentRegistry);

    reg.registerComponent(Body);
    reg.registerComponent(Position);
    reg.registerComponent(Map);

    expect(reg.getLastBitmask()).toBe(3n);

    const body1 = new Body({width: 10, height: 20});
    const body2 = new Body({width: 30, height: 40});
    const body3 = new Body({width: 50, height: 60});

    const position1 = new Position({});
    const position2 = new Position({});
    const position3 = new Position({});

    const map1 = new Map({});
    const map2 = new Map({});
    const map3 = new Map({});

    expect(body1.bitmask).toBe(1n);
    expect(body2.bitmask).toBe(1n);
    expect(body3.bitmask).toBe(1n);

    expect(position1.bitmask).toBe(2n);
    expect(position2.bitmask).toBe(2n);
    expect(position3.bitmask).toBe(2n);

    expect(map1.bitmask).toBe(3n);
    expect(map2.bitmask).toBe(3n);
    expect(map3.bitmask).toBe(3n);

    // Extra safety check that the properties of the class were successfully set.
    expect(body1.properties.width).toBe(10);
    expect(body1.properties.height).toBe(20);

    expect(body2.properties.width).toBe(30);
    expect(body2.properties.height).toBe(40);

    expect(body3.properties.width).toBe(50);
    expect(body3.properties.height).toBe(60);
});