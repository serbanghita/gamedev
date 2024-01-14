import ComponentRegistry from "../../glhf-ecs/src/ComponentRegistry";
import Entity from "../../glhf-ecs/src/Entity";
import Query from "../../glhf-ecs/src/Query";
import {Body} from "../../glhf-ecs/src/mocks/Body";
import {Position} from "../../glhf-ecs/src/mocks/Position";
import {Keyboard} from "../../glhf-ecs/src/mocks/Keyboard";
import {Renderable} from "../../glhf-ecs/src/mocks/Renderable";
import {clearCtx, createCanvas, getCtx, renderImage} from "../../glhf-renderer/src/canvas";
import {createWrapperElement} from "../../glhf-renderer/src/ui";
import {loadLocalImage} from "../../glhf-assets/src";
import {default as KeyboardInput, InputActions} from "../../glhf-input/src/Keyboard";

// 0. Create the UI and canvas.
const $wrapper = createWrapperElement('game-wrapper', 640, 480);
const $foreground = createCanvas('foreground', 640, 480, '1');
const $background = createCanvas('background', 640, 480, '2');
$wrapper.appendChild($foreground);
$wrapper.appendChild($background);
document.body.appendChild($wrapper);

// 1. Load sprite sheets IMGs.
const kilSheetData = require("./assets/sprites/kil.png");
const kilSheet = loadLocalImage(kilSheetData);

// 2. Load JSON animations for sprite sheets.
// 3. Load JSON map declarations (Tiled).
// 4. Create the grid.

// Load input Component.
const input = new KeyboardInput();
input.bindKey('w', InputActions.MOVE_UP);
input.bindKey('s', InputActions.MOVE_DOWN);
input.bindKey('a', InputActions.MOVE_LEFT);
input.bindKey('d', InputActions.MOVE_RIGHT);
input.listen();

// Register all "Components".
const reg = ComponentRegistry.getInstance();
reg.registerComponent(Body);
reg.registerComponent(Position);
reg.registerComponent(Keyboard);
reg.registerComponent(Renderable);

const dino = new Entity("dino");
dino.addComponent(new Body({ width: 10, height: 20 }));
// dino.addComponent(new Position({ x: 1, y: 2 }));
// dino.addComponent(new Renderable({}));

const player = new Entity("player");
player.addComponent(new Body({ width: 30, height: 40 }));
player.addComponent(new Position({ x: 0, y: 0 }));
player.addComponent(new Keyboard({ up: "w", down: "s", left: "a", right: "d" }));
player.addComponent(new Renderable({}));

const q = new Query("all entities to render to screen", [dino, player], { all: [Renderable, Position] });

enum Directions {
    NONE, UP, DOWN, LEFT, RIGHT
}

function getDirectionFromKeyboardActions(actions: Set<InputActions>) {
    const direction: Set<Directions> = new Set([]);

    if (actions.has(InputActions.MOVE_UP)) {
        direction.add(Directions.UP);
    }

    if (actions.has(InputActions.MOVE_DOWN)) {
        direction.add(Directions.DOWN);
    }

    if (actions.has(InputActions.MOVE_LEFT)) {
        direction.add(Directions.LEFT);
    }

    if (actions.has(InputActions.MOVE_RIGHT)) {
        direction.add(Directions.RIGHT);
    }

    return direction;
}

function move(entity: Entity) {
    if (entity.hasComponent(Keyboard)) {
        if (input.areKeysPressed()) {
            const direction = getDirectionFromKeyboardActions(input.ongoingActions);
            console.log(direction);

            const position = entity.getComponent(Position);
            if (direction.has(Directions.UP)) {
                position.properties.y -= 1;
            }
            if (direction.has(Directions.DOWN)) {
                position.properties.y += 1;
            }
            if (direction.has(Directions.LEFT)) {
                position.properties.x -= 1;
            }
            if (direction.has(Directions.RIGHT)) {
                position.properties.x += 1;
            }

        }


    }
}

const loop = (now: DOMHighResTimeStamp) => {
    q.execute().forEach(entity => {
        // Assume that we are in a system.
        move(entity);


        clearCtx(getCtx($foreground), 0, 0, 640, 480);

        const position = entity.getComponent(Position);

        renderImage(
            getCtx($foreground),
            kilSheet,
            128, 0,
            64, 96,
            position.properties.x, position.properties.y,
            64, 96,
        );

    });

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);


// @ts-ignore
window['engine'] = {
    'q': q
};