import ComponentRegistry from "./ComponentRegistry";
import {Body as BodyDeclaration, Position as PositionDeclaration} from "./mocks";

test('constructor', () => {
    const reg = ComponentRegistry.getInstance();
    expect(reg).toBeInstanceOf(ComponentRegistry);
});

test('registerComponent', () => {
    const reg = ComponentRegistry.getInstance();
    expect(reg).toBeInstanceOf(ComponentRegistry);

    const Body = reg.registerComponent(BodyDeclaration);
    const Position = reg.registerComponent(PositionDeclaration);

    expect(reg.getLastBitmask()).toBe(2n);

    const body1 = new Body({width: 10, height: 20});
    const body2 = new Body({width: 30, height: 40});
    const body3 = new Body({width: 50, height: 60});

    const position1 = new Position({x: 1, y: 2});
    const position2 = new Position({x: 3, y: 4});
    const position3 = new Position({x: 5, y: 6});

    expect(body1.bitmask).toBe(1n);
    expect(body2.bitmask).toBe(1n);
    expect(body3.bitmask).toBe(1n);

    expect(position1.bitmask).toBe(2n);
    expect(position2.bitmask).toBe(2n);
    expect(position3.bitmask).toBe(2n);

    // Extra safety check that the properties of the class were successfully set.
    expect(body1.properties.width).toBe(10);
    expect(body1.properties.height).toBe(20);

    expect(body2.properties.width).toBe(30);
    expect(body2.properties.height).toBe(40);

    expect(body3.properties.width).toBe(50);
    expect(body3.properties.height).toBe(60);

    expect(position1.properties.x).toBe(1);
    expect(position1.properties.y).toBe(2);

    expect(position2.properties.x).toBe(3);
    expect(position2.properties.y).toBe(4);

    expect(position3.properties.x).toBe(5);
    expect(position3.properties.y).toBe(6);
});