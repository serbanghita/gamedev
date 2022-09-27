import Entity from "./Entity";
import ComponentRegistry from "./ComponentRegistry";
import {Body} from "./mocks/Body";
import {Position} from "./mocks/Position";

describe('Entity', () => {
    test('addComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);
        reg.registerComponent(Position);

        const entity = new Entity("test");
        entity.addComponent(new Body({width: 10, height: 20})); // 1n
        entity.addComponent(new Position({x: 1, y: 2})); // 2n

        expect(entity.componentsBitmask).toBe(6n);
        expect(entity.getComponent(Body)).toBeInstanceOf(Body);
        expect(entity.getComponent(Position)).toBeInstanceOf(Position);
    });
});