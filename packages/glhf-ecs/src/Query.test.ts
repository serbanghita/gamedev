import Query from "./Query";
import ComponentRegistry from "./ComponentRegistry";
import Body from "../../glhf-component/src/Body";
import Position from "../../glhf-component/src/Position";
import Keyboard from "../../glhf-component/src/Keyboard";
import Renderable from "../../glhf-component/src/Renderable";
import World from "./World";

describe(("Query"), () => {

    const world = new World();

    const reg = ComponentRegistry.getInstance();
    reg.registerComponent(Body);
    reg.registerComponent(Position);
    reg.registerComponent(Keyboard);
    reg.registerComponent(Renderable);

    const dino = world.createEntity("dino");
    dino.addComponent(Body, { width: 10, height: 20 });
    dino.addComponent(Position, { x: 1, y: 2 });
    dino.addComponent(Renderable);

    const player = world.createEntity("player")
    player.addComponent(Body, { width: 30, height: 40 });
    player.addComponent(Position, { x: 3, y: 4 });
    player.addComponent(Keyboard, { up: "w", down: "s", left: "a", right: "d" });
    player.addComponent(Renderable);

    const camera = world.createEntity("camera");
    camera.addComponent(Position, { x: 0, y: 0 });

    it('all', () => {
        const q = new Query(world, "all", { all: [Renderable] });
        q.init();

        expect(q.execute()).toHaveLength(2);
        expect(q.execute()).toEqual(expect.arrayContaining([dino, player]));
    });

    it('any', () => {
        const q = new Query(world, "any", { any: [Renderable, Position] });
        q.init();

        expect(q.execute()).toHaveLength(3);
        expect(q.execute()).toEqual(expect.arrayContaining([dino, player, camera]));
    });

    it('none', () => {
        const q = new Query(world, "none", { none: [Keyboard] });
        q.init();

        expect(q.execute()).toHaveLength(2);
        expect(q.execute()).toEqual(expect.arrayContaining([dino, camera]));
    });

    it('all(1) + none', () => {
        const q = new Query(world, "all(1) + none", { all: [Body], none: [Keyboard] });
        q.init();

        expect(q.execute()).toHaveLength(1);
        expect(q.execute()).toEqual(expect.arrayContaining([dino]));
    });

    it('all(2) + none', () => {
        const q = new Query(world, "all(2) + none", { all: [Body, Position], none: [Renderable] });

        expect(q.execute()).toHaveLength(0);
    });

    it('candidate', () => {
        const q = new Query(world, "only entities with a body", { all: [Body] });

        expect(q.execute()).toHaveLength(0);
        q.candidate(player);
        q.candidate(dino);
        expect(q.execute()).toHaveLength(2);
        q.candidate(camera);
        expect(q.execute()).toHaveLength(2);

        expect(q.execute()).toEqual(expect.arrayContaining([dino, player]));
    });

    it('remove', () => {
        const q = new Query(world,"only entities with a body", { all: [Body] });

        expect(q.execute()).toHaveLength(0);
        q.init();
        expect(q.execute()).toHaveLength(2);
        q.remove(player);
        expect(q.execute()).toHaveLength(1);
        expect(q.execute()).toEqual(expect.arrayContaining([dino]));
    });
});

