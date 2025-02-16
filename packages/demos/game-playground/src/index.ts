import { loadAssets } from "./assets";
import { World } from "@serbanghita-gamedev/ecs";
import { Body, Direction, Keyboard, Renderable, SpriteSheet, TiledMapFile, TileMatrix, Tile, Position } from "@serbanghita-gamedev/component";
import { Keyboard as KeyboardInput, InputActions } from "@serbanghita-gamedev/input";
import PlayerKeyboardSystem from "./system/PlayerKeyboardSystem";
import RenderSystem from "./system/RenderSystem";
import IsIdle from "./component/IsIdle";
import IsWalking from "./component/IsWalking";
import IdleSystem from "./system/IdleSystem";
import WalkingSystem from "./system/WalkingSystem";
import IsAttackingWithClub from "./component/IsAttackingWithClub";
import AttackingWithClubSystem from "./system/AttackingWithClubSystem";
import { createHtmlUiElements, RenderTiledMapTerrainSystem, loadAnimationRegistry } from "@serbanghita-gamedev/renderer";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import IsPlayer from "./component/IsPlayer";
import AutoMoveSystem from "./system/AutoMoveSystem";

async function setup() {
  /************************************************************
   * Create the UI and canvas.
   ************************************************************/

  const [$htmlWrapper, $canvasBackground, $ctxBackground, $canvasForeground, $ctxForeground] = createHtmlUiElements();

  /*************************************************************
   * Preload assets (IMGs, JSONs)
   *
   *    entities/images - Sprite sheets as IMGs for entities animations.
   *    entities/animations - Animation frames as JSON
   *    entities/declarations - Entities + Components as JSON
   *    maps/images - Terrain as sprite sheets IMGs.
   *    maps/declarations - Maps as JSON exported from Tiled.
   *
   ************************************************************/

  const assets = await loadAssets();

  /************************************************************
   * Registry for animations. Stores Entity's animation frames.
   * Used by the RenderSystem to pre-compute animation frames data.
   ************************************************************/

  const animationRegistry = loadAnimationRegistry(assets);

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
  world.registerComponents([
    Body,
    Direction,
    Keyboard,
    Renderable,
    SpriteSheet,
    IsPlayer,
    IsIdle,
    IsWalking,
    IsAttackingWithClub,
    TiledMapFile,
    TileMatrix,
    Tile,
    Position,
  ]);

  const map = world.createEntity("map");
  map.addComponent(TiledMapFile, { mapFile: require("./assets/maps/E1MM2.json"), mapFilePath: "./assets/maps/E1MM2.json" });
  const tiledMapFile = map.getComponent(TiledMapFile).properties.mapFile;
  const tiledMap = new TiledMap(tiledMapFile);
  const collisionLayer = tiledMap.getCollisionLayers()[0];
  map.addComponent(TileMatrix, {
    matrix: collisionLayer.data,
    width: collisionLayer.width,
    height: collisionLayer.height,
    tileSize: tiledMap.getTileSize(),
  });

  // Create entities automatically from "entities.json" declaration file.
  assets["entities/declarations"].forEach((entityDeclaration) => {
    const entity = world.createEntityFromDeclaration(entityDeclaration);
    // Entity Tile is depending on Position and TileMatrix.
    if (entityDeclaration.components["Tile"]) {
      entity.addComponent(Tile, { point: entity.getComponent(Position).point, matrixConfig: map.getComponent(TileMatrix).matrixConfig });
    }
  });

  const KeyboardQuery = world.createQuery("KeyboardQuery", { all: [Keyboard] });
  const IdleQuery = world.createQuery("IdleQuery", { all: [IsIdle] });
  const WalkingQuery = world.createQuery("WalkingQuery", { all: [IsWalking] });
  // const AttackingWithClubQuery = world.createQuery("AttackingWithClubQuery", { all: [IsAttackingWithClub] });
  const RenderableQuery = world.createQuery("RenderableQuery", { all: [Renderable, SpriteSheet, Tile] });
  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [TiledMapFile] });
  const MoveQuery = world.createQuery("MoveQuery", { all: [Tile, IsPlayer] });

  world.createSystem(RenderTiledMapTerrainSystem, TiledMapQuery, $ctxBackground, assets["maps/images"]["./assets/sprites/terrain.png"]).runOnlyOnce();
  world.createSystem(PlayerKeyboardSystem, KeyboardQuery, input);
  world.createSystem(IdleSystem, IdleQuery);
  world.createSystem(WalkingSystem, WalkingQuery);
  // world.createSystem(AttackingWithClubSystem, AttackingWithClubQuery);
  world.createSystem(RenderSystem, RenderableQuery, animationRegistry, $ctxForeground);
  world.createSystem(AutoMoveSystem, MoveQuery);

  world.start();

  // @ts-expect-error I'm too lazy to typehint window.
  window["engine"] = {
    world,
  };
}

setup().then(() => console.log("Game started ..."));
