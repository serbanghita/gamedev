import Entity from "./Entity";
import ComponentRegistry from "./ComponentRegistry";
import {Body, Position} from "@serbanghita-gamedev/component";
import World from "./World";

describe('Entity', () => {

    let world: World;
    beforeEach(() => {
        world = new World();
    });

    it('addComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);
        reg.registerComponent(Position);

        const entity = new Entity(world,"test");
        const spy = vi.spyOn(world, 'notifyQueriesOfEntityComponentAddition');
        entity.addComponent(Body, {width: 10, height: 20}); // 1n
        expect(spy).toHaveBeenCalledWith(entity, entity.getComponent(Body));
        entity.addComponent(Position, {x: 1, y: 2}); // 2n
        expect(spy).toHaveBeenCalledWith(entity, entity.getComponent(Position));

        expect(entity.componentsBitmask).toBe(6n);
        expect(entity.getComponent(Body)).toBeInstanceOf(Body);
        expect(entity.getComponent(Position)).toBeInstanceOf(Position);
    });

    it('getComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);

        const entity = new Entity(world, "test");
        entity.addComponent(Body, {width: 10, height: 20}); // 1n

        expect(entity.getComponent(Body)).toBeInstanceOf(Body);
        expect(entity.getComponent(Body)).toEqual({
            properties: { width: 10, height: 20}
        })
    });

    it('getComponentByName', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);

        const entity = new Entity(world, "test");
        entity.addComponent(Body, {width: 10, height: 20});

        expect(entity.getComponentByName('Body')).toBeInstanceOf(Body);
    });

    it('removeComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);

        const entity = new Entity(world, "test");
        const spy = vi.spyOn(world, 'notifyQueriesOfEntityComponentRemoval');
        entity.addComponent(Body, {width: 10, height: 20});
        entity.removeComponent(Body);
        expect(spy).toHaveBeenCalledWith(entity, entity.getComponent(Body));

        expect(entity.hasComponent(Body)).toBe(false);
    });

    it('getComponent exception', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);

        const entity = new Entity(world, "test");
        entity.addComponent(Body, {width: 10, height: 20}); // 1n

        expect(() => entity.getComponent(Position)).toThrow('Component requested Position is non-existent.')
    });

    it('hasComponent', () => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Body);
        reg.registerComponent(Position);

        const entity = new Entity(world,"test");
        entity.addComponent(Body, {width: 10, height: 20}); // 1n
        entity.addComponent(Position, {x: 1, y: 2}); // 2n

        expect(entity.hasComponent(Body)).toBe(true);
        expect(entity.hasComponent(Position)).toBe(true);
    });
});