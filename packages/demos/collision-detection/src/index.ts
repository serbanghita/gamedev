import { createCanvas, createWrapperElement, rectangle, circle, dot, run } from "@serbanghita-gamedev/renderer";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import { Rectangle, Point } from "@serbanghita-gamedev/geometry";
import { World } from "@serbanghita-gamedev/ecs";
import { IsTiledMap } from "@serbanghita-gamedev/component";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import IsMatrix from "./IsMatrix";
import PositionSystem from "./PositionSystem";
import RenderingSystem from "./RenderingSystem";
import { randomInt } from "./helpers";
import QuadTreeSystem from "./QuadTreeSystem";
import CollisionSystem from "./CollisionSystem";
import PhysicsBody from "./PhysicsBody";

const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
const quadtree = new QuadTree(area, 5, 5);

// @ts-ignore
window["quadtree"] = quadtree;

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

world.declarations.components.registerComponent(IsTiledMap);
world.declarations.components.registerComponent(IsMatrix);
world.declarations.components.registerComponent(PhysicsBody);

const map = world.createEntity("map");
map.addComponent(IsTiledMap, { mapFile: require("./E1MM2.json"), mapFilePath: "./E1MM2.json" });

const tiledMapFile = map.getComponent(IsTiledMap).properties.mapFile;
const tiledMap = new TiledMap(tiledMapFile);

const matrix = world.createEntity("matrix");
matrix.addComponent(IsMatrix, { matrix: tiledMap.getCollisionLayers()[0] });

for (let coordX = 0; coordX < 640; coordX = coordX + 30) {
  for (let coordY = 0; coordY < 480; coordY = coordY + 30) {
    const id = `entity${coordX}-${coordY}`;
    const entity = world.createEntity(id);
    const x = coordX;
    const y = coordY;

    const point = new Point(x, y, id);
    // Redundant x, y, but I'm yet to decide on the structure since
    // a component must only be a container of data, but I also need
    // the Point reference in order to perform operations.

    const width = randomInt(10, 20);
    const height = randomInt(10, 20);
    const rectangle = new Rectangle(width, height, point);
    entity.addComponent(PhysicsBody, { width, height, rectangle, point });
  }
}

const PointsQuery = world.createQuery("points", { all: [PhysicsBody] });
world.createSystem(PositionSystem, PointsQuery); // .runEveryTicks(30);
world.createSystem(QuadTreeSystem, PointsQuery, quadtree); // .runEveryTicks(10);
world.createSystem(CollisionSystem, PointsQuery, quadtree); //.runEveryTicks(10);
world.createSystem(RenderingSystem, PointsQuery, ctx);

/******************************************************************
 * Game loop
 * ****************************************************************/
world.start(2, () => {
  renderQuadTree(quadtree);
  console.log("entities", world.entities.size);
});
