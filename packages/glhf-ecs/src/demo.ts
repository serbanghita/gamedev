import ComponentRegistry from "./ComponentRegistry";
import {
    Body as BodyDeclaration,
    Keyboard as KeyboardDeclaration, loop,
    Position as PositionDeclaration, render,
    Renderable as RenderableDeclaration
} from "./mocks";
import Entity from "./Entity";
import Query from "./Query";

const cRegistry = ComponentRegistry.getInstance();
const Body = cRegistry.registerComponent(BodyDeclaration);
const Position = cRegistry.registerComponent(PositionDeclaration);
const Keyboard = cRegistry.registerComponent(KeyboardDeclaration);
const Renderable = cRegistry.registerComponent(RenderableDeclaration);

const Dino = new Entity();
Dino.addComponent(Body, { width: 10, height: 20 });
Dino.addComponent(Position, { x: 1, y: 2 });
Dino.addComponent(Renderable, {});

const Player = new Entity();
Player.addComponent(Body, { width: 30, height: 40 });
Player.addComponent(Position, { x: 3, y: 4 });
Player.addComponent(Keyboard, { up: "w", down: "s", left: "a", right: "d" });
Player.addComponent(Renderable, {});

const allEntitiesToRender = new Query({ all: [Renderable] });

loop(() => {
    allEntitiesToRender.forEach(entity => {
        render(entity);
    });
});