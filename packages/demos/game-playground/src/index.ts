import { loadAssets } from "./assets";
import { World } from "@serbanghita-gamedev/ecs";
import { Body, Direction, Keyboard, Renderable, SpriteSheet, PositionOnScreen } from "@serbanghita-gamedev/component";
import { Keyboard as KeyboardInput, InputActions } from "@serbanghita-gamedev/input";
import PlayerKeyboardSystem from "./system/PlayerKeyboardSystem";
import RenderingSystem from "./system/RenderingSystem";
import { Idle } from "./component/Idle";
import { Walking } from "./component/Walking";
import IdleSystem from "./system/IdleSystem";
import WalkingSystem from "./system/WalkingSystem";
import AttackingWithClub from "./component/AttackingWithClub";
import AttackingWithClubSystem from "./system/AttackingWithClubSystem";
import { createHtmlUiElements, RenderTiledMapTerrainSystem, loadAnimationRegistry } from "@serbanghita-gamedev/renderer";
import { TiledMap, TiledMapFile } from "@serbanghita-gamedev/tiled";
import { getPixelCoordinatesFromTile, getGridCoordinatesFromTile, getTileFromPixelCoordinates, Grid, GridTile, GridTileType, PositionOnGrid } from "@serbanghita-gamedev/grid";
import Player from "./component/Player";
import AutoMoveSystem from "./system/AutoMoveSystem";
import AutoMoving from "./component/AutoMoving";
import WalkingAnimationSystem from "./system/WalkingAnimationSystem";
import AStarPathFindingSystem from "./system/AStarPathFindingSystem";
import TileIsInThePathFound from "./component/TileIsInThePathFound";
import DebugRenderingSystem from "./system/DebugRenderingSystem";
import DebugRenderedInForeground from "./component/DebugRenderedInForeground";
import TileToBeExplored from "./component/TileToBeExplored";
import NPC from "./component/NPC";

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
  world.registerComponent(Body);
  world.registerComponent(Direction);
  world.registerComponent(Keyboard);
  world.registerComponent(Renderable);
  world.registerComponent(SpriteSheet);
  world.registerComponent(Player);
  world.registerComponent(NPC);
  world.registerComponent(Idle);
  world.registerComponent(Walking);
  world.registerComponent(AttackingWithClub);
  world.registerComponent(TiledMapFile);
  world.registerComponent(Grid);
  world.registerComponent(GridTile);
  world.registerComponent(PositionOnScreen);
  world.registerComponent(PositionOnGrid);
  world.registerComponent(AutoMoving);
  world.registerComponent(TileIsInThePathFound);
  world.registerComponent(TileToBeExplored);
  world.registerComponent(DebugRenderedInForeground);

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
    //if (tileValue > 0) {
      const entityId = `tile-${tileIndex}`;
      const collisionTileEntity = world.createEntity(entityId);
      // const { x, y } = getGridCoordinatesFromTile(tileIndex, gridConfig);
      const type = tileValue > 0 ? GridTileType.BLOCKED : GridTileType.FREE;
      collisionTileEntity.addComponent(GridTile, { tile: tileIndex, type });
      // collisionTileEntity.addComponent(PreRendered);
    //}
  });

  /**
   * Create all actor entities automatically from "entities.json" declaration file.
   */
  assets["entities/declarations"].forEach((entityDeclaration) => {
    const entity = world.createEntityFromDeclaration(entityDeclaration);
    // Entity Tile is depending on Position and Grid.
    if (entityDeclaration.components["GridTile"]  && entityDeclaration.components["PositionOnGrid"]) {
      const position = entity.getComponent(PositionOnScreen);

      const tileIndex = getTileFromPixelCoordinates(position.x, position.y, gridConfig);
      entity.addComponent(GridTile, {tile: tileIndex, type: GridTileType.FREE });

      const gridCoordinates = getGridCoordinatesFromTile(tileIndex, gridConfig);
      entity.addComponent(PositionOnGrid, {...gridCoordinates });
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
  world.createSystem(RenderingSystem, RenderableQuery, animationRegistry, $ctxForeground);

  const DebugRenderableQuery = world.createQuery("DebugRenderableQuery", { all: [DebugRenderedInForeground] });
  world.createSystem(DebugRenderingSystem, DebugRenderableQuery, $ctxForeground);

  /**
   * System that computes the path finding.
   */
  const PathFindingQuery = world.createQuery("PathFindingQuery", { all: [GridTile] });
  world.createSystem(AStarPathFindingSystem, PathFindingQuery, map);

  world.start(/*{fpsCap: 60}*/);

  // @ts-expect-error I'm too lazy to typehint window.
  window["engine"] = {
    world,
  };
}

setup().then(() => console.log("Game started ..."));
