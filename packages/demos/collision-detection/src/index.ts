import { createCanvas, createWrapperElement, rectangle, circle, dot, run, text } from "@serbanghita-gamedev/renderer";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import { Rectangle, Point } from "@serbanghita-gamedev/geometry";
import { World } from "@serbanghita-gamedev/ecs";
import { TiledMapFile } from "@serbanghita-gamedev/component";
import { TiledMap } from "@serbanghita-gamedev/tiled";
import IsMatrix from "./IsMatrix";
import PositionSystem from "./PositionSystem";
import RenderingSystem from "./RenderingSystem";
import { randomInt } from "./helpers";
import QuadTreeSystem from "./QuadTreeSystem";
import CollisionSystem from "./CollisionSystem";
import PhysicsBody from "./PhysicsBody";
import IsPlayer from "./IsPlayer";
import IsRendered from "./IsRendered";

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

world.declarations.components.registerComponent(TiledMapFile);
world.declarations.components.registerComponent(IsMatrix);
world.declarations.components.registerComponent(PhysicsBody);
world.declarations.components.registerComponent(IsPlayer);
world.declarations.components.registerComponent(IsRendered);

const map = world.createEntity("map");
map.addComponent(TiledMapFile, { mapFile: require("./E1MM2.json"), mapFilePath: "./E1MM2.json" });

const tiledMapFile = map.getComponent(TiledMapFile).properties.mapFile;
const tiledMap = new TiledMap(tiledMapFile);

const matrix = world.createEntity("matrix");
matrix.addComponent(IsMatrix, { matrix: tiledMap.getCollisionLayers()[0] });

const player = world.createEntity("player");
const playerPoint = new Point(320, 240);
const playerRectangle = new Rectangle(50, 50, playerPoint);
player.addComponent(PhysicsBody, { width: 50, height: 50, rectangle: playerRectangle, point: playerPoint });
player.addComponent(IsPlayer);
player.addComponent(IsRendered);

for (let coordX = 0; coordX < 640; coordX = coordX + 10) {
  for (let coordY = 0; coordY < 480; coordY = coordY + 10) {
    const id = `entity${coordX}-${coordY}`;
    const entity = world.createEntity(id);
    const x = coordX;
    const y = coordY;

    const point = new Point(x, y, id);
    // Redundant x, y, but I'm yet to decide on the structure since
    // a component must only be a container of data, but I also need
    // the Point reference in order to perform operations.

    const width = randomInt(1, 10);
    const height = randomInt(1, 10);
    const rectangle = new Rectangle(width, height, point);
    entity.addComponent(PhysicsBody, { width, height, rectangle, point });
    entity.addComponent(IsRendered);
  }
}

const PointsQuery = world.createQuery("points", { all: [PhysicsBody], none: [IsPlayer] });
const PhysicsQuery = world.createQuery("physics", { all: [PhysicsBody] });
const RenderableQuery = world.createQuery("renderable", { all: [IsRendered] });
world.createSystem(PositionSystem, PointsQuery);
world.createSystem(QuadTreeSystem, PhysicsQuery, quadtree);
world.createSystem(CollisionSystem, PhysicsQuery, quadtree);
world.createSystem(RenderingSystem, RenderableQuery, ctx);

/******************************************************************
 * Mouse
 * ****************************************************************/
let allowDraw = false;

CANVAS_BACKGROUND.addEventListener("mousedown", () => (allowDraw = true));
CANVAS_BACKGROUND.addEventListener("mouseup", () => (allowDraw = false));

CANVAS_BACKGROUND.addEventListener("mousemove", (event) => {
  if (!allowDraw) {
    return false;
  }
  const x = event.clientX | 0;
  const y = event.clientY | 0;

  playerPoint.x = x;
  playerPoint.y = y;
});

/******************************************************************
 * Game loop
 * ****************************************************************/
world.start({fpsCap: 60, callbackFnAfterSystemsUpdate: () => {
    renderQuadTree(quadtree);
    text(ctx, `fps: ${world.fps}`, 440, 420, "20", "serif", "white", "black");
    text(ctx, `frame duration: ${world.frameDuration}`, 440, 440, "20", "serif", "white", "black");
    text(ctx, `fps cap: ${world.fpsCap}`, 440, 460, "20", "serif", "white", "black");
    text(ctx, `frame no: ${world.frameNo}`, 440, 480, "20", "serif", "white", "black");
}});
