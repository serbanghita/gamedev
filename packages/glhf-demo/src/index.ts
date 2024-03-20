import World from "../../glhf-ecs/src/World";
import Body from "../../glhf-component/src/Body";
import Position from "../../glhf-component/src/Position";
import Direction, {Directions} from "../../glhf-component/src/Direction";
import Keyboard from "../../glhf-component/src/Keyboard";
import Renderable from "../../glhf-component/src/Renderable";
import SpriteSheet, {ISpriteSheetAnimation} from "../../glhf-component/src/SpriteSheet";
import {createCanvas} from "@glhf/renderer/canvas";
import {createWrapperElement} from "@glhf/renderer/ui";
import {loadLocalImage} from "../../glhf-assets/src";
import {default as KeyboardInput, InputActions} from "../../glhf-input/src/Keyboard";
import PlayerKeyboardSystem from "./system/PlayerKeyboardSystem";
import RenderSystem from "./system/RenderSystem";
import PreRenderSystem from "./system/PreRenderSystem";
import IsIdle from "./component/IsIdle";
import IsWalking from "./component/IsWalking";
import IdleSystem from "./system/IdleSystem";
import WalkingSystem from "./system/WalkingSystem";
import CurrentState from "./component/CurrentState";
import IsAttackingWithClub from "./component/IsAttackingWithClub";
import AttackingWithClubSystem from "./system/AttackingWithClubSystem";

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
input.bindKey(' ', InputActions.ACTION_1);
input.listen();

// Create the current "World" (scene).
const world = new World();

// Register all "Components".
world.registerComponent(Body)
    .registerComponent(Position)
    .registerComponent(Direction)
    .registerComponent(Keyboard)
    .registerComponent(Renderable)
    .registerComponent(SpriteSheet)
    .registerComponent(IsIdle)
    .registerComponent(IsWalking)
    .registerComponent(IsAttackingWithClub)
    .registerComponent(CurrentState);

world.createEntity("dino")
    .addComponent(Body, { width: 10, height: 20 });

world.createEntity("player")
    .addComponent(Body, { width: 30, height: 40 })
    .addComponent(Position, { x: 0, y: 0 })
    .addComponent(Direction, { x: Directions.NONE, y: Directions.NONE })
    .addComponent(Keyboard, { up: "w", down: "s", left: "a", right: "d" })
    .addComponent(Renderable)
    .addComponent(SpriteSheet, {
        name: 'kil',
        offset_x: 128,
        offset_y: 0,
        img: loadLocalImage(kilSheetData),
        animationsDeclaration: kilSheetAnimations,
        animations: new Map(),
        animationCurrentFrame: '',
        animationDefaultFrame: '',
    }).addComponent(IsIdle, {
        animationStateName: kilDefaultAnimationFrameName,
    }).addComponent(CurrentState, { stateName: 'IsIdle' })

world.createQuery("keyboard-query", { all: [Keyboard] });
world.createQuery("idle-query", {all: [IsIdle]});
world.createQuery("walking-query", {all: [IsWalking]});
world.createQuery("attacking-with-club-query", {all: [IsAttackingWithClub]});
world.createQuery("renderable-query", { all: [Renderable, SpriteSheet, Position] });

world.registerSystem("pre-render-system", PreRenderSystem)
    .registerSystem("input-system", PlayerKeyboardSystem)
    .registerSystem("idle-system", IdleSystem)
    .registerSystem("walking-system", WalkingSystem)
    .registerSystem("attacking-with-club-system", AttackingWithClubSystem)
    .registerSystem("render-system", RenderSystem);

world.createSystem("pre-render-system", "renderable-query")
    .createSystem("input-system", "keyboard-query", input)
    .createSystem("idle-system", "idle-query")
    .createSystem("walking-system", "walking-query")
    .createSystem("attacking-with-club-system", "attacking-with-club-query")
    .createSystem("render-system", "renderable-query", $foreground)

world.getSystem("pre-render-system").update(0);

const loop = (now: DOMHighResTimeStamp) => {
    world.systems.forEach(system => system.update(now));

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);


// @ts-ignore
window['engine'] = {
    world
};


