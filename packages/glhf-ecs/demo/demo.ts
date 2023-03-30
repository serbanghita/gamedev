import ComponentRegistry from "../src/ComponentRegistry";
import Entity from "../src/Entity";
import Query from "../src/Query";
import {Body} from "../src/mocks/Body";
import {Position} from "../src/mocks/Position";
import {Keyboard} from "../src/mocks/Keyboard";
import {Renderable} from "../src/mocks/Renderable";
import {render} from "../src/mocks/stubs";

const reg = ComponentRegistry.getInstance();
reg.registerComponent(Body);
reg.registerComponent(Position);
reg.registerComponent(Keyboard);
reg.registerComponent(Renderable);

const dino = new Entity("dino");
dino.addComponent(new Body({ width: 10, height: 20 }));
dino.addComponent(new Position({ x: 1, y: 2 }));
dino.addComponent(new Renderable({}));

const player = new Entity("player");
player.addComponent(new Body({ width: 30, height: 40 }));
player.addComponent(new Position({ x: 3, y: 4 }));
player.addComponent(new Keyboard({ up: "w", down: "s", left: "a", right: "d" }));
player.addComponent(new Renderable({}));

const q = new Query("all entities to render to screen", [dino, player], { all: [Renderable] });

const loop = (now: DOMHighResTimeStamp) => {
    q.execute().forEach(entity => {
        render(entity);
    });

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);