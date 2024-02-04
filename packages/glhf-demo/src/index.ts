import ComponentRegistry from "../../glhf-ecs/src/ComponentRegistry";
import Entity from "../../glhf-ecs/src/Entity";
import World from "../../glhf-ecs/src/World";
import Body from "../../glhf-component/src/Body";
import Position from "../../glhf-component/src/Position";
import Direction, {Directions} from "../../glhf-component/src/Direction";
import Keyboard from "../../glhf-component/src/Keyboard";
import Renderable from "../../glhf-component/src/Renderable";
import State from "../../glhf-component/src/State";
import SpriteSheet, {ISpriteSheetAnimation} from "../../glhf-component/src/SpriteSheet";
import {clearCtx, createCanvas, getCtx, renderImage} from "../../glhf-renderer/src/canvas";
import {createWrapperElement} from "../../glhf-renderer/src/ui";
import {loadLocalImage} from "../../glhf-assets/src";
import {default as KeyboardInput, InputActions} from "../../glhf-input/src/Keyboard";
import PlayerKeyboardSystem from "./system/PlayerKeyboardSystem";
import RenderSystem from "./system/RenderSystem";
import PreRenderSystem from "./system/PreRenderSystem";
import {PlayerState} from "./component/PlayerState";
import IsIdle from "./component/IsIdle";
import IsWalking from "./component/IsWalking";
import IdleSystem from "./system/IdleSystem";
import WalkingSystem from "./system/WalkingSystem";
import StateSystem from "./system/StateSystem";

// 0. Create the UI and canvas.
const $wrapper = createWrapperElement('game-wrapper', 640, 480);
const $foreground = createCanvas('foreground', 640, 480, '1');
const $background = createCanvas('background', 640, 480, '2');
$wrapper.appendChild($foreground);
$wrapper.appendChild($background);
document.body.appendChild($wrapper);

// 1. Load sprite sheets IMGs.
const kilSheetData = require("./assets/sprites/kil.png");
const kilSheetAnimations = require("./assets/sprites/kil_animations.json") as ISpriteSheetAnimation[];
const kilDefaultAnimationFrameName = (kilSheetAnimations.find((animationFrame) => animationFrame.defaultAnimation) as ISpriteSheetAnimation)['name'];

// 2. Load JSON animations for sprite sheets.
// 3. Load JSON map declarations (Tiled).
// 4. Create the grid.

// Load input Component.
const input = new KeyboardInput();
input.bindKey('w', InputActions.MOVE_UP);
input.bindKey('s', InputActions.MOVE_DOWN);
input.bindKey('a', InputActions.MOVE_LEFT);
input.bindKey('d', InputActions.MOVE_RIGHT);
input.bindKey('q', InputActions.ACTION_1);
input.listen();

// Register all "Components".
const reg = ComponentRegistry.getInstance();
reg.registerComponent(Body);
reg.registerComponent(Position);
reg.registerComponent(Direction);
reg.registerComponent(Keyboard);
reg.registerComponent(Renderable);
reg.registerComponent(SpriteSheet);
reg.registerComponent(IsIdle);
reg.registerComponent(IsWalking);
reg.registerComponent(State);

// Create the current "World" (scene).
const world = new World();

world.createEntity("dino")
    .addComponent(Body, { width: 10, height: 20 });

world.createEntity("player")
    .addComponent(Body, { width: 30, height: 40 })
    .addComponent(Position, { x: 0, y: 0 })
    .addComponent(Direction, { x: Directions.NONE, y: Directions.NONE })
    .addComponent(Keyboard, { up: "w", down: "s", left: "a", right: "d" })
    .addComponent(Renderable)
    .addComponent(IsIdle, {
        state: 'idle',
        animationState: 'idle_up',
        stateTick: 0,
        animationTick: 0
    })
    .addComponent(SpriteSheet, {
        name: 'kil',
        offset_x: 128,
        offset_y: 0,
        img: loadLocalImage(kilSheetData),
        animationsDeclaration: kilSheetAnimations,
        animations: new Map(),
        animationCurrentFrame: '',
        animationDefaultFrame: '',
    }).addComponent(State, {
        state: PlayerState.idle,
        stateTick: 0,
        animationState: kilDefaultAnimationFrameName,
        animationTick: 0
    });


world.createQuery("renderable", { all: [Renderable, SpriteSheet, Position] });
world.createQuery("keyboard", { all: [Keyboard] });
world.createQuery("idle", {all: [IsIdle]});
world.createQuery("walking", {all: [IsWalking]});


// Pre-loop system run.
const preRenderSystem = new PreRenderSystem(world.getQuery("renderable"));
preRenderSystem.update(0);
const inputSystem = new PlayerKeyboardSystem(world.getQuery("keyboard"), input);
const idleSystem = new IdleSystem(world.getQuery("idle"));
const walkingSystem = new WalkingSystem(world.getQuery("walking"));
const renderSystem = new RenderSystem(world.getQuery("renderable"), $foreground);
const stateSystem = new StateSystem(world.getQuery("renderable")); // @todo: Make this work on all entities.


const loop = (now: DOMHighResTimeStamp) => {
    inputSystem.update(now);
    idleSystem.update(now);
    walkingSystem.update(now);
    stateSystem.update(now);
    renderSystem.update(now);

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);


// @ts-ignore
// window['engine'] = {
//     'q': q
// };


