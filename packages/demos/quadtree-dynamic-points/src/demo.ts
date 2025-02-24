import { createCanvas, createWrapperElement, rectangle, circle, dot, run } from "@serbanghita-gamedev/renderer";
import { QuadTree } from "@serbanghita-gamedev/quadtree";
import { Rectangle, Point } from "@serbanghita-gamedev/geometry";

/**
 * This is a demo of a Quad Tree used for rudimentary collision detection.
 * All points are spawned and move randomly, while you move with the mouse over them and
 * "collide" with them.
 */

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Define the Quad Tree area.
 */
const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
const quadtree = new QuadTree(area, 5, 10);

const queryAreaCenterPoint = new Point(640 / 2, 480 / 2);
const queryArea = new Rectangle(120, 120, queryAreaCenterPoint);

/**
 * Generate random Points for later rendering.
 */
const points: Point[] = [];
for (let x = 0; x < 640 / 2; x += 3) {
  for (let y = 0; y < 480 / 2; y += 3) {
    points.push(new Point(x, y));
  }
}

/**
 * Create the <canvas> element.
 */
const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "1");
HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
document.body.appendChild(HTML_WRAPPER);
const ctx = CANVAS_BACKGROUND.getContext("2d") as CanvasRenderingContext2D;

/**
 * Recursive rendering method to render all the quadrants of the tree.
 */
function renderQuadTree(quadtree: QuadTree) {
  rectangle(ctx, quadtree.area.topLeftX, quadtree.area.topLeftY, quadtree.area.width, quadtree.area.height, "rgba(0,0,0,0.1)");

  // quadtree.points.forEach((point) => {
  //   renderCircle(ctx, point.x, point.y, 2, "red");
  // });

  Object.values(quadtree.quadrants).forEach((subQuadtree) => {
    renderQuadTree(subQuadtree);
  });
}

/**
 * Create the mouse interaction.
 */
let allowDraw = false;

CANVAS_BACKGROUND.addEventListener("mousedown", () => (allowDraw = true));
CANVAS_BACKGROUND.addEventListener("mouseup", () => (allowDraw = false));

CANVAS_BACKGROUND.addEventListener("mousemove", (event) => {
  if (!allowDraw) {
    return false;
  }
  const x = event.clientX | 0;
  const y = event.clientY | 0;

  // do smth.
  queryAreaCenterPoint.x = x;
  queryAreaCenterPoint.y = y;
});

console.log(quadtree);
console.log("No of points", points.length);

/******************************************************************
 * Game loop
 * ****************************************************************/
run(() => {
  ctx.clearRect(0, 0, 640, 480);
  // renderQuadTree(quadtree);
  points.forEach((point) => {
    point.x += randomInt(-2, 2);
    point.y += randomInt(-2, 2);
    dot(ctx, point.x, point.y, "rgb(255,0,0)", 2);
  });

  rectangle(ctx, queryArea.topLeftX, queryArea.topLeftY, queryArea.width, queryArea.height, "rgb(0,125,0)", "rgba(0,255,0,0.1)");

  quadtree.clear();
  points.forEach((point) => quadtree.addPoint(point));

  renderQuadTree(quadtree);

  const pointsFound = quadtree.query(queryArea);
  pointsFound.forEach((point) => {
    dot(ctx, point.x, point.y, "rgb(0,125,0)", 4);
  });
});
