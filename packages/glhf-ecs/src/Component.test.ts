import { Position } from "./mocks/Position";

test('properties', () => {
    const position1 = new Position({ x: 10, y: 20 });
    const position2 = new Position({ x: 30, y: 40 });

    expect(position1.bitmask).toBeUndefined(); // Component "Position" was never registered.
    expect(position2.bitmask).toBeUndefined(); // Component "Position" was never registered.
    expect(position1.properties).toEqual({ x: 10, y: 20 });
    expect(position2.properties).toEqual({ x: 30, y: 40 });
});