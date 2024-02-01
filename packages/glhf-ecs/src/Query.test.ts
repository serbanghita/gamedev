import Query from "./Query";
import ComponentRegistry from "./ComponentRegistry";

import Entity from "./Entity";
import Body from "../../glhf-component/src/Body";
import Position from "../../glhf-component/src/Position";
import Keyboard from "../../glhf-component/src/Keyboard";
import Renderable from "../../glhf-component/src/Renderable";

describe(("Query"), () => {

    const reg = ComponentRegistry.getInstance();
    reg.registerComponent(Body);
    reg.registerComponent(Position);
    reg.registerComponent(Keyboard);
    reg.registerComponent(Renderable);

    const dino = new Entity("dino");
    dino.addComponent(Body, { width: 10, height: 20 });
    dino.addComponent(Position, { x: 1, y: 2 });
    dino.addComponent(Renderable);

    const player = new Entity("player");
    player.addComponent(Body, { width: 30, height: 40 });
    player.addComponent(Position, { x: 3, y: 4 });
    player.addComponent(Keyboard, { up: "w", down: "s", left: "a", right: "d" });
    player.addComponent(Renderable);

    const camera = new Entity("camera");
    camera.addComponent(Position, { x: 0, y: 0 });

    const entities = [dino, player, camera];

    test('all', () => {
        const q = new Query("all", entities,{ all: [Renderable] });

        expect(q.execute()).toHaveLength(2);
        expect(q.execute()).toEqual(expect.arrayContaining([dino, player]));
    });

    test('any', () => {
        const q = new Query("any", entities, { any: [Renderable, Position] });

        expect(q.execute()).toHaveLength(3);
        expect(q.execute()).toEqual(expect.arrayContaining([dino, player, camera]));
    });

    test('none', () => {
        const q = new Query("none", entities, { none: [Keyboard] });

        expect(q.execute()).toHaveLength(2);
        expect(q.execute()).toEqual(expect.arrayContaining([dino, camera]));
    });

    test('all(1) + none', () => {
        const q = new Query("all(1) + none", entities, { all: [Body], none: [Keyboard] });

        expect(q.execute()).toHaveLength(1);
        expect(q.execute()).toEqual(expect.arrayContaining([dino]));
    });

    test('all(2) + none', () => {
        const q = new Query("all(2) + none", entities,{ all: [Body, Position], none: [Renderable] });

        expect(q.execute()).toHaveLength(0);
    });

    test('candidate', () => {
        const q = new Query("only entities with a body", [dino],{ all: [Body] });

        expect(q.execute()).toHaveLength(1);
        q.candidate(player);
        expect(q.execute()).toHaveLength(2);
        q.candidate(camera);
        expect(q.execute()).toHaveLength(2);

        expect(q.execute()).toEqual(expect.arrayContaining([dino, player]));
    });

    test('remove', () => {
        const q = new Query("only entities with a body", [dino, player],{ all: [Body] });

        expect(q.execute()).toHaveLength(2);
        q.remove(player);
        expect(q.execute()).toHaveLength(1);
        expect(q.execute()).toEqual(expect.arrayContaining([dino]));
    });
});

