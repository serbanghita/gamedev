import {Position, Renderable} from "@serbanghita-gamedev/component";
import World from "./World";
import ComponentRegistry from "./ComponentRegistry";

describe("World", () => {
    beforeAll(() => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Position);
        reg.registerComponent(Renderable);
    });

    it("createEntity - entity already exist", () => {
        const world = new World();

        const a = world.createEntity("a");
        a.addComponent(Position, {x: 1, y: 2});
        const b = world.createEntity("b");
        b.addComponent(Position, {x: 10, y: 20});
        b.addComponent(Renderable);

        expect(() => {
            world.createEntity("a");
        }).toThrowError('Entity with the id "a" already exists.');
    });

    it("createEntity - counting", () => {
        const world = new World();

        const a = world.createEntity("a");
        a.addComponent(Position, {x: 1, y: 2});
        const b = world.createEntity("b");
        b.addComponent(Position, {x: 10, y: 20});
        b.addComponent(Renderable);

        expect(world.entities.size).toEqual(2);
    });

    it('createEntity - notifies queries', () => {
        const world = new World();

        world.createQuery("query1", { all: [Renderable] });
        world.createQuery("query2", { all: [Position] });

        const a = world.createEntity("a");
        a.addComponent(Position, {x: 1, y: 2});
        const b = world.createEntity("b");
        b.addComponent(Position, {x: 10, y: 20});
        b.addComponent(Renderable);

        expect(world.getQuery("query1").dataSet.length).toEqual(1);
        expect(world.getQuery("query2").dataSet.length).toEqual(2);
    });

});