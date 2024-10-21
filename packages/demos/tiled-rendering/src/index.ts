// 0. Create the UI and canvas.
import { createWrapperElement, createCanvas, run, dot, rectangle } from "@serbanghita-gamedev/renderer";
import { World } from "@serbanghita-gamedev/ecs";
import { PreRenderTiledMapSystem } from "@serbanghita-gamedev/renderer";
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
  const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
  const CANVAS_FOREGROUND = createCanvas("foreground", 640, 480, "2");
  const CTX_FOREGROUND = CANVAS_FOREGROUND.getContext("2d") as CanvasRenderingContext2D;
  const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "1");
  const CTX_BACKGROUND = CANVAS_BACKGROUND.getContext("2d") as CanvasRenderingContext2D;
  HTML_WRAPPER.appendChild(CANVAS_FOREGROUND);
  HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
  document.body.appendChild(HTML_WRAPPER);

  const SPRITES = await loadSprites();

  // Create the current "World" (scene).
  const world = new World();

  world.registerComponent(IsTiledMap);
  world.registerComponent(IsMatrix);
  world.registerComponent(IsCollisionTile);
  world.registerComponent(IsPreRendered);
  world.registerComponent(IsRenderedInForeground);
  world.registerComponent(IsPlayer);

  // Load the map from Tiled json file declaration.
  // Create a dedicated map entity.
  const map = world.createEntity("map");
  map.addComponent(IsTiledMap, { mapFile: require("./assets/maps/E1MM2.json"), mapFilePath: "./assets/maps/E1MM2.json" });
  // Load the "TiledMap" class wrapper over the json file declaration.
  const tiledMap = new TiledMap(map.getComponent(IsTiledMap).properties.mapFile);
  // Add the "collision" layer data to the map.
  const collisionLayer = tiledMap.getCollisionLayers()[0];
  map.addComponent(IsMatrix, { matrix: collisionLayer.data, width: collisionLayer.width, height: collisionLayer.height, tileSize: 16 });

  // Transform all collision tiles as entities.
  collisionLayer.data.forEach((tileValue, tileIndex) => {
    if (tileValue > 0) {
      const entityId = `collision-tile-${tileIndex}`;
      const collisionTileEntity = world.createEntity(entityId);
      let { x, y } = getTileCoordinates(tileIndex, map.getComponent(IsMatrix).properties);
      x = x + 16 / 2;
      y = y + 16 / 2;
      collisionTileEntity.addComponent(IsCollisionTile, { x, y, point: new Point(x, y, entityId) });
      collisionTileEntity.addComponent(IsPreRendered);
    }
  });

  const TiledMapQuery = world.createQuery("TiledMapQuery", { all: [IsTiledMap] });
  world.createSystem(PreRenderTiledMapSystem, TiledMapQuery, CANVAS_BACKGROUND, SPRITES["./assets/sprites/terrain.png"]).runOnlyOnce();

  // Quadtree
  const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
  const quadtree = new QuadTree(area, 5, 5);

  const CollisionTilesQuery = world.createQuery("CollisionTilesQuery", { all: [IsCollisionTile] });
  world.createSystem(PreRenderCollisionTilesSystem, CollisionTilesQuery, CTX_BACKGROUND).runOnlyOnce();

  const RenderingQuery = world.createQuery("RenderingQuery", { all: [IsRenderedInForeground] });
  world.createSystem(RenderingSystem, RenderingQuery, CTX_FOREGROUND, quadtree);
  const IsPlayerQuery = world.createQuery("IsPlayerQuery", { all: [IsPlayer] });
  world.createSystem(MoveSystem, IsPlayerQuery);
  world.createSystem(QuadTreeSystem, IsPlayerQuery, quadtree);

  CANVAS_FOREGROUND.addEventListener("dblclick", (event) => {
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
