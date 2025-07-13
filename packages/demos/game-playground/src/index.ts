import { loadAssets } from "./assets";
import { World } from "@serbanghita-gamedev/ecs";
import { Body, Direction, Keyboard, Renderable, SpriteSheet, Position } from "@serbanghita-gamedev/component";
import { Keyboard as KeyboardInput, InputActions } from "@serbanghita-gamedev/input";
import PlayerKeyboardSystem from "./system/PlayerKeyboardSystem";
import RenderSystem from "./system/RenderSystem";
import Idle from "./component/Idle";
import Walking from "./component/Walking";
import IdleSystem from "./system/IdleSystem";
import WalkingSystem from "./system/WalkingSystem";
import AttackingWithClub from "./component/AttackingWithClub";
import AttackingWithClubSystem from "./system/AttackingWithClubSystem";
import { createHtmlUiElements, RenderTiledMapTerrainSystem, loadAnimationRegistry } from "@serbanghita-gamedev/renderer";
import { TiledMap, TiledMapFile } from "@serbanghita-gamedev/tiled";
import { getPixelCoordinatesFromTile, getGridCoordinatesFromTile, getTileFromPixelCoordinates, Grid, GridTile, GridTileType } from "@serbanghita-gamedev/grid";
import { Point } from "@serbanghita-gamedev/geometry";
import Player from "./component/Player";
import AutoMoveSystem from "./system/AutoMoveSystem";
import AutoMoving from "./component/AutoMoving";
import WalkingAnimationSystem from "./system/WalkingAnimationSystem";

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
  input.bindKey("f", InputActions.ACTION_1);
  input.listen();

  // Create the current "World" (scene).
  const world = new World();

  // Register "Components".
  world.registerComponents([
    Body, Direction, Keyboard,
    Renderable, SpriteSheet,
    Player, Idle, Walking, AttackingWithClub,
    TiledMapFile, Grid, GridTile,
    Position, AutoMoving
  ]);

  /**
   * Create the globally known Map entity.
   * Add the collision layer to the map.
   */
  const mapFilePath = "./assets/maps/E1MM2.json";
  const mapFileContents = require("./assets/maps/E1MM2.json");

  const map = world.createEntity("map");
  map.addComponent(TiledMapFile, { mapFileContents, mapFilePath });
  const tiledMap = new TiledMap(mapFileContents);
  const collisionLayer = tiledMap.getCollisionLayers()[0];
  const gridConfig = {
    matrix: collisionLayer.data,
    width: collisionLayer.width,
    height: collisionLayer.height,
    tileSize: tiledMap.getTileSize(),
  };
  map.addComponent(Grid, gridConfig);
  /**
   * Transform all collision tiles as Entities.
   */
  collisionLayer.data.forEach((tileValue: number, tileIndex: number) => {
    if (tileValue > 0) {
      const entityId = `collision-tile-${tileIndex}`;
      const collisionTileEntity = world.createEntity(entityId);
      const { x, y } = getGridCoordinatesFromTile(tileIndex, gridConfig);
      const type = tileValue > 0 ? GridTileType.BLOCKED : GridTileType.FREE;
      collisionTileEntity.addComponent(GridTile, { x, y, tile: tileIndex, type });
      // collisionTileEntity.addComponent(PreRendered);
    }
  });

  /**
   * Create all actor entities automatically from "entities.json" declaration file.
   */
  assets["entities/declarations"].forEach((entityDeclaration) => {
    const entity = world.createEntityFromDeclaration(entityDeclaration);
    // Entity Tile is depending on Position and Grid.
    if (entityDeclaration.components["GridTile"]) {
      const position = entity.getComponent(Position);
      const tileIndex = getTileFromPixelCoordinates(position.point.x, position.point.y, gridConfig);
      const { x, y } = getGridCoordinatesFromTile(tileIndex, gridConfig);
      entity.addComponent(GridTile, {x, y, tile: tileIndex, type: GridTileType.FREE });
    }
  });

  /**
   * Pre-render the terrain.
   * Runs only once and then de-registers itself.
   */
  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [TiledMapFile] });
  world.createSystem(RenderTiledMapTerrainSystem, TiledMapQuery, $ctxBackground, assets["maps/images"]["./assets/sprites/terrain.png"]).runOnlyOnce();

  const KeyboardQuery = world.createQuery("KeyboardQuery", { all: [Keyboard] });
  world.createSystem(PlayerKeyboardSystem, KeyboardQuery, input);

  const IdleQuery = world.createQuery("IdleQuery", { all: [Idle] });
  world.createSystem(IdleSystem, IdleQuery);

  const WalkingQuery = world.createQuery("WalkingQuery", { all: [Walking] });
  world.createSystem(WalkingSystem, WalkingQuery);
  world.createSystem(WalkingAnimationSystem, WalkingQuery);

  // const AttackingWithClubQuery = world.createQuery("AttackingWithClubQuery", { all: [AttackingWithClub] });
  // world.createSystem(AttackingWithClubSystem, AttackingWithClubQuery);

  const AutoMoveQuery = world.createQuery("AutoMoveQuery", { all: [AutoMoving] });
  world.createSystem(AutoMoveSystem, AutoMoveQuery);

  const RenderableQuery = world.createQuery("RenderableQuery", { all: [Renderable, SpriteSheet, GridTile] });
  world.createSystem(RenderSystem, RenderableQuery, animationRegistry, $ctxForeground);

  world.start(/*{fpsCap: 60}*/);

  // @ts-expect-error I'm too lazy to typehint window.
  window["engine"] = {
    world,
  };
}

setup().then(() => console.log("Game started ..."));
