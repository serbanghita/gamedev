import { createCanvas, createWrapperElement, rectangle, circle, dot, run } from "@serbanghita-gamedev/renderer";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import { Rectangle, Point } from "@serbanghita-gamedev/geometry";
import { World } from "@serbanghita-gamedev/ecs";
import { Position, IsTiledMap } from "@serbanghita-gamedev/component";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import IsMatrix from "./IsMatrix";
import PositionSystem from "./PositionSystem";
import RenderingSystem from "./RenderingSystem";

const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
const quadtree = new QuadTree(area, 5, 10);

/******************************************************************
 * Render for demo
 * ****************************************************************/
const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "1");
HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
document.body.appendChild(HTML_WRAPPER);

const ctx = CANVAS_BACKGROUND.getContext("2d") as CanvasRenderingContext2D;

function renderQuadTree(quadtree: QuadTree) {
  rectangle(ctx, quadtree.area.topLeftX, quadtree.area.topLeftY, quadtree.area.width, quadtree.area.height, "rgba(0,0,0,0.1)");

  Object.values(quadtree.quadrants).forEach((subQuadtree) => {
    renderQuadTree(subQuadtree);
  });
}

/******************************************************************
 * Game definitions
 * ****************************************************************/
// Create the current "World" (scene).
const world = new World();

world.declarations.components.registerComponent(Position);
world.declarations.components.registerComponent(IsTiledMap);
world.declarations.components.registerComponent(IsMatrix);

const map = world.createEntity("map");
map.addComponent(IsTiledMap, { mapFile: require("./E1MM2.json"), mapFilePath: "./E1MM2.json" });

const tiledMapFile = map.getComponent(IsTiledMap).properties.mapFile;
const tiledMap = new TiledMap(tiledMapFile);

const matrix = world.createEntity("matrix");
matrix.addComponent(IsMatrix, { matrix: tiledMap.getCollisionLayers()[0] });

for (let w = 0; w < 640; w=w+10) {
  for (let h = 0; h < 480; h=h+10) {
    const entity = world.createEntity(`entity${w}-${h}`);
    entity.addComponent(Position, { x: w, y: h });
  }
}

const PointsQuery = world.createQuery("points", { all: [Position] });
world.createSystem(PositionSystem, PointsQuery); //.runEveryTicks(60);
world.createSystem(RenderingSystem, PointsQuery, ctx);

// const queryAreaCenterPoint = new Point(640 / 2, 480 / 2);
// const queryArea = new Rectangle(120, 120, queryAreaCenterPoint);
// points.forEach((point) => {
//   point.x += randomInt(-2, 2);
//   point.y += randomInt(-2, 2);
//   dot(ctx, point.x, point.y, "rgb(255,0,0)", 2);
// });

/******************************************************************
 * Game loop
 * ****************************************************************/
world.start(10);
