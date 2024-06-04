import World from "../../ecs/src/World";
import {Body, Position,  Direction, Directions, Keyboard, Renderable, SpriteSheet, ISpriteSheetAnimation} from "@serbanghita-gamedev/component";

import {createCanvas, createWrapperElement} from "@serbanghita-gamedev/renderer";

import {loadLocalImage} from "@serbanghita-gamedev/assets";
import {Keyboard as KeyboardInput, InputActions} from "@serbanghita-gamedev/input";
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
import {getDefaultAnimationName} from "@serbanghita-gamedev/renderer";

// 0. Create the UI and canvas.
const $wrapper = createWrapperElement('game-wrapper', 640, 480);
const $foreground = createCanvas('foreground', 640, 480, '1');
const $background = createCanvas('background', 640, 480, '2');
$wrapper.appendChild($foreground);
$wrapper.appendChild($background);
document.body.appendChild($wrapper);

// 1. Load sprite sheets IMGs.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const kilSheetImg = require("./assets/sprites/kil.png");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const kilSheetAnimations = require("./assets/sprites/kil.animations.json") as ISpriteSheetAnimation[];
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dinoBossSheetImg = require("./assets/sprites/dino-boss.png");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dinoBossSheetAnimations = require("./assets/sprites/dino-boss.animations.json") as ISpriteSheetAnimation[];

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

// world.createEntity("dino")
//     .addComponent(Body, { width: 16, height: 16 });

world.createEntity("player")
    .addComponent(Body, { width: 16, height: 16 })
    .addComponent(Position, { x: 0, y: 0 })
    .addComponent(Direction, { x: Directions.NONE, y: Directions.NONE })
    .addComponent(Keyboard, { up: "w", down: "s", left: "a", right: "d" })
    .addComponent(Renderable)
    .addComponent(SpriteSheet, {
        name: 'kil',
        offset_x: 128,
        offset_y: 0,
        img: loadLocalImage(kilSheetImg),
        animationsDeclaration: kilSheetAnimations,
        animations: new Map(),
        animationCurrentFrame: '',
        animationDefaultFrame: '',
    }).addComponent(IsIdle, {
        animationStateName: getDefaultAnimationName(kilSheetAnimations),
    });

world.createEntity("dino-boss")
    .addComponent(Body, { width: 16, height: 16 })
    .addComponent(Position, { x: 100, y: 0 })
    .addComponent(Direction, { x: Directions.NONE, y: Directions.NONE })
    .addComponent(Renderable)
    .addComponent(Keyboard, { up: "i", down: "k", left: "j", right: "l" })
    .addComponent(SpriteSheet, {
        name: 'dino-boss',
        offset_x: 128,
        offset_y: 0,
        img: loadLocalImage(dinoBossSheetImg),
        animationsDeclaration: dinoBossSheetAnimations,
        animations: new Map(),
        animationCurrentFrame: '',
        animationDefaultFrame: '',
    }).addComponent(IsIdle, {
    animationStateName: getDefaultAnimationName(dinoBossSheetAnimations),
});

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


// @ts-expect-error I'm too lazy to typehint window.
window['engine'] = {
    world
};


