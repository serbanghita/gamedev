import { createHtmlUiElements } from "@serbanghita-gamedev/renderer";
import { World } from "@serbanghita-gamedev/ecs";
import { RenderTiledMapTerrainSystem } from "@serbanghita-gamedev/renderer";
import { TiledMapFile, Tile, Renderable, TileMatrix } from "@serbanghita-gamedev/component";
import { loadSprites } from "./assets";
import { Point, Rectangle } from "@serbanghita-gamedev/geometry";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import { getCoordinatesFromTile, getTileFromCoordinates } from "@serbanghita-gamedev/matrix";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import QuadTreeSystem from "./system/QuadTreeSystem";
import PreRendered from "./component/PreRendered";
import PreRenderCollisionTilesSystem from "./system/PreRenderCollisionTilesSystem";
import RenderedInForeground from "./component/RenderedInForeground";
import RenderingSystem from "./system/RenderingSystem";
import Player from "./component/Player";
import MoveSystem from "./system/MoveSystem";

/**
 * In this demo I pre-rendered all tiles (Tile) from a Tiled (json) map (see assets/maps/E1MM2.json).
 * Then I added a Quad Tree implementation.
 * Then I added the possibility of adding random "Player" points that are rendered in the foreground
 * that move randomly but obey the occupied tiles.
 *
 */

async function setup() {
  /**
   * Create the UI and canvas.
   */
  const [, , $ctxBackground, $canvasForeground, $ctxForeground] = createHtmlUiElements();

  /**
   * Load sprite sheets IMGs.
   * This is annoying because I need to load the image binary into DOM in order to get
   * a HTMLImageElement instance which can be used in Canvas 2d.
   */
  const SPRITES = await loadSprites();

  /**
   * Create the current "World" (scene).
   * "World" class is part of the local ECS library.
   */
  const world = new World();
  /**
   * Why do you need to register components?
   * Because we assign them different bitmasks so we can have fast checks in the local ECS library when
   * performing a Query of Entities.
   */
  world.registerComponents([TiledMapFile, Tile, TileMatrix, PreRendered, RenderedInForeground, Player]);

  /**
   *  Load the map from Tiled json file declaration.
   *  Create a dedicated map entity.
   *  I will have to figure a way to dynamically load this.
   *  I believe I first statically load the whole list of Maps and then the player will be able to choose one.
   */
  const map = world.createEntity("map");
  map.addComponent(TiledMapFile, { mapFileContents: require("./assets/maps/E1MM2.json"), mapFilePath: "./assets/maps/E1MM2.json" });
  // Load the "TiledMap" class wrapper over the json file declaration.
  const tiledMap = new TiledMap(map.getComponent(TiledMapFile).mapFileContents);
  // Add the "collision" layer data to the map.
  // For now just take the first "collision" layer. We can have multiple collision layers defined in Tiled.
  // One examples is "collision_ai" layer which influences "negatively" the AI path finding.
  const collisionLayer = tiledMap.getCollisionLayers()[0];
  map.addComponent(TileMatrix, {
    matrix: collisionLayer.data,
    width: collisionLayer.width,
    height: collisionLayer.height,
    tileSize: tiledMap.getTileSize(),
  });
  // Transform all collision tiles as Entities.
  collisionLayer.data.forEach((tileValue, tileIndex) => {
    if (tileValue > 0) {
      const entityId = `collision-tile-${tileIndex}`;
      const collisionTileEntity = world.createEntity(entityId);
      let { x, y } = getCoordinatesFromTile(tileIndex, map.getComponent(TileMatrix).matrixConfig);
      x = x + tiledMap.getTileSize() / 2;
      y = y + tiledMap.getTileSize() / 2;
      collisionTileEntity.addComponent(Tile, { x, y, point: new Point(x, y, entityId) });
      collisionTileEntity.addComponent(PreRendered);
    }
  });

  /**
   *  Pre-rendering of the terrain.
   *  This system runs only once and then de-registers itself.
   */
  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [TiledMapFile] });
  world.createSystem(RenderTiledMapTerrainSystem, TiledMapQuery, $ctxBackground, SPRITES["./assets/sprites/terrain.png"]).runOnlyOnce();

  /**
   * Quadtree - for Entity body to body checks.
   * Start from a big rectangle made out of the entire map (e.g. 640x480)
   */
  const area = new Rectangle(
    tiledMap.getWidthInPx(),
    tiledMap.getHeightInPx(),
    new Point(tiledMap.getWidthInPx() / 2, tiledMap.getHeightInPx() / 2),
  );
  const quadtree = new QuadTree(area, 5, 5);

  /**
   *  Pre-rendering of the collision tiles for debug purposes.
   *  This system runs only once and then de-registers itself.
   */
  const CollisionTilesQuery = world.createQuery("CollisionTilesQuery", { all: [Tile] });
  world.createSystem(PreRenderCollisionTilesSystem, CollisionTilesQuery, $ctxBackground).runOnlyOnce();

  /**
   * System that renders all Entities that will appear in the foreground.
   */
  const RenderingQuery = world.createQuery("RenderingQuery", { all: [RenderedInForeground] });
  world.createSystem(RenderingSystem, RenderingQuery, $ctxForeground, quadtree);

  const IsPlayerQuery = world.createQuery("IsPlayerQuery", { all: [Player] });
  /**
   * Movement system (contains matrix collision checks).
   */
  world.createSystem(MoveSystem, IsPlayerQuery);
  /**
   * Quadtree - we re-make the quadtree every frame.
   */
  world.createSystem(QuadTreeSystem, IsPlayerQuery, quadtree);

  /**
   * Trigger to add Entities (Player) via click.
   */
  $canvasForeground.addEventListener("dblclick", (event) => {
    const x = event.clientX | 0;
    const y = event.clientY | 0;

    const map = world.getEntity("map");
    if (!map) {
      throw new Error(`Map entity has not been defined yet.`);
    }
    const mapMatrix = map.getComponent(TileMatrix);
    const tile = getTileFromCoordinates(x, y, mapMatrix.matrixConfig);

    if (mapMatrix.properties.matrix[tile] !== 0) {
      return;
    }

    const playerId = `player-${x}-${y}`;
    const player = world.createEntity(playerId);
    const point = new Point(x, y, playerId);

    player.addComponent(Tile, { point, matrixConfig: mapMatrix.matrixConfig});
    player.addComponent(RenderedInForeground);
    player.addComponent(Player);
    quadtree.addPoint(point);
  });

  world.start();
}

setup().then(() => console.log("Game started ..."));
