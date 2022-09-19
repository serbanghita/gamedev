import Query from "./Query";
import ComponentRegistry from "./ComponentRegistry";
import {
    Body as BodyDeclaration,
    Keyboard as KeyboardDeclaration,
    Position as PositionDeclaration,
    Renderable as RenderableDeclaration
} from "./mocks";
import Entity from "./Entity";

describe(("Query"), () => {

    const cRegistry = ComponentRegistry.getInstance();
    const Body = cRegistry.registerComponent(BodyDeclaration);
    const Position = cRegistry.registerComponent(PositionDeclaration);
    const Keyboard = cRegistry.registerComponent(KeyboardDeclaration);
    const Renderable = cRegistry.registerComponent(RenderableDeclaration);

    const dino = new Entity();
    dino.addComponent(Body, { width: 10, height: 20 });
    dino.addComponent(Position, { x: 1, y: 2 });
    dino.addComponent(Renderable, {});

    const player = new Entity();
    player.addComponent(Body, { width: 30, height: 40 });
    player.addComponent(Position, { x: 3, y: 4 });
    player.addComponent(Keyboard, { up: "w", down: "s", left: "a", right: "d" });
    player.addComponent(Renderable, {});

    const camera = new Entity();
    camera.addComponent(Position, { x: 0, y: 0 });

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

    test('constructor(none)', () => {
        const q = new Query(entities, { none: [Keyboard] });
        expect(q.result).toHaveLength(2);
        expect(q.result).toEqual(expect.arrayContaining([dino, camera]));
    });
});

