import ComponentRegistry from "../../glhf-ecs/src/ComponentRegistry";
import Entity from "../../glhf-ecs/src/Entity";
import Query from "../../glhf-ecs/src/Query";
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
import PlayerStateSystem from "./system/PlayerStateSystem";

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
reg.registerComponent(State);


const dino = new Entity("dino");
dino.addComponent(new Body({ width: 10, height: 20 }));
// dino.addComponent(new Position({ x: 1, y: 2 }));
// dino.addComponent(new Renderable({}));

const player = new Entity("player");
player.addComponent(new Body({ width: 30, height: 40 }));
player.addComponent(new Position({ x: 0, y: 0 }));
player.addComponent(new Direction({ x: Directions.NONE, y: Directions.NONE }));
player.addComponent(new Keyboard({ up: "w", down: "s", left: "a", right: "d" }));
player.addComponent(new Renderable({}));


const defaultAnimationFrameName = (kilSheetAnimations.find((animationFrame) => animationFrame.defaultAnimation) as ISpriteSheetAnimation)['name'];

player.addComponent(new SpriteSheet({
    name: 'kil',
    offset_x: 128,
    offset_y: 0,
    img: loadLocalImage(kilSheetData),
    animationsDeclaration: kilSheetAnimations,
    animations: new Map(),
    animationCurrentFrame: '',
    animationDefaultFrame: '',
}));
player.addComponent(new State({
    state: PlayerState.idle,
    stateTick: 0,
    animationState: defaultAnimationFrameName,
    animationTick: 0
}))

const entities = [dino, player];

const queryWithEntitiesToBeRendered = new Query("all entities to render to screen", entities, { all: [Renderable, SpriteSheet, Position] });
const queryWithEntitiesWithKeyboardInput = new Query("all entities with keyboard input", entities, { all: [Keyboard] });

// Pre-loop system run.
const preRenderSystem = new PreRenderSystem(queryWithEntitiesToBeRendered);
preRenderSystem.update(0);

// @todo: It should accept an array of inputs (e.g. keyboards, gamepads, mouse)
const moveSystem = new PlayerKeyboardSystem(queryWithEntitiesWithKeyboardInput, input);
const playerStateSystem = new PlayerStateSystem(queryWithEntitiesWithKeyboardInput);
const renderSystem = new RenderSystem(queryWithEntitiesToBeRendered, $foreground)



const loop = (now: DOMHighResTimeStamp) => {
    moveSystem.update(now);
    playerStateSystem.update(now);
    renderSystem.update(now);
    // q.execute().forEach(entity => {
    //     // Assume that we are in a system.
    //     move(entity);
    //     render(entity);
    //
    // });

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);


// @ts-ignore
// window['engine'] = {
//     'q': q
// };