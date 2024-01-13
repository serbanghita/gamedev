import Entity from "./Entity";
import {Position} from "./mocks/Position";
import World from "./World";
import {Renderable} from "./mocks/Renderable";
import Query from "./Query";
import ComponentRegistry from "./ComponentRegistry";

describe("World", () => {
    beforeAll(() => {
        const reg = ComponentRegistry.getInstance();
        reg.registerComponent(Position);
        reg.registerComponent(Renderable);
    });

    it("registerEntity - entity already exist", () => {
        const a = new Entity("a");
        a.addComponent(new Position({x: 1, y: 2}));
        const b = new Entity("b");
        b.addComponent(new Position({x: 10, y: 20}));
        b.addComponent(new Renderable({}));

        const world = new World();
        world.registerEntity(a);
        expect(() => {
            world.registerEntity(a);
        }).toThrowError('Entity with the id "a" already exists.');
    });

    it("registerEntity - counting", () => {
        const a = new Entity("a");
        a.addComponent(new Position({x: 1, y: 2}));
        const b = new Entity("b");
        b.addComponent(new Position({x: 10, y: 20}));
        b.addComponent(new Renderable({}));

        const world = new World();
        world.registerEntity(a);
        world.registerEntity(b);

        expect(world.entities.size).toEqual(2);
    });

    it('registerEntity - notifies queries', () => {
        const a = new Entity("a");
        a.addComponent(new Position({x: 1, y: 2}));
        const b = new Entity("b");
        b.addComponent(new Position({x: 10, y: 20}));
        b.addComponent(new Renderable({}));

        const q1 = new Query("query1", [], { all: [Renderable] });
        const q2 = new Query("query2", [], { all: [Position] });

        const world = new World();

        world.registerQuery(q1);
        world.registerQuery(q2);
    });

});