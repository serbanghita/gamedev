import { createCanvas, createWrapperElement, rectangle, circle, dot, run } from "@serbanghita-gamedev/renderer";
import QuadTree from "./QuadTree";
import { Rectangle, Point } from "@serbanghita-gamedev/geometry";

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const HTML_WRAPPER = createWrapperElement("game-wrapper", 640, 480);
const CANVAS_BACKGROUND = createCanvas("background", 640, 480, "1");
HTML_WRAPPER.appendChild(CANVAS_BACKGROUND);
document.body.appendChild(HTML_WRAPPER);

const area = new Rectangle(640, 480, new Point(640 / 2, 480 / 2));
const quadtree = new QuadTree(area, 5, 10);

for (let x = 0; x < 640 / 2; x += 16) {
  for (let y = 0; y < 480 / 2; y += 16) {
    quadtree.addPoint(new Point(x, y));
  }
}

// for (let i = 0; i < 3000; i++) {
//   const point = new Point(randomInt(0, 640), randomInt(0, 480));
//   quadtree.candidatePoint(point);
// }

// const queryArea = new Rectangle(120, 120, new Point(randomInt(0, 640), randomInt(0, 480)));
const queryArea = new Rectangle(120, 120, new Point(640 / 2, 480 / 2));
const pointsFound = quadtree.query(queryArea);

// Case 1. (only one root quadrant).
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
// ];

// // Case 2. (4 quadrants)
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
//
//     [400, 50],
//     [400, 70],
//     [400, 80],
//
//     [100, 450],
//     [100, 470],
//     [100, 480],
//
//     [400, 450],
//     [400, 470],
//     [400, 480],
// ];

// Case 3.
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
//     [200, 80]
// ];

// Case 4.
// const points = [
//     [100, 50],
//     [100, 70],
//     [100, 80],
//     [200, 80],
//     [210, 80],
//     [220, 80],
//     [230, 80]
// ];
// //

// Case 5.
// const points = [
//   [10, 10],
//   [10, 20],
//   [10, 30],
//   [10, 40],
//   [10, 50],
// ];

// points.forEach((arr) => {
//   const point = new Point(arr[0], arr[1]);
//   quadtree.candidatePoint(point);
// });

/******************************************************************
 * Render for demo
 * ****************************************************************/
const ctx = CANVAS_BACKGROUND.getContext("2d") as CanvasRenderingContext2D;

function renderQuadTree(quadtree: QuadTree) {
  rectangle(ctx, quadtree.area.topLeftX, quadtree.area.topLeftY, quadtree.area.width, quadtree.area.height, "rgba(0,0,0)");

  quadtree.points.forEach((point) => {
    // circle(ctx, point.x, point.y, 2, "red");
    dot(ctx, point.x, point.y, "red");
  });

  Object.values(quadtree.quadrants).forEach((subQuadtree) => {
    renderQuadTree(subQuadtree);
  });
}
let allowDraw = false;

CANVAS_BACKGROUND.addEventListener("mousedown", () => (allowDraw = true));
CANVAS_BACKGROUND.addEventListener("mouseup", () => (allowDraw = false));

CANVAS_BACKGROUND.addEventListener("mousemove", (event) => {
  if (!allowDraw) {
    return false;
  }
  const x = event.clientX | 0;
  const y = event.clientY | 0;
  // console.log(x, y);
  quadtree.addPoint(new Point(x, y));
});

console.log(quadtree);
console.log(pointsFound);
/******************************************************************
 * Game loop
 * ****************************************************************/
run(() => {
  ctx.clearRect(0, 0, 640, 480);
  renderQuadTree(quadtree);

  rectangle(ctx, queryArea.topLeftX, queryArea.topLeftY, queryArea.width, queryArea.height, "green", "rgba(0,255,0,0.1)");

  pointsFound.forEach((point) => {
    // circle(ctx, point.x, point.y, 2, "green", "green");
    dot(ctx, point.x, point.y, "green");
  });
});

// run(() => {
//   ctx.clearRect(0, 0, 640, 480);
//
//   renderRectangle(ctx, queryArea.topLeftX, queryArea.topLeftY, queryArea.width, queryArea.height, "green", "rgba(0,255,0,0.1)");
// });
