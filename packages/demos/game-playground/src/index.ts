import { ENTITIES_DECLARATIONS, EntityDeclaration, loadSprites, MAPS } from "./assets";
import World from "../../../ecs/src/World";
import {
  Body,
  Position,
  Direction,
  Keyboard,
  Renderable,
  SpriteSheet,
  IsOnMatrix,
  MatrixConfig,
  IsTiledMap,
} from "@serbanghita-gamedev/component";
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
import { createHtmlUiElements, PreRenderTiledMapSystem } from "@serbanghita-gamedev/renderer";

async function runGame() {
  // 0. Create the UI and canvas.
  const [, CANVAS_BACKGROUND, CANVAS_FOREGROUND] = createHtmlUiElements();

  // 1. Load sprite sheets IMGs.
  const SPRITES = await loadSprites();
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
    IsTiledMap,
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

  ENTITIES_DECLARATIONS.forEach((entityDeclaration) => createEntityFromDeclaration(entityDeclaration));

  const MatrixQuery = world.createQuery("MatrixQuery", { all: [IsOnMatrix] });
  const KeyboardQuery = world.createQuery("KeyboardQuery", { all: [Keyboard] });
  const IdleQuery = world.createQuery("IdleQuery", { all: [IsIdle] });
  const WalkingQuery = world.createQuery("WalkingQuery", { all: [IsWalking] });
  const AttackingWithClubQuery = world.createQuery("AttackingWithClubQuery", { all: [IsAttackingWithClub] });
  const RenderableQuery = world.createQuery("RenderableQuery", { all: [Renderable, SpriteSheet, Position] });
  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [IsTiledMap] });

  world
    .createSystem(PreRenderTiledMapSystem, TiledMapQuery, CANVAS_BACKGROUND, SPRITES["./assets/sprites/terrain.png"], MAPS)
    .runOnlyOnce();
  world.createSystem(PreRenderSystem, RenderableQuery).runOnlyOnce();
  world.createSystem(PlayerKeyboardSystem, KeyboardQuery, input);
  world.createSystem(IdleSystem, IdleQuery);
  world.createSystem(WalkingSystem, WalkingQuery);
  world.createSystem(AttackingWithClubSystem, AttackingWithClubQuery);
  world.createSystem(RenderSystem, RenderableQuery, CANVAS_FOREGROUND, SPRITES);
  world.createSystem(MatrixSystem, MatrixQuery);

  world.start();

  // @ts-expect-error I'm too lazy to typehint window.
  window["engine"] = {
    world,
  };
}

runGame().then(() => console.log("Game started ..."));
