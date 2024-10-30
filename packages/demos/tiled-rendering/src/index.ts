import { createHtmlUiElements } from "@serbanghita-gamedev/renderer";
import { World } from "@serbanghita-gamedev/ecs";
import { RenderTiledMapTerrainSystem } from "@serbanghita-gamedev/renderer";
import { IsTiledMap, Renderable } from "@serbanghita-gamedev/component";
import { loadSprites } from "./assets";
import { Point, Rectangle } from "@serbanghita-gamedev/geometry";
import IsMatrix from "./IsMatrix";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import { getTileCoordinates, getTileFromCoordinates } from "@serbanghita-gamedev/matrix";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import QuadTreeSystem from "./QuadTreeSystem";
import IsCollisionTile from "./IsCollisionTile";
import IsPreRendered from "./IsPreRendered";
import PreRenderCollisionTilesSystem from "./PreRenderCollisionTilesSystem";
import IsRenderedInForeground from "./IsRenderedInForeground";
import RenderingSystem from "./RenderingSystem";
import IsPlayer from "./IsPlayer";
import MoveSystem from "./MoveSystem";

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
  world.registerComponents([IsTiledMap, IsMatrix, IsCollisionTile, IsPreRendered, IsRenderedInForeground, IsPlayer]);

  /**
   *  Load the map from Tiled json file declaration.
   *  Create a dedicated map entity.
   *  I will have to figure a way to dynamically load this.
   *  I believe I first statically load the whole list of Maps and then the player will be able to choose one.
   */
  const map = world.createEntity("map");
  map.addComponent(IsTiledMap, { mapFile: require("./assets/maps/E1MM2.json"), mapFilePath: "./assets/maps/E1MM2.json" });
  // Load the "TiledMap" class wrapper over the json file declaration.
  const tiledMap = new TiledMap(map.getComponent(IsTiledMap).properties.mapFile);
  // Add the "collision" layer data to the map.
  // For now just take the first "collision" layer. We can have multiple collision layers defined in Tiled.
  // One examples is "collision_ai" layer which influences "negatively" the AI path finding.
  const collisionLayer = tiledMap.getCollisionLayers()[0];
  map.addComponent(IsMatrix, {
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
      let { x, y } = getTileCoordinates(tileIndex, map.getComponent(IsMatrix).properties);
      x = x + tiledMap.getTileSize() / 2;
      y = y + tiledMap.getTileSize() / 2;
      collisionTileEntity.addComponent(IsCollisionTile, { x, y, point: new Point(x, y, entityId) });
      collisionTileEntity.addComponent(IsPreRendered);
    }
  });

  /**
   *  Pre-rendering of the terrain.
   *  This system runs only once and then de-registers itself.
   */
  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [IsTiledMap] });
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
  const CollisionTilesQuery = world.createQuery("CollisionTilesQuery", { all: [IsCollisionTile] });
  world.createSystem(PreRenderCollisionTilesSystem, CollisionTilesQuery, $ctxBackground).runOnlyOnce();

  /**
   * System that renders all Entities that will appear in the foreground.
   */
  const RenderingQuery = world.createQuery("RenderingQuery", { all: [IsRenderedInForeground] });
  world.createSystem(RenderingSystem, RenderingQuery, $ctxForeground, quadtree);

  const IsPlayerQuery = world.createQuery("IsPlayerQuery", { all: [IsPlayer] });
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
    const mapMatrix = map.getComponent(IsMatrix);
    const tile = getTileFromCoordinates(x, y, mapMatrix.properties);

    if (mapMatrix.properties.matrix[tile] !== 0) {
      return;
    }

    const playerId = `player-${x}-${y}`;
    const player = world.createEntity(playerId);
    const point = new Point(x, y, playerId);

    player.addComponent(IsCollisionTile, { x, y, point, tile });
    player.addComponent(IsRenderedInForeground);
    player.addComponent(IsPlayer);
    quadtree.addPoint(point);
  });

  world.start(0, () => {});
}

setup().then(() => console.log("Game started ..."));
