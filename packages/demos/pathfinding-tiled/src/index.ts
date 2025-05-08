import { createHtmlUiElements, RenderTiledMapTerrainSystem } from "@serbanghita-gamedev/renderer";
import { loadSprites } from "./assets";
import { World } from "@serbanghita-gamedev/ecs";
import { TiledMapFile, TiledMap } from "@serbanghita-gamedev/tiled";
import { Point } from "@serbanghita-gamedev/geometry";
import { Grid, GridTile } from "@serbanghita-gamedev/grid";
import PreRendered from "./component/PreRendered";
import PreRenderCollisionTilesSystem from "./system/PreRenderCollisionTilesSystem";
import RenderingSystem from "./system/RenderingSystem";
import RenderedInForeground from "./component/RenderedInForeground";
import AStarPathFindingSystem from "./system/AStarPathFindingSystem";
import TileToBeExplored from "./component/TileToBeExplored";
import { getGridCoordinatesFromTile } from "@serbanghita-gamedev/grid/utils";
import { GridTileType } from "@serbanghita-gamedev/grid/component/GridTile";
import TileIsInThePathFound from "./component/TileIsInThePathFound";

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
  world.registerComponents([TiledMapFile, Grid, GridTile, PreRendered, RenderedInForeground, TileToBeExplored, TileIsInThePathFound]);

  /**
   *  Load the map from Tiled json file declaration.
   *  Create a dedicated map entity.
   *  I will have to figure a way to dynamically load this.
   *  I believe I first statically load the whole list of Maps and then the player will be able to choose one.
   */
  const map = world.createEntity("map");
  map.addComponent(TiledMapFile, { mapFileContents: require("./assets/map2.json"), mapFilePath: "./assets/map2.json" });
  // Load the "TiledMap" class wrapper over the json file declaration.
  const tiledMap = new TiledMap(map.getComponent(TiledMapFile).mapFileContents);
  // Add the "collision" layer data to the map.
  // For now just take the first "collision" layer. We can have multiple collision layers defined in Tiled.
  // One examples is "collision_ai" layer which influences "negatively" the AI path finding.
  const collisionLayer = tiledMap.getCollisionLayers()[0];
  const gridConfig = {
    matrix: collisionLayer.data,
    width: collisionLayer.width,
    height: collisionLayer.height,
    tileSize: tiledMap.getTileSize(),
  };
  map.addComponent(Grid, gridConfig);
  // Transform all collision tiles as Entities.
  collisionLayer.data.forEach((tileValue: number, tileIndex: number) => {
    const entityId = `tile-${tileIndex}`;
    const collisionTileEntity = world.createEntity(entityId);
    const { x, y } = getGridCoordinatesFromTile(tileIndex, gridConfig);

    // console.log(tileIndex, x, y);

    collisionTileEntity.addComponent(
      GridTile,
      {
        point: new Point(x, y, entityId),
        grid: map.getComponent(Grid),
        type: tileValue > 0 ? GridTileType.BLOCKED : GridTileType.FREE
      }
    );
    if (tileValue > 0) {
      collisionTileEntity.addComponent(PreRendered);
    }
  });

  /**
   *  Pre-rendering of the terrain.
   *  This system runs only once and then de-registers itself.
   */
  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [TiledMapFile] });
  world.createSystem(RenderTiledMapTerrainSystem, TiledMapQuery, $ctxBackground, SPRITES["./assets/terrain_sprite.png"]).runOnlyOnce();


  /**
   *  Pre-rendering of the collision tiles for debug purposes.
   *  This system runs only once and then de-registers itself.
   */
  const CollisionTilesQuery = world.createQuery("CollisionTilesQuery", { all: [GridTile] });
  world.createSystem(PreRenderCollisionTilesSystem, CollisionTilesQuery, $ctxBackground).runOnlyOnce();

  /**
   * System that renders all Entities that will appear in the foreground.
   */
  const RenderingQuery = world.createQuery("RenderingQuery", { all: [RenderedInForeground, TileToBeExplored, TileIsInThePathFound] });
  world.createSystem(RenderingSystem, RenderingQuery, $ctxForeground);

  /**
   * System that computes the path finding.
   */
  const PathFindingQuery = world.createQuery("PathFindingQuery", { all: [GridTile] });
  // world.createSystem(PathFindingSystem, PathFindingQuery, map, {x: 0, y: 0}, {x: 39, y: 19});
  // world.createSystem(AStarPathFindingSystem, PathFindingQuery, map, {x: 0, y: 0}, {x: 39, y: 19});
  world.createSystem(AStarPathFindingSystem, PathFindingQuery, map, {x: 9, y: 6}, {x: 11, y: 4});

  world.start({fpsCap: 60});
}

setup().then(() => console.log("Game started ..."));
