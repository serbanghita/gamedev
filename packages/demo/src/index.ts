import { ENTITIES_DECLARATIONS, EntityDeclaration } from "./assets";
import World from "../../ecs/src/World";
import { Body, Position, Direction, Keyboard, Renderable, SpriteSheet, IsOnMatrix, MatrixConfig } from "@serbanghita-gamedev/component";

import { createCanvas, createWrapperElement } from "@serbanghita-gamedev/renderer";
import { Keyboard as KeyboardInput, InputActions } from "@serbanghita-gamedev/input";
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
import MatrixSystem from "./system/MatrixSystem";

// 0. Create the UI and canvas.
const $wrapper = createWrapperElement("game-wrapper", 640, 480);
const $foreground = createCanvas("foreground", 640, 480, "1");
const $background = createCanvas("background", 640, 480, "2");
$wrapper.appendChild($foreground);
$wrapper.appendChild($background);
document.body.appendChild($wrapper);

// 1. Load sprite sheets IMGs.
// 2. Load JSON animations for sprite sheets.
// 3. Load JSON map declarations (Tiled).
// 4. Create the grid.

// Load input Component.
const input = new KeyboardInput();
input.bindKey("w", InputActions.MOVE_UP);
input.bindKey("s", InputActions.MOVE_DOWN);
input.bindKey("a", InputActions.MOVE_LEFT);
input.bindKey("d", InputActions.MOVE_RIGHT);
input.bindKey(" ", InputActions.ACTION_1);
input.listen();

// Create the current "World" (scene).
const world = new World();

// Register "Components".
world.declarations.components.registerComponents([
  Body,
  Position,
  Direction,
  Keyboard,
  Renderable,
  SpriteSheet,
  IsIdle,
  IsWalking,
  IsAttackingWithClub,
  CurrentState,
  MatrixConfig,
  IsOnMatrix,
]);

function createEntityFromDeclaration(entityDeclaration: EntityDeclaration) {
  // Create the entity and assign it to the world.
  const entity = world.createEntity(entityDeclaration.id);

  // Add Component(s) to the Entity.
  for (const name in entityDeclaration.components) {
    const componentDeclaration = world.declarations.components.getComponent(name);
    const props = entityDeclaration.components[name];

    entity.addComponent(componentDeclaration, props);
  }
}

ENTITIES_DECLARATIONS.forEach((entityDeclaration) => {
  createEntityFromDeclaration(entityDeclaration);

  // ;
  //     .addComponent(Body, { width: 16, height: 16 })
  //     .addComponent(Position, entityDeclaration.position)
  //     .addComponent(Direction, { x: Directions.NONE, y: Directions.NONE })
  //     .addComponent(Keyboard, entityDeclaration.input.binding)
  //     .addComponent(Renderable)
  //     .addComponent(SpriteSheet, {
  //         name: entityDeclaration.sprite.name,
  //         offset_x: entityDeclaration.sprite.offset.x,
  //         offset_y: entityDeclaration.sprite.offset.y,
  //         img: loadLocalImage(sheetImg),
  //         animationsDeclaration: sheetAnimations,
  //         animations: new Map(),
  //         animationCurrentFrame: '',
  //         animationDefaultFrame: '',
  //     }).addComponent(IsIdle, {
  //     animationStateName: getDefaultAnimationName(sheetAnimations),
  // });
});

world.createQuery("MatrixQuery", { all: [IsOnMatrix] });
const KeyboardQuery = world.createQuery("KeyboardQuery", { all: [Keyboard] });
world.createQuery("IdleQuery", { all: [IsIdle] });
world.createQuery("WalkingQuery", { all: [IsWalking] });
world.createQuery("AttackingWithClubQuery", { all: [IsAttackingWithClub] });
const RenderableQuery = world.createQuery("RenderableQuery", { all: [Renderable, SpriteSheet, Position] });

// world.declarations.systems.set("PreRenderSystem", PreRenderSystem); // @todo This should run only once!
// world.declarations.systems.set("PlayerKeyboardSystem", PlayerKeyboardSystem);
// world.declarations.systems.set("IdleSystem", IdleSystem);
// world.declarations.systems.set("WalkingSystem", WalkingSystem);
// world.declarations.systems.set("MatrixSystem", MatrixSystem);
// world.declarations.systems.set("AttackingWithClubSystem", AttackingWithClubSystem);
// world.declarations.systems.set("RenderSystem", RenderSystem);

world
  .createSystem(PreRenderSystem, RenderableQuery)
  .createSystem(PlayerKeyboardSystem, KeyboardQuery, input)
  .createSystem("IdleSystem", "IdleQuery")
  .createSystem("WalkingSystem", "WalkingQuery")
  .createSystem("AttackingWithClubSystem", "AttackingWithClubQuery")
  .createSystem("RenderSystem", "RenderableQuery", $foreground)
  .createSystem("MatrixSystem", "MatrixQuery");

world.getSystem("PreRenderSystem").update(0);

const loop = (now: DOMHighResTimeStamp) => {
  world.systems.forEach((system) => system.update(now));

  window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

// @ts-expect-error I'm too lazy to typehint window.
window["engine"] = {
  world,
};
