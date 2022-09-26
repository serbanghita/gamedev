import Query from "./Query";
import ComponentRegistry from "./ComponentRegistry";

import Entity from "./Entity";
import {Body} from "./mocks/Body";
import {Position} from "./mocks/Position";
import {Keyboard} from "./mocks/Keyboard";
import {Renderable} from "./mocks/Renderable";

describe(("Query"), () => {

    const reg = ComponentRegistry.getInstance();
    reg.registerComponent(Body);
    reg.registerComponent(Position);
    reg.registerComponent(Keyboard);
    reg.registerComponent(Renderable);

    const dino = new Entity();
    dino.addComponent(new Body({ width: 10, height: 20 }));
    dino.addComponent(new Position({ x: 1, y: 2 }));
    dino.addComponent(new Renderable({}));

    const player = new Entity();
    player.addComponent(new Body({ width: 30, height: 40 }));
    player.addComponent(new Position({ x: 3, y: 4 }));
    player.addComponent(new Keyboard({ up: "w", down: "s", left: "a", right: "d" }));
    player.addComponent(new Renderable({}));

    const camera = new Entity();
    camera.addComponent(new Position({ x: 0, y: 0 }));

    const entities = [dino, player, camera];

    test('constructor(all)', () => {
        const q = new Query(entities, { all: [Renderable] });
        expect(q.result).toHaveLength(2);
        expect(q.result).toEqual(expect.arrayContaining([dino, player]));
    });

    test('constructor(any)', () => {
        const q = new Query(entities, { any: [Renderable, Position] });
        expect(q.result).toHaveLength(3);
        expect(q.result).toEqual(expect.arrayContaining([dino, player, camera]));
    });

    // @todo: Continue here.
    test.skip('constructor(none)', () => {
        const q = new Query(entities, { none: [Keyboard] });
        expect(q.result).toHaveLength(2);
        expect(q.result).toEqual(expect.arrayContaining([dino, camera]));
    });
});

