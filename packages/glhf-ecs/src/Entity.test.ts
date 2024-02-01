import Entity from "./Entity";
import ComponentRegistry from "./ComponentRegistry";
import Body from "../../glhf-component/src/Body";
import Position from "../../glhf-component/src/Position";

describe('Entity', () => {
    it('addComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);
        reg.registerComponent(Position);

        const entity = new Entity("test");
        entity.addComponent(Body, {width: 10, height: 20}); // 1n
        entity.addComponent(Position, {x: 1, y: 2}); // 2n

        expect(entity.componentsBitmask).toBe(6n);
        expect(entity.getComponent(Body)).toBeInstanceOf(Body);
        expect(entity.getComponent(Position)).toBeInstanceOf(Position);
    });

    it('getComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);

        const entity = new Entity("test");
        entity.addComponent(Body, {width: 10, height: 20}); // 1n

        expect(entity.getComponent(Body)).toBeInstanceOf(Body);
        expect(entity.getComponent(Body)).toEqual({
            properties: { width: 10, height: 20}
        })
    });

    it('getComponent exception', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);

        const entity = new Entity("test");
        entity.addComponent(Body, {width: 10, height: 20}); // 1n

        expect(() => entity.getComponent(Position)).toThrow('Component requested Position is non-existent.')
    });

    it('hasComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);
        reg.registerComponent(Position);

        const entity = new Entity("test");
        entity.addComponent(Body, {width: 10, height: 20}); // 1n
        entity.addComponent(Position, {x: 1, y: 2}); // 2n

        expect(entity.hasComponent(Body)).toBe(true);
        expect(entity.hasComponent(Position)).toBe(true);
    });
});