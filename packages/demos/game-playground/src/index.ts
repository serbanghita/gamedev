import { loadAssets } from "./assets";
import { World } from "@serbanghita-gamedev/ecs";
import { Body, Direction, Keyboard, Renderable, SpriteSheet, TiledMapFile, TileMatrix, Tile, Position } from "@serbanghita-gamedev/component";
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
import { TiledMap } from "@serbanghita-gamedev/tiled";
import { getCoordinatesFromTile } from "@serbanghita-gamedev/matrix";
import { Point } from "@serbanghita-gamedev/geometry";
import Player from "./component/Player";
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
  input.bindKey("f", InputActions.ACTION_1);
  input.listen();

  // Create the current "World" (scene).
  const world = new World();

  // Register "Components".
  world.registerComponents([
    Body, Direction, Keyboard,
    Renderable, SpriteSheet,
    Player, Idle, Walking, AttackingWithClub,
    TiledMapFile, TileMatrix, Tile,
    Position,
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
  map.addComponent(TileMatrix, {
    matrix: collisionLayer.data,
    width: collisionLayer.width,
    height: collisionLayer.height,
    tileSize: tiledMap.getTileSize(),
  });
  /**
   * Transform all collision tiles as Entities.
   */
  collisionLayer.data.forEach((tileValue, tileIndex) => {
    if (tileValue > 0) {
      const entityId = `collision-tile-${tileIndex}`;
      const collisionTileEntity = world.createEntity(entityId);
      let { x, y } = getCoordinatesFromTile(tileIndex, map.getComponent(TileMatrix).properties);
      x = x + tiledMap.getTileSize() / 2;
      y = y + tiledMap.getTileSize() / 2;
      collisionTileEntity.addComponent(Tile, { x, y, point: new Point(x, y, entityId) });
      // collisionTileEntity.addComponent(PreRendered);
    }
  });

  /**
   * Create all actor entities automatically from "entities.json" declaration file.
   */
  assets["entities/declarations"].forEach((entityDeclaration) => {
    const entity = world.createEntityFromDeclaration(entityDeclaration);
    // Entity Tile is depending on Position and TileMatrix.
    if (entityDeclaration.components["Tile"]) {
      entity.addComponent(Tile, {
        point: entity.getComponent(Position).point,
        matrixConfig: map.getComponent(TileMatrix).matrixConfig
      });
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

  const AttackingWithClubQuery = world.createQuery("AttackingWithClubQuery", { all: [AttackingWithClub] });
  world.createSystem(AttackingWithClubSystem, AttackingWithClubQuery);

  const RenderableQuery = world.createQuery("RenderableQuery", { all: [Renderable, SpriteSheet, Tile] });
  world.createSystem(RenderSystem, RenderableQuery, animationRegistry, $ctxForeground);

  world.start({fpsCap: 60});

  // @ts-expect-error I'm too lazy to typehint window.
  window["engine"] = {
    world,
  };
}

setup().then(() => console.log("Game started ..."));
